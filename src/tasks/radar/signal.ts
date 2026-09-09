import { z } from "zod";

// Radar 的 domain：多语言 source discovery / reading inbox。
// Agent 负责发现并整理候选；Human-facing surface 负责阅读、判断和后续思考。
// 这不是告警系统，因此 importance / status 不是 canonical domain fields。

export const RADAR_DECISIONS = ["saved", "dismissed"] as const;
export type RadarDecision = (typeof RADAR_DECISIONS)[number];

export type RadarEngagement = Record<string, string | number>;

export type RadarItem = {
  id: string;
  title: string;
  topic: string;
  source: string;
  author?: string;
  language?: string;
  url?: string;
  publishedAt?: string;
  engagement?: RadarEngagement;
  summary: string;
  argumentMap: string[];
  whyWorthReading: string;
  critique: string;
  createdAt: string;
  updatedAt: string;
  unread: boolean;
  /** 只由 Human interaction layer 写入；Agent ingest 不能声明这个字段。 */
  humanDecision?: RadarDecision;
  /** Forward-compatible task attributes. */
  [key: string]: unknown;
};

// 旧代码文件名仍叫 signal-*，先保留别名避免无意义的大规模 rename。
export type Signal = RadarItem;

export const TITLE_MAX = 180;
export const SUMMARY_MAX = 8000;
export const NOTE_MAX = 2400;

const EngagementSchema = z
  .record(z.string(), z.union([z.string(), z.number()]))
  .optional();

const RadarItemSchema = z
  .object({
    id: z.string().trim().min(1),
    title: z.string().trim().min(1).max(TITLE_MAX),
    topic: z.string().optional().default(""),
    source: z.string().optional().default(""),
    author: z.string().optional(),
    language: z.string().optional(),
    url: z.string().optional(),
    publishedAt: z.string().optional(),
    engagement: EngagementSchema,
    summary: z.string().max(SUMMARY_MAX).optional(),
    argumentMap: z.array(z.string()).max(24).optional().default([]),
    whyWorthReading: z.string().max(NOTE_MAX).optional(),
    critique: z.string().max(NOTE_MAX).optional().default(""),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    unread: z.boolean().optional(),

    // Legacy prototype fields: accepted only as migration input, then normalized.
    detail: z.string().max(SUMMARY_MAX).optional(),
    suggestion: z.string().max(NOTE_MAX).optional(),
    href: z.string().optional(),
  })
  .loose();

export type ParseSignalResult =
  | { ok: true; signal: RadarItem }
  | { ok: false; error: string };

function normalizeIsoDate(value: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T/.test(value)) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function preservedExtras(input: Record<string, unknown>): Record<string, unknown> {
  const knownOrReserved = new Set([
    "id",
    "title",
    "topic",
    "source",
    "author",
    "language",
    "url",
    "publishedAt",
    "engagement",
    "summary",
    "argumentMap",
    "whyWorthReading",
    "critique",
    "createdAt",
    "updatedAt",
    "unread",
    "detail",
    "suggestion",
    "href",
    "humanDecision",
    "decision",
    "status",
  ]);
  return Object.fromEntries(
    Object.entries(input).filter(([key]) => !knownOrReserved.has(key)),
  );
}

export function parseSignal(input: unknown): ParseSignalResult {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Radar item 必须是一个 JSON 对象" };
  }

  const parsed = RadarItemSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "radarItem";
        return `${path}: ${issue.message}`;
      })
      .join("; ");
    return { ok: false, error: message };
  }

  const data = parsed.data;
  const createdAt = normalizeIsoDate(data.createdAt);
  const updatedAt = normalizeIsoDate(data.updatedAt);
  const publishedAt = data.publishedAt
    ? normalizeIsoDate(data.publishedAt)
    : undefined;
  if (!createdAt || !updatedAt || (data.publishedAt && !publishedAt)) {
    return {
      ok: false,
      error: "createdAt / updatedAt / publishedAt 必须是 ISO-8601 date-time",
    };
  }

  const extras = preservedExtras(input as Record<string, unknown>);
  const signal: RadarItem = {
    ...extras,
    id: data.id,
    title: data.title,
    topic: data.topic,
    source: data.source,
    ...(data.author ? { author: data.author } : {}),
    ...(data.language ? { language: data.language } : {}),
    ...(data.url || data.href ? { url: data.url ?? data.href } : {}),
    ...(publishedAt ? { publishedAt } : {}),
    ...(data.engagement ? { engagement: data.engagement } : {}),
    summary: data.summary ?? data.detail ?? "",
    argumentMap: data.argumentMap,
    whyWorthReading: data.whyWorthReading ?? data.suggestion ?? "",
    critique: data.critique,
    createdAt,
    updatedAt,
    unread: data.unread ?? true,
  };
  return { ok: true, signal };
}

export function sortSignals(signals: RadarItem[]): RadarItem[] {
  return [...signals].sort((a, b) => {
    const byTime = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    if (byTime !== 0) return byTime;
    return a.id.localeCompare(b.id);
  });
}

export const DECISION_LABEL: Record<RadarDecision, string> = {
  saved: "留待细读",
  dismissed: "略过",
};

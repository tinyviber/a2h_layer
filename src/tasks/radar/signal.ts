import { z } from "zod";

// Radar 的数据模型：一条「信号」。
// Radar 观察几个主题；Agent（或未来的自动化流程）产出需要人判断的信号。
// 机器投信号，人决定：跟进 / 忽略。

export const IMPORTANCES = ["low", "medium", "high"] as const;
export const SIGNAL_STATUSES = ["new", "followed", "dismissed"] as const;

export type SignalImportance = (typeof IMPORTANCES)[number];
export type SignalStatus = (typeof SIGNAL_STATUSES)[number];

export type Signal = {
  id: string;
  /** 一句话：发生了什么、需要你看什么。 */
  title: string;
  /** 属于哪个观察主题。 */
  topic: string;
  /** 来源：github / rss / search / agent … */
  source: string;
  importance: SignalImportance;
  /** 可选：更完整的说明（纯文本，按段落显示）。 */
  detail: string;
  /** 建议动作，一句话。 */
  suggestion: string;
  /** 可选：来源链接。 */
  href?: string;
  createdAt: string;
  updatedAt: string;
  unread: boolean;
  status: SignalStatus;
};

export const TITLE_MAX = 100;
export const DETAIL_MAX = 8000;
export const SUGGESTION_MAX = 200;

const SignalSchema = z
  .object({
    id: z.string().trim().min(1),
    title: z.string().trim().min(1).max(TITLE_MAX),
    topic: z.string(),
    source: z.string(),
    importance: z.enum(IMPORTANCES),
    detail: z.string().max(DETAIL_MAX).optional().default(""),
    suggestion: z.string().max(SUGGESTION_MAX).optional().default(""),
    href: z.string().optional(),
    createdAt: z.string().min(1),
    updatedAt: z.string().min(1),
    unread: z.boolean().optional(),
    status: z.enum(SIGNAL_STATUSES).optional(),
  })
  .loose();

export type ParseSignalResult =
  | { ok: true; signal: Signal }
  | { ok: false; error: string };

function isIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

export function parseSignal(input: unknown): ParseSignalResult {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "信号必须是一个 JSON 对象" };
  }
  const parsed = SignalSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "signal";
        return `${path}: ${issue.message}`;
      })
      .join("; ");
    return { ok: false, error: message };
  }
  const data = parsed.data;
  if (!isIsoDate(data.createdAt) || !isIsoDate(data.updatedAt)) {
    return { ok: false, error: "createdAt / updatedAt 必须是 ISO-8601" };
  }
  const signal: Signal = {
    id: data.id,
    title: data.title,
    topic: data.topic,
    source: data.source,
    importance: data.importance,
    detail: data.detail,
    suggestion: data.suggestion,
    ...(data.href ? { href: data.href } : {}),
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    unread: data.unread ?? true,
    status: data.status ?? "new",
  };
  return { ok: true, signal };
}

export function sortSignals(signals: Signal[]): Signal[] {
  return [...signals].sort((a, b) => {
    const byTime = b.updatedAt.localeCompare(a.updatedAt);
    if (byTime !== 0) return byTime;
    return a.id.localeCompare(b.id);
  });
}

export const IMPORTANCE_LABEL: Record<SignalImportance, string> = {
  low: "低",
  medium: "中",
  high: "高",
};

export const STATUS_LABEL: Record<SignalStatus, string> = {
  new: "待判断",
  followed: "跟进",
  dismissed: "忽略",
};

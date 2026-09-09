import { z } from "zod";
import {
  ACTION_LABEL_MAX,
  AGENTS,
  MARKDOWN_MAX,
  STATUSES,
  SUMMARY_ITEM_MAX,
  SUMMARY_MAX_ITEMS,
  TITLE_MAX,
  type Block,
  type Run,
} from "./run-types.ts";

const NextActionSchema = z
  .object({
    label: z.string().trim().min(1).max(ACTION_LABEL_MAX),
    href: z.string().optional(),
  })
  .loose();

const BlockSchema = z
  .object({
    type: z.string().min(1),
    id: z.string().optional(),
    text: z.string().optional(),
    path: z.string().optional(),
    language: z.string().optional(),
    command: z.string().optional(),
    exitCode: z.number().optional(),
    caption: z.string().optional(),
    note: z.string().optional(),
    columns: z.array(z.string()).optional(),
    rows: z.array(z.array(z.string())).optional(),
  })
  .loose();

export const RunSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1).max(TITLE_MAX),
  agent: z.enum(AGENTS),
  project: z.string(),
  status: z.enum(STATUSES),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
  unread: z.boolean().optional(),
  summary: z.array(z.string().max(SUMMARY_ITEM_MAX)).max(SUMMARY_MAX_ITEMS),
  nextActions: z.array(NextActionSchema),
  blocks: z.array(BlockSchema),
});

export type ParseRunResult =
  | { ok: true; run: Run }
  | { ok: false; error: string };

function isIsoDate(value: string): boolean {
  return !Number.isNaN(Date.parse(value));
}

function toBlock(raw: Record<string, unknown>): Block {
  const block: Block = { type: String(raw.type) };
  if (typeof raw.id === "string") block.id = raw.id;
  if (typeof raw.text === "string") block.text = raw.text;
  if (typeof raw.path === "string") block.path = raw.path;
  if (typeof raw.language === "string") block.language = raw.language;
  if (typeof raw.command === "string") block.command = raw.command;
  if (typeof raw.exitCode === "number") block.exitCode = raw.exitCode;
  if (typeof raw.caption === "string") block.caption = raw.caption;
  if (typeof raw.note === "string") block.note = raw.note;
  if (Array.isArray(raw.columns)) {
    block.columns = raw.columns.map((item) => String(item));
  }
  if (Array.isArray(raw.rows)) {
    block.rows = raw.rows.map((row) =>
      Array.isArray(row) ? row.map((cell) => String(cell)) : [],
    );
  }
  const known = new Set([
    "type",
    "id",
    "text",
    "path",
    "language",
    "command",
    "exitCode",
    "caption",
    "note",
    "columns",
    "rows",
  ]);
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(raw)) {
    if (known.has(key)) continue;
    rest[key] = value;
  }
  if (Object.keys(rest).length) {
    block.restJson = JSON.stringify(rest);
  }
  return block;
}

export function parseRun(input: unknown): ParseRunResult {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return { ok: false, error: "Run 必须是一个 JSON 对象" };
  }

  const parsed = RunSchema.safeParse(input);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => {
        const path = issue.path.length ? issue.path.join(".") : "run";
        return `${path}: ${issue.message}`;
      })
      .join("; ");
    return { ok: false, error: message };
  }

  const data = parsed.data;
  if (!isIsoDate(data.createdAt)) {
    return { ok: false, error: "createdAt 必须是 ISO-8601" };
  }
  if (!isIsoDate(data.updatedAt)) {
    return { ok: false, error: "updatedAt 必须是 ISO-8601" };
  }

  for (const block of data.blocks) {
    if (block.type === "markdown" && typeof block.text === "string") {
      if (block.text.length > MARKDOWN_MAX) {
        return {
          ok: false,
          error: `markdown 块 ${block.id ?? "?"} 超过 ${MARKDOWN_MAX} 字`,
        };
      }
    }
  }

  const rawBlocks = (input as { blocks: Array<Record<string, unknown>> }).blocks;
  const run: Run = {
    id: data.id,
    title: data.title,
    agent: data.agent,
    project: data.project,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    unread: data.unread ?? true,
    summary: data.summary,
    nextActions: data.nextActions.map((action) => ({
      label: action.label,
      ...(action.href ? { href: action.href } : {}),
    })),
    blocks: rawBlocks.map((block) => toBlock(block)),
  };
  return { ok: true, run };
}

export function sortRuns(runs: Run[]): Run[] {
  return [...runs].sort((a, b) => {
    const byTime = b.updatedAt.localeCompare(a.updatedAt);
    if (byTime !== 0) return byTime;
    return a.id.localeCompare(b.id);
  });
}

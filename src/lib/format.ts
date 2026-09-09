import type { Agent, RunStatus } from "./run-types";

export const STATUS_LABEL: Record<RunStatus, string> = {
  running: "进行中",
  success: "成功",
  failed: "失败",
  partial: "部分完成",
};

export const AGENT_LABEL: Record<Agent, string> = {
  codex: "Codex",
  "claude-code": "Claude Code",
  grok: "Grok",
  openclaw: "OpenClaw",
  other: "Other",
};

export function formatRelative(iso: string, now = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;

  const diff = now.getTime() - date.getTime();
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfThat = new Date(date);
  startOfThat.setHours(0, 0, 0, 0);
  const dayDiff = Math.round(
    (startOfToday.getTime() - startOfThat.getTime()) / day,
  );
  if (dayDiff === 1) return "昨天";
  if (dayDiff > 1 && dayDiff < 7) return `${dayDiff} 天前`;
  return date.toISOString().slice(0, 10);
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function safeHref(href?: string): string | undefined {
  if (!href) return undefined;
  const value = href.trim();
  if (
    value.startsWith("#") ||
    value.startsWith("/") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("mailto:")
  ) {
    return value;
  }
  return undefined;
}

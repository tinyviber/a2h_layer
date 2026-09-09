import { createServerFn } from "@tanstack/react-start";
import { listRuns } from "@/lib/run-store";
import { listSignals } from "@/tasks/radar/signal-store";
import { TASKS } from "./tasks";
import type { HomeItem, TaskSummary } from "./types";

type ItemLike = { id: string; title: string; updatedAt: string; unread: boolean };

function toItems(items: ItemLike[]): HomeItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    updatedAt: item.updatedAt,
    unread: item.unread !== false,
  }));
}

/** 纯函数：把两个任务的条目拼成 Home 概览。server 与 client 兜底共用。 */
export function buildHomeSummary(
  signals: ItemLike[],
  runs: ItemLike[],
): TaskSummary[] {
  const byId: Record<string, ItemLike[]> = {
    radar: signals,
    coding: runs,
  };
  return TASKS.map((meta) => ({
    ...meta,
    items: toItems(byId[meta.id] ?? []),
  }));
}

export const getHomeFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<TaskSummary[]> => {
    return buildHomeSummary(listSignals(), listRuns());
  },
);

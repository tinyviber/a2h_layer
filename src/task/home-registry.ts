import { listFixtureRuns } from "@/lib/fixtures";
import { listRuns } from "@/lib/run-store";
import { listFixtureSignals } from "@/tasks/radar/signal-fixtures";
import { listSignals } from "@/tasks/radar/signal-store";
import { getTaskMeta } from "./tasks";
import type { HomeItem, TaskSummary } from "./types";

type ItemLike = { id: string; title: string; updatedAt: string; unread?: boolean };

type HomeProvider = {
  taskId: string;
  load: () => TaskSummary;
  fixture: () => TaskSummary;
};

function toItems(items: ItemLike[]): HomeItem[] {
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    updatedAt: item.updatedAt,
    unread: item.unread !== false,
  }));
}

function localReadSummary(taskId: string, storageKey: string, items: ItemLike[]): TaskSummary {
  const meta = getTaskMeta(taskId);
  if (!meta) throw new Error(`Unknown task: ${taskId}`);
  const projected = toItems(items);
  return {
    ...meta,
    attention: { kind: "local-read", storageKey, items: projected },
    ...(projected[0] ? { latest: projected[0] } : {}),
  };
}

/**
 * Task-specific Home adapters live here, outside the generic Home aggregator.
 * Adding a Task may require one adapter, but Home itself never needs to know
 * whether the Task internally uses Runs, Sources, a workflow, or something else.
 */
export const HOME_PROVIDERS: HomeProvider[] = [
  {
    taskId: "radar",
    load: () => localReadSummary("radar", "aor:radar-read-ids", listSignals()),
    fixture: () =>
      localReadSummary("radar", "aor:radar-read-ids", listFixtureSignals()),
  },
  {
    taskId: "coding",
    load: () => localReadSummary("coding", "aor:read-ids", listRuns()),
    fixture: () => localReadSummary("coding", "aor:read-ids", listFixtureRuns()),
  },
];

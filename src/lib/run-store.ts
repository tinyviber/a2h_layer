import { getFixtureRun, listFixtureRuns } from "./fixtures";
import { sortRuns } from "./run-contract";
import type { Run } from "./run-types";

const extras = new Map<string, Run>();

export function listRuns(): Run[] {
  const byId = new Map<string, Run>();
  for (const run of listFixtureRuns()) byId.set(run.id, run);
  for (const run of extras.values()) byId.set(run.id, run);
  return sortRuns([...byId.values()]);
}

export function getRun(id: string): Run | null {
  return extras.get(id) ?? getFixtureRun(id) ?? null;
}

export function ingestRun(run: Run): Run {
  const stored: Run = { ...run, unread: run.unread ?? true };
  extras.set(stored.id, stored);
  return stored;
}

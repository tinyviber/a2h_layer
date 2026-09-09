import { parseRun, sortRuns } from "./run-contract";
import type { Run } from "./run-types";

const modules = import.meta.glob("../fixtures/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

export function listFixtureRuns(): Run[] {
  const runs: Run[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    const parsed = parseRun(raw);
    if (!parsed.ok) {
      console.warn(`[fixtures] skip ${path}: ${parsed.error}`);
      continue;
    }
    runs.push(parsed.run);
  }
  return sortRuns(runs);
}

export function getFixtureRun(id: string): Run | undefined {
  return listFixtureRuns().find((run) => run.id === id);
}

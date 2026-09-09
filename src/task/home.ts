import { createServerFn } from "@tanstack/react-start";
import { HOME_PROVIDERS } from "./home-registry";
import type { TaskSummary } from "./types";

/** Home 只组合各 Task 自己提供的 projection，不感知其内部 domain model。 */
export function buildHomeSummary(useFixtures = false): TaskSummary[] {
  return HOME_PROVIDERS.map((provider) =>
    useFixtures ? provider.fixture() : provider.load(),
  );
}

export const getHomeFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<TaskSummary[]> => buildHomeSummary(false),
);

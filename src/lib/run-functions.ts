import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getRun, listRuns } from "./run-store";
import type { Run } from "./run-types";

export const listRunsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<Run>> => {
    return listRuns();
  },
);

export const getRunFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<Run | null> => {
    return getRun(data.id);
  });

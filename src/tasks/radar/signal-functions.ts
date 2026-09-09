import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSignal, listSignals } from "./signal-store";
import type { Signal } from "./signal";

export const listSignalsFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<Array<Signal>> => {
    return listSignals();
  },
);

export const getSignalFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }): Promise<Signal | null> => {
    return getSignal(data.id);
  });

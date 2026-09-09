import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { CapabilityDescriptor } from "@/capabilities/types";
import { runDiscovery, type DiscoveryOutcome } from "./discovery";
import { radarCapabilities } from "./radar-capabilities";
import { ingestSignal } from "./signal-store";

// Radar 的 machine-facing server functions。
// Agent 通过它们读取 Radar 的能力声明、触发一次 discovery；
// Human 也可以从 Radar 自己的 surface 触发同样的动作——同一条路径，不同入口。

export const getRadarCapabilitiesFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<CapabilityDescriptor[]> => radarCapabilities(),
);

export const runDiscoveryFn = createServerFn({ method: "POST" })
  .validator(
    z.object({ sourceIds: z.array(z.string().min(1)).optional() }).optional(),
  )
  .handler(async ({ data }): Promise<DiscoveryOutcome> => {
    const { items, ...outcome } = await runDiscovery(data ?? {});
    for (const item of items) ingestSignal(item);
    return outcome;
  });

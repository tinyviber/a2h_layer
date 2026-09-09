import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSignal, listSignals } from "./signal-store";

// RadarItem（Signal）带 forward-compatible 的 `[key: string]: unknown` index
// signature。TanStack 的 server fn 返回类型序列化检查无法静态证明 `unknown`
// 可序列化（运行值都是 JSON），因此这里用 `as any` 绕过该检查。
// 调用方在 loader 里按 Signal[] / Signal | null 消费。

export const listSignalsFn = createServerFn({ method: "GET" }).handler(
  async () => listSignals() as any,
);

export const getSignalFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => getSignal(data.id) as any);

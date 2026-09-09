import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { runDiscovery } from "@/tasks/radar/discovery";
import { ingestSignal } from "@/tasks/radar/signal-store";

const RunSchema = z
  .object({ sourceIds: z.array(z.string().min(1)).optional() })
  .optional();

// POST /api/radar/run
// 触发一次 discovery：跑完 source → triage → ingest 链路，返回结果。
// 可选 sourceIds 指定只跑哪些来源；不传则跑 Radar 连接的全部来源。
export const Route = createFileRoute("/api/radar/run")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "JSON 无法解析" }, { status: 400 });
        }
        const parsed = RunSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "run 参数不合法" }, { status: 400 });
        }
        const { items, ...outcome } = await runDiscovery(parsed.data ?? {});
        for (const item of items) ingestSignal(item);
        return Response.json(outcome, { status: 200 });
      },
    },
  },
});

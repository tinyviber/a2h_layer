import { createFileRoute } from "@tanstack/react-router";
import { radarCapabilities } from "@/tasks/radar/radar-capabilities";

// GET /api/radar/capabilities
// 机器可读的 capability 声明：Agent 读它就知道 Radar 连接了哪些 source / model，
// 以及如何通过 /api/radar/run 触发 discovery、通过 /api/radar/ 投递结果。
export const Route = createFileRoute("/api/radar/capabilities")({
  server: {
    handlers: {
      GET: async () => Response.json(radarCapabilities()),
    },
  },
});

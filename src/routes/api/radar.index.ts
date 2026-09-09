import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import {
  RADAR_DECISIONS,
  parseSignal,
  type RadarDecision,
} from "@/tasks/radar/signal";
import {
  ingestSignal,
  listSignals,
  setSignalDecision,
} from "@/tasks/radar/signal-store";

const DecisionSchema = z.object({
  id: z.string().trim().min(1),
  decision: z.enum(RADAR_DECISIONS).nullable(),
});

export const Route = createFileRoute("/api/radar/")({
  server: {
    handlers: {
      GET: async () => Response.json(listSignals()),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "JSON 无法解析" }, { status: 400 });
        }
        const parsed = parseSignal(body);
        if (!parsed.ok) {
          return Response.json({ error: parsed.error }, { status: 400 });
        }
        const stored = ingestSignal(parsed.signal);
        return Response.json(stored, { status: 201 });
      },
      PUT: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "JSON 无法解析" }, { status: 400 });
        }
        const parsed = DecisionSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json({ error: "Human decision 格式不合法" }, { status: 400 });
        }
        const stored = setSignalDecision(
          parsed.data.id,
          parsed.data.decision as RadarDecision | null,
        );
        if (!stored) {
          return Response.json({ error: "找不到 Radar item" }, { status: 404 });
        }
        return Response.json(stored);
      },
    },
  },
});

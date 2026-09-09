import { createFileRoute } from "@tanstack/react-router";
import { parseSignal } from "@/tasks/radar/signal";
import { ingestSignal, listSignals } from "@/tasks/radar/signal-store";

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
    },
  },
});

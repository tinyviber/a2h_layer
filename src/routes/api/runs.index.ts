import { createFileRoute } from "@tanstack/react-router";
import { parseRun } from "@/lib/run-contract";
import { ingestRun, listRuns } from "@/lib/run-store";

export const Route = createFileRoute("/api/runs/")({
  server: {
    handlers: {
      GET: async () => Response.json(listRuns()),
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "JSON 无法解析" }, { status: 400 });
        }
        const parsed = parseRun(body);
        if (!parsed.ok) {
          return Response.json({ error: parsed.error }, { status: 400 });
        }
        const stored = ingestRun(parsed.run);
        return Response.json(stored, { status: 201 });
      },
    },
  },
});

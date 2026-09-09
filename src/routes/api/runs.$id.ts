import { createFileRoute } from "@tanstack/react-router";
import { getRun } from "@/lib/run-store";

export const Route = createFileRoute("/api/runs/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const run = getRun(params.id);
        if (!run) {
          return Response.json({ error: "not found" }, { status: 404 });
        }
        return Response.json(run);
      },
    },
  },
});

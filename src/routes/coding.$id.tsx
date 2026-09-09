import { createFileRoute, notFound } from "@tanstack/react-router";
import { RunMissing, RoutePending } from "@/components/run-missing";
import { RunReader } from "@/components/run-reader";
import { getFixtureRun } from "@/lib/fixtures";
import { getRunFn } from "@/lib/run-functions";
import type { Run } from "@/lib/run-types";

export const Route = createFileRoute("/coding/$id")({
  loader: async ({ params }): Promise<Run> => {
    try {
      const run = await getRunFn({ data: { id: params.id } });
      if (run) return run;
    } catch {
      const local = getFixtureRun(params.id);
      if (local) return local;
      throw notFound();
    }
    const local = getFixtureRun(params.id);
    if (local) return local;
    throw notFound();
  },
  pendingComponent: RoutePending,
  notFoundComponent: RunMissing,
  component: CodingRunPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.title} · Coding` : "Coding",
      },
    ],
  }),
});

function CodingRunPage() {
  const run = Route.useLoaderData();
  return <RunReader run={run} />;
}

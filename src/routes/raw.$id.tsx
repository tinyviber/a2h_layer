import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { RunMissing, RoutePending } from "@/components/run-missing";
import { getFixtureRun } from "@/lib/fixtures";
import { getRunFn } from "@/lib/run-functions";
import type { Run } from "@/lib/run-types";

export const Route = createFileRoute("/raw/$id")({
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
  component: RawPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData
          ? `JSON · ${loaderData.title}`
          : "JSON · Agent Output Reader",
      },
    ],
  }),
});

function RawPage() {
  const run = Route.useLoaderData();
  const json = JSON.stringify(run, null, 2);

  return (
    <main className="raw-page">
      <header className="reader-top">
        <Link to="/runs/$id" params={{ id: run.id }} className="back-link">
          返回阅读页
        </Link>
        <p className="reader-meta">{run.id}</p>
      </header>
      <pre className="raw-json" data-testid="raw-json">
        {json}
      </pre>
    </main>
  );
}

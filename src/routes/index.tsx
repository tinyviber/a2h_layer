import { createFileRoute } from "@tanstack/react-router";
import { HomeList } from "@/components/home-list";
import { RoutePending } from "@/components/run-missing";
import { listFixtureRuns } from "@/lib/fixtures";
import { listFixtureSignals } from "@/tasks/radar/signal-fixtures";
import { buildHomeSummary, getHomeFn } from "@/task/home";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await getHomeFn();
    } catch {
      return buildHomeSummary(listFixtureSignals(), listFixtureRuns());
    }
  },
  pendingComponent: RoutePending,
  component: HomePage,
  head: () => ({
    meta: [{ title: "工作台" }],
  }),
});

function HomePage() {
  const tasks = Route.useLoaderData();

  return (
    <main className="page">
      <header className="inbox-head">
        <p className="eyebrow">工作台</p>
        <h1>任务</h1>
        <p className="muted">{tasks.length} 个长期任务</p>
      </header>
      <HomeList tasks={tasks} />
    </main>
  );
}

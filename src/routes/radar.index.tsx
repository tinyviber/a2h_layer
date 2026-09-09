import { createFileRoute } from "@tanstack/react-router";
import { RoutePending } from "@/components/run-missing";
import { listFixtureSignals } from "@/tasks/radar/signal-fixtures";
import { listSignalsFn } from "@/tasks/radar/signal-functions";
import { SignalList } from "@/tasks/radar/signal-list";

export const Route = createFileRoute("/radar/")({
  loader: async () => {
    try {
      return await listSignalsFn();
    } catch {
      return listFixtureSignals();
    }
  },
  pendingComponent: RoutePending,
  component: RadarIndexPage,
  head: () => ({
    meta: [{ title: "Radar · 工作台" }],
  }),
});

function RadarIndexPage() {
  const signals = Route.useLoaderData();
  return (
    <main className="page">
      <header className="inbox-head">
        <h1>信号</h1>
        <p className="muted">{signals.length} 条 · 按更新时间倒序</p>
      </header>
      <SignalList signals={signals} />
    </main>
  );
}
import { createFileRoute } from "@tanstack/react-router";
import { InboxList } from "@/components/inbox-list";
import { RoutePending } from "@/components/run-missing";
import { listFixtureRuns } from "@/lib/fixtures";
import { listRunsFn } from "@/lib/run-functions";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      return await listRunsFn();
    } catch {
      return listFixtureRuns();
    }
  },
  pendingComponent: RoutePending,
  component: InboxPage,
  head: () => ({
    meta: [{ title: "Inbox · Agent Output Reader" }],
  }),
});

function InboxPage() {
  const runs = Route.useLoaderData();

  return (
    <main className="page">
      <header className="inbox-head">
        <p className="eyebrow">Agent Output Reader</p>
        <h1>Inbox</h1>
        <p className="muted">
          {runs.length} 次投递 · 按更新时间倒序
        </p>
      </header>
      <InboxList runs={runs} />
    </main>
  );
}

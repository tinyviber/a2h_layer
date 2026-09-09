import { createFileRoute, notFound } from "@tanstack/react-router";
import { RoutePending } from "@/components/run-missing";
import { getFixtureSignal } from "@/tasks/radar/signal-fixtures";
import { getSignalFn } from "@/tasks/radar/signal-functions";
import { SignalReader } from "@/tasks/radar/signal-reader";
import type { Signal } from "@/tasks/radar/signal";

export const Route = createFileRoute("/radar/$id")({
  loader: async ({ params }): Promise<Signal> => {
    try {
      const signal = await getSignalFn({ data: { id: params.id } });
      if (signal) return signal;
    } catch {
      const local = getFixtureSignal(params.id);
      if (local) return local;
      throw notFound();
    }
    const local = getFixtureSignal(params.id);
    if (local) return local;
    throw notFound();
  },
  pendingComponent: RoutePending,
  notFoundComponent: SignalMissing,
  component: RadarSignalPage,
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData ? `${loaderData.title} · Radar` : "Radar",
      },
    ],
  }),
});

function RadarSignalPage() {
  const signal = Route.useLoaderData();
  return <SignalReader signal={signal} />;
}

function SignalMissing() {
  return (
    <main className="page">
      <p className="empty-copy">找不到这条信号。</p>
    </main>
  );
}

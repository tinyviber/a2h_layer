import { Outlet, createFileRoute } from "@tanstack/react-router";
import { TaskChrome } from "@/components/task-chrome";

export const Route = createFileRoute("/radar")({
  component: RadarLayout,
});

function RadarLayout() {
  return (
    <>
      <TaskChrome taskId="radar" />
      <Outlet />
    </>
  );
}
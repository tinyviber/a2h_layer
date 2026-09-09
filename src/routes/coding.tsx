import { Outlet, createFileRoute } from "@tanstack/react-router";
import { TaskChrome } from "@/components/task-chrome";

export const Route = createFileRoute("/coding")({
  component: CodingLayout,
});

function CodingLayout() {
  return (
    <>
      <TaskChrome taskId="coding" />
      <Outlet />
    </>
  );
}
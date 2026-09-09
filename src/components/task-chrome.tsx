import { Link } from "@tanstack/react-router";
import { getTaskMeta } from "@/task/tasks";

/**
 * 每个 Task 页面顶部的共享 chrome：工作台 + 当前任务名。
 * 任务名链接回该任务的列表页；工作台回到 Home。
 * 这是「统一系统」的那一部分——让用户在任何 Task 里都知道自己在哪、怎么回去。
 */
export function TaskChrome({ taskId }: { taskId: string }) {
  const task = getTaskMeta(taskId);
  return (
    <header className="task-chrome">
      <Link to="/" className="back-link">
        工作台
      </Link>
      <span className="reader-sep" aria-hidden="true">
        |
      </span>
      {task ? (
        <Link to={task.path} className="task-chrome-name">
          {task.name}
        </Link>
      ) : (
        <span className="task-chrome-name">{taskId}</span>
      )}
    </header>
  );
}

import { Link } from "@tanstack/react-router";
import { formatRelative } from "@/lib/format";
import { useItemReadState } from "@/lib/read-state";
import type { TaskSummary } from "@/task/types";

function taskPath(id: string) {
  return id === "radar" ? "/radar" : id === "coding" ? "/coding" : "/";
}

function TaskRow({ task }: { task: TaskSummary }) {
  const { isUnread } = useItemReadState(task.readKey);
  const unreadCount = task.items.filter((item) => isUnread(item)).length;
  const latest = task.items[0];

  return (
    <li>
      <Link to={taskPath(task.id)} className="home-row" data-testid="home-row">
        <span
          className={`unread-dot${unreadCount > 0 ? "" : " unread-dot--off"}`}
          aria-label={unreadCount > 0 ? "有未读" : undefined}
          aria-hidden={unreadCount > 0 ? undefined : true}
        />
        <span className="home-main">
          <span className="home-name">{task.name}</span>
          <span className="home-desc">{task.description}</span>
          <span className="home-sub">
            {unreadCount > 0 ? (
              <span className="home-attention">{unreadCount} 条待处理</span>
            ) : (
              <span>暂无待处理</span>
            )}
            {latest ? (
              <>
                <span aria-hidden="true"> · </span>
                <span className="home-latest">{latest.title}</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={latest.updatedAt}>
                  {formatRelative(latest.updatedAt)}
                </time>
              </>
            ) : null}
          </span>
        </span>
      </Link>
    </li>
  );
}

export function HomeList({ tasks }: { tasks: TaskSummary[] }) {
  if (!tasks.length) {
    return (
      <p className="empty-copy" data-testid="empty-home">
        还没有任务。
      </p>
    );
  }
  return (
    <ul className="home-list">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </ul>
  );
}

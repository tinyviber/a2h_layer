import { Link } from "@tanstack/react-router";
import { formatRelative } from "@/lib/format";
import { useItemReadState } from "@/lib/read-state";
import type { TaskSummary } from "@/task/types";

function TaskRow({ task }: { task: TaskSummary }) {
  const storageKey =
    task.attention.kind === "local-read"
      ? task.attention.storageKey
      : `a2h:home:no-read:${task.id}`;
  const { isUnread } = useItemReadState(storageKey);

  const attentionCount =
    task.attention.kind === "local-read"
      ? task.attention.items.filter((item) => isUnread(item)).length
      : task.attention.kind === "count"
        ? task.attention.count
        : 0;

  const attentionLabel =
    task.attention.kind === "count" && task.attention.label
      ? task.attention.label
      : "待处理";

  return (
    <li>
      <Link to={task.path} className="home-row" data-testid="home-row">
        <span
          className={`unread-dot${attentionCount > 0 ? "" : " unread-dot--off"}`}
          aria-label={attentionCount > 0 ? "有需要注意的变化" : undefined}
          aria-hidden={attentionCount > 0 ? undefined : true}
        />
        <span className="home-main">
          <span className="home-name">{task.name}</span>
          <span className="home-desc">{task.description}</span>
          <span className="home-sub">
            {attentionCount > 0 ? (
              <span className="home-attention">
                {attentionCount} 条{attentionLabel}
              </span>
            ) : (
              <span>暂无需要处理</span>
            )}
            {task.latest ? (
              <>
                <span aria-hidden="true"> · </span>
                <span className="home-latest">{task.latest.title}</span>
                <span aria-hidden="true"> · </span>
                <time dateTime={task.latest.updatedAt}>
                  {formatRelative(task.latest.updatedAt)}
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

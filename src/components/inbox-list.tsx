import { Link } from "@tanstack/react-router";
import { AGENT_LABEL, STATUS_LABEL, formatRelative } from "@/lib/format";
import { useReadState } from "@/lib/read-state";
import type { Run } from "@/lib/run-types";

export function InboxList({ runs }: { runs: Run[] }) {
  const { isUnread } = useReadState();

  if (!runs.length) {
    return (
      <p className="empty-copy" data-testid="empty-inbox">
        还没有 Run。Agent 投递后会出现在这里。
      </p>
    );
  }

  return (
    <ul className="inbox-list">
      {runs.map((run) => {
        const unread = isUnread(run);
        return (
          <li key={run.id}>
            <Link
              to="/coding/$id"
              params={{ id: run.id }}
              className={`inbox-row status-${run.status}${unread ? " is-unread" : " is-read"}`}
              data-testid="inbox-row"
              data-run-id={run.id}
              data-unread={unread ? "true" : "false"}
            >
              {unread ? (
                <span className="unread-dot" aria-label="未读" />
              ) : null}
              <span className="inbox-main">
                <span className="inbox-title">{run.title}</span>
                <span className="inbox-sub">
                  {AGENT_LABEL[run.agent]}
                  <span aria-hidden="true"> · </span>
                  <span className="status-word">{STATUS_LABEL[run.status]}</span>
                  {run.project ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {run.project}
                    </>
                  ) : null}
                  <span aria-hidden="true"> · </span>
                  <time dateTime={run.updatedAt}>{formatRelative(run.updatedAt)}</time>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

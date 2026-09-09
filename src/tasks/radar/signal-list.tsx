import { Link } from "@tanstack/react-router";
import { formatRelative } from "@/lib/format";
import { useItemReadState } from "@/lib/read-state";
import {
  IMPORTANCE_LABEL,
  STATUS_LABEL,
  type Signal,
  type SignalStatus,
} from "./signal";
import { RADAR_READ_KEY, useSignalDecision } from "./signal-local";

function resolvedStatus(signal: Signal, override: SignalStatus | null): SignalStatus {
  return override ?? signal.status;
}

export function SignalList({ signals }: { signals: Signal[] }) {
  const { isUnread } = useItemReadState(RADAR_READ_KEY);
  const { statusOf } = useSignalDecision();

  if (!signals.length) {
    return (
      <p className="empty-copy" data-testid="empty-radar">
        还没有信号。Radar 的 Agent 产出后会出现在这里。
      </p>
    );
  }

  return (
    <ul className="inbox-list">
      {signals.map((signal) => {
        const unread = isUnread(signal);
        const status = resolvedStatus(signal, statusOf(signal.id));
        const decided = status !== "new";
        return (
          <li key={signal.id}>
            <Link
              to="/radar/$id"
              params={{ id: signal.id }}
              className={`inbox-row signal-row importance-${signal.importance}${
                unread ? " is-unread" : " is-read"
              }${decided ? " is-decided" : ""}`}
              data-testid="signal-row"
              data-signal-id={signal.id}
              data-unread={unread ? "true" : "false"}
            >
              {unread ? (
                <span className="unread-dot" aria-label="未读" />
              ) : null}
              <span className="inbox-main">
                <span className="inbox-title">{signal.title}</span>
                <span className="inbox-sub">
                  {signal.topic}
                  <span aria-hidden="true"> · </span>
                  {signal.source}
                  <span aria-hidden="true"> · </span>
                  重要度 {IMPORTANCE_LABEL[signal.importance]}
                  {decided ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span className="status-word">{STATUS_LABEL[status]}</span>
                    </>
                  ) : null}
                  <span aria-hidden="true"> · </span>
                  <time dateTime={signal.updatedAt}>
                    {formatRelative(signal.updatedAt)}
                  </time>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

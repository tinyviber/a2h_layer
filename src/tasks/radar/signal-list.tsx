import { Link } from "@tanstack/react-router";
import { formatRelative } from "@/lib/format";
import { useItemReadState } from "@/lib/read-state";
import {
  DECISION_LABEL,
  type RadarDecision,
  type Signal,
} from "./signal";
import { RADAR_READ_KEY, useSignalDecision } from "./signal-local";

function resolvedDecision(
  signal: Signal,
  override: RadarDecision | null,
): RadarDecision | null {
  return override ?? signal.humanDecision ?? null;
}

export function SignalList({ signals }: { signals: Signal[] }) {
  const { isUnread } = useItemReadState(RADAR_READ_KEY);
  const { decisionOf } = useSignalDecision();

  if (!signals.length) {
    return (
      <p className="empty-copy" data-testid="empty-radar">
        还没有 source。Radar 发现值得阅读的内容后会出现在这里。
      </p>
    );
  }

  return (
    <ul className="inbox-list">
      {signals.map((signal) => {
        const unread = isUnread(signal);
        const decision = resolvedDecision(signal, decisionOf(signal.id));
        return (
          <li key={signal.id}>
            <Link
              to="/radar/$id"
              params={{ id: signal.id }}
              className={`inbox-row signal-row${
                unread ? " is-unread" : " is-read"
              }${decision ? " is-decided" : ""}`}
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
                  {signal.topic || "未分类"}
                  {signal.author ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {signal.author}
                    </>
                  ) : null}
                  {signal.language ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {signal.language}
                    </>
                  ) : null}
                  {signal.source ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      {signal.source}
                    </>
                  ) : null}
                  {decision ? (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span className="status-word">{DECISION_LABEL[decision]}</span>
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

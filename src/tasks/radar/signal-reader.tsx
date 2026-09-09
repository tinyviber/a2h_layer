import { formatRelative, safeHref } from "@/lib/format";
import { useItemMarkReadOnView } from "@/lib/read-state";
import {
  IMPORTANCE_LABEL,
  STATUS_LABEL,
  type Signal,
  type SignalStatus,
} from "./signal";
import { RADAR_READ_KEY, useSignalDecision } from "./signal-local";

export function SignalReader({ signal }: { signal: Signal }) {
  const { readIds, mark } = useItemMarkReadOnView(RADAR_READ_KEY, signal.id);
  const { statusOf, decide } = useSignalDecision();

  const alreadyRead = readIds.has(signal.id);
  const override = statusOf(signal.id);
  const status: SignalStatus = override ?? signal.status;
  const decided = status !== "new";

  const href = safeHref(signal.href);
  const paragraphs = signal.detail
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <article className={`reader signal-reader importance-${signal.importance}`}>
      <div className="page">
        <h1 data-testid="signal-h1">{signal.title}</h1>

        <p className="reader-meta signal-meta">
          <span>{signal.topic}</span>
          <span aria-hidden="true"> · </span>
          <span>{signal.source}</span>
          <span aria-hidden="true"> · </span>
          <span>重要度 {IMPORTANCE_LABEL[signal.importance]}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={signal.updatedAt}>{formatRelative(signal.updatedAt)}</time>
        </p>

        {signal.suggestion ? (
          <section className="signal-suggestion" aria-label="建议">
            <h2>建议</h2>
            <p>{signal.suggestion}</p>
          </section>
        ) : null}

        {paragraphs.length ? (
          <section className="signal-detail" aria-label="说明">
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
          </section>
        ) : null}

        {href ? (
          <p className="signal-source">
            <a href={href} rel="noreferrer noopener">
              查看来源
            </a>
          </p>
        ) : null}

        <footer className="reader-foot">
          {decided ? (
            <>
              <span className="status-word">已{STATUS_LABEL[status]}</span>
              <span className="foot-sep" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="text-toggle"
                onClick={() => decide(signal.id, "new")}
              >
                撤销
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="text-toggle"
                onClick={() => decide(signal.id, "followed")}
              >
                跟进
              </button>
              <span className="foot-sep" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="text-toggle"
                onClick={() => decide(signal.id, "dismissed")}
              >
                忽略
              </button>
            </>
          )}
          <span className="foot-sep" aria-hidden="true">
            ·
          </span>
          <button
            type="button"
            className="text-toggle"
            onClick={() => mark(signal.id)}
            disabled={alreadyRead}
          >
            {alreadyRead ? "已读" : "标记已读"}
          </button>
        </footer>
      </div>
    </article>
  );
}

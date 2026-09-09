import { formatRelative, safeHref } from "@/lib/format";
import { useItemMarkReadOnView } from "@/lib/read-state";
import {
  DECISION_LABEL,
  type RadarDecision,
  type Signal,
} from "./signal";
import { RADAR_READ_KEY, useSignalDecision } from "./signal-local";

function engagementText(signal: Signal): string {
  if (!signal.engagement) return "";
  return Object.entries(signal.engagement)
    .map(([key, value]) => `${key} ${value}`)
    .join(" · ");
}

export function SignalReader({ signal }: { signal: Signal }) {
  const { readIds, mark } = useItemMarkReadOnView(RADAR_READ_KEY, signal.id);
  const { decisionOf, decide } = useSignalDecision();

  const alreadyRead = readIds.has(signal.id);
  const decision: RadarDecision | null =
    decisionOf(signal.id) ?? signal.humanDecision ?? null;
  const href = safeHref(signal.url);
  const engagement = engagementText(signal);

  return (
    <article className="reader signal-reader">
      <div className="page">
        <h1 data-testid="signal-h1">{signal.title}</h1>

        <p className="reader-meta signal-meta">
          <span>{signal.topic || "未分类"}</span>
          {signal.author ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>{signal.author}</span>
            </>
          ) : null}
          {signal.language ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>{signal.language}</span>
            </>
          ) : null}
          {signal.source ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>{signal.source}</span>
            </>
          ) : null}
          <span aria-hidden="true"> · </span>
          <time dateTime={signal.updatedAt}>{formatRelative(signal.updatedAt)}</time>
        </p>

        {engagement ? <p className="reader-meta">{engagement}</p> : null}

        {signal.summary ? (
          <section className="signal-detail" aria-label="摘要">
            <h2>摘要</h2>
            <p>{signal.summary}</p>
          </section>
        ) : null}

        {signal.argumentMap.length ? (
          <section className="signal-detail" aria-label="核心结构">
            <h2>核心结构</h2>
            <ol>
              {signal.argumentMap.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
          </section>
        ) : null}

        {signal.whyWorthReading ? (
          <section className="signal-suggestion" aria-label="为什么值得读">
            <h2>为什么值得读</h2>
            <p>{signal.whyWorthReading}</p>
          </section>
        ) : null}

        {signal.critique ? (
          <section className="signal-detail" aria-label="疑点">
            <h2>疑点 / 批判</h2>
            <p>{signal.critique}</p>
          </section>
        ) : null}

        {href ? (
          <p className="signal-source">
            <a href={href} rel="noreferrer noopener">
              打开原始 source
            </a>
          </p>
        ) : null}

        <footer className="reader-foot">
          {decision ? (
            <>
              <span className="status-word">{DECISION_LABEL[decision]}</span>
              <span className="foot-sep" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="text-toggle"
                onClick={() => void decide(signal.id, null)}
              >
                撤销
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                className="text-toggle"
                onClick={() => void decide(signal.id, "saved")}
              >
                留待细读
              </button>
              <span className="foot-sep" aria-hidden="true">
                ·
              </span>
              <button
                type="button"
                className="text-toggle"
                onClick={() => void decide(signal.id, "dismissed")}
              >
                略过
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

import { Link } from "@tanstack/react-router";
import { BlockView } from "@/components/blocks";
import {
  AGENT_LABEL,
  STATUS_LABEL,
  asString,
  formatRelative,
  safeHref,
} from "@/lib/format";
import { useMarkReadOnView } from "@/lib/read-state";
import { ACTIONS_VISIBLE, type Run } from "@/lib/run-types";

export function RunReader({ run }: { run: Run }) {
  const { readIds, mark } = useMarkReadOnView(run.id);
  const alreadyRead = readIds.has(run.id);
  const actions = run.nextActions.slice(0, ACTIONS_VISIBLE);
  const summary = run.summary.filter((item) => item.trim().length > 0);

  return (
    <article className={`reader status-${run.status}`}>
      <header className="reader-top">
        <Link to="/" className="back-link">
          返回
        </Link>
        <span className="reader-sep" aria-hidden="true">
          |
        </span>
        <p className="reader-meta">
          <span>{AGENT_LABEL[run.agent]}</span>
          <span aria-hidden="true"> · </span>
          <span className="status-word">{STATUS_LABEL[run.status]}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={run.updatedAt}>{formatRelative(run.updatedAt)}</time>
        </p>
      </header>

      <div className="page">
        <h1 data-testid="run-h1">{run.title}</h1>

        <section className="summary" aria-label="结论">
          {summary.length ? (
            summary.map((item) => <p key={item}>{item}</p>)
          ) : (
            <p className="empty-copy">这次没有结论，直接看证据</p>
          )}
        </section>

        {actions.length ? (
          <section className="next-actions" aria-label="下一步">
            <h2>下一步</h2>
            <ol>
              {actions.map((action) => {
                const href = safeHref(action.href);
                return (
                  <li key={action.label}>
                    {href ? <a href={href}>{action.label}</a> : action.label}
                  </li>
                );
              })}
            </ol>
          </section>
        ) : null}

        <div className="blocks">
          {run.blocks.length ? (
            run.blocks.map((block, index) => (
              <BlockView
                key={asString(block.id) || `${block.type}-${index}`}
                block={block}
              />
            ))
          ) : (
            <p className="empty-copy" data-testid="empty-blocks">
              这次没有证据块。
            </p>
          )}
        </div>

        <footer className="reader-foot">
          <button
            type="button"
            className="text-toggle"
            onClick={() => mark(run.id)}
            disabled={alreadyRead}
          >
            {alreadyRead ? "已读" : "标记已读"}
          </button>
          <span className="foot-sep" aria-hidden="true">
            ·
          </span>
          <Link to="/raw/$id" params={{ id: run.id }} className="text-toggle">
            查看原始 JSON
          </Link>
        </footer>
      </div>
    </article>
  );
}

import { useState, type ReactNode } from "react";
import Markdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { asNumber, asString, safeHref } from "@/lib/format";
import {
  DIFF_PREVIEW_LINES,
  LOG_TAIL_LINES,
  type Block,
} from "@/lib/run-types";

function BlockFrame({
  id,
  status,
  children,
}: {
  id?: string;
  status?: "failed" | "success" | "running" | "partial";
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={status ? `block block-status-${status}` : "block"}
      data-block-id={id}
    >
      {children}
    </section>
  );
}

function Caption({ children }: { children: ReactNode }) {
  return <p className="block-caption">{children}</p>;
}

const markdownComponents: Components = {
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h2>{children}</h2>,
  h3: ({ children }) => <h3>{children}</h3>,
  a: ({ href, children }) => {
    const safe = safeHref(href);
    if (!safe) return <span>{children}</span>;
    const external = safe.startsWith("http");
    return (
      <a href={safe} {...(external ? { rel: "noreferrer noopener" } : {})}>
        {children}
      </a>
    );
  },
  pre: ({ children }) => <pre className="block-pre">{children}</pre>,
  table: ({ children }) => (
    <div className="table-scroll">
      <table>{children}</table>
    </div>
  ),
};

function MarkdownBlock({ id, text }: { id?: string; text: string }) {
  return (
    <BlockFrame id={id}>
      <div className="md-block">
        <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {text}
        </Markdown>
      </div>
    </BlockFrame>
  );
}

function CodeBlock({
  id,
  path,
  language,
  text,
}: {
  id?: string;
  path: string;
  language: string;
  text: string;
}) {
  return (
    <BlockFrame id={id}>
      <Caption>
        {path || "code"}
        {language ? ` · ${language}` : ""}
      </Caption>
      <pre className="block-pre">
        <code>{text}</code>
      </pre>
    </BlockFrame>
  );
}

function DiffBlock({
  id,
  path,
  text,
}: {
  id?: string;
  path: string;
  text: string;
}) {
  const lines = text.split("\n");
  const [expanded, setExpanded] = useState(false);
  const hidden = lines.length > DIFF_PREVIEW_LINES;
  const visible = expanded || !hidden ? lines : lines.slice(0, DIFF_PREVIEW_LINES);

  return (
    <BlockFrame id={id}>
      <Caption>diff · {path || "unspecified"}</Caption>
      <pre className="block-pre diff-pre">
        {visible.map((line, index) => (
          <span key={index} className={`diff-line ${diffKind(line)}`}>
            {line.length ? line : " "}
          </span>
        ))}
      </pre>
      {hidden ? (
        <button
          type="button"
          className="text-toggle"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded
            ? `只看前 ${DIFF_PREVIEW_LINES} 行`
            : `展开全部 ${lines.length} 行`}
        </button>
      ) : null}
    </BlockFrame>
  );
}

function diffKind(line: string): string {
  if (line.startsWith("+++") || line.startsWith("---")) return "diff-file";
  if (line.startsWith("@@")) return "diff-hunk";
  if (line.startsWith("+")) return "diff-add";
  if (line.startsWith("-")) return "diff-del";
  return "diff-ctx";
}

function LogBlock({
  id,
  command,
  exitCode,
  text,
}: {
  id?: string;
  command: string;
  exitCode: number | null;
  text: string;
}) {
  const lines = text.split("\n");
  const [expanded, setExpanded] = useState(false);
  const hidden = lines.length > LOG_TAIL_LINES;
  const visible =
    expanded || !hidden ? lines : lines.slice(-LOG_TAIL_LINES);
  const skipped = hidden && !expanded ? lines.length - LOG_TAIL_LINES : 0;

  return (
    <BlockFrame id={id}>
      <Caption>
        {command || "log"}
        {exitCode === null ? "" : ` · exit ${exitCode}`}
        {skipped ? ` · 已省略前 ${skipped} 行` : ""}
      </Caption>
      <pre className="block-pre log-pre" data-testid="log-block">
        {visible.map((line, index) => (
          <span key={index} className="log-line">
            {line.length ? line : " "}
          </span>
        ))}
      </pre>
      {hidden ? (
        <button
          type="button"
          className="text-toggle"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded
            ? `只看尾部 ${LOG_TAIL_LINES} 行`
            : `显示全部 ${lines.length} 行`}
        </button>
      ) : null}
    </BlockFrame>
  );
}

function TableBlock({
  id,
  caption,
  columns,
  rows,
}: {
  id?: string;
  caption?: string;
  columns: string[];
  rows: string[][];
}) {
  return (
    <BlockFrame id={id}>
      <figure className="table-block">
        {caption ? <figcaption className="block-caption">{caption}</figcaption> : null}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((_, colIndex) => (
                    <td key={colIndex}>{row[colIndex] ?? ""}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </figure>
    </BlockFrame>
  );
}

function FileBlock({
  id,
  path,
  note,
}: {
  id?: string;
  path: string;
  note?: string;
}) {
  return (
    <BlockFrame id={id}>
      <Caption>file</Caption>
      <p className="file-path">{path || "(missing path)"}</p>
      {note ? <p className="muted">{note}</p> : null}
    </BlockFrame>
  );
}

function UnsupportedBlock({ block }: { block: Block }) {
  const payload: Record<string, unknown> = { ...block };
  if (block.restJson) {
    try {
      Object.assign(payload, JSON.parse(block.restJson) as Record<string, unknown>);
    } catch {
      /* keep restJson as-is */
    }
    delete payload.restJson;
  }
  return (
    <BlockFrame id={asString(block.id) || undefined}>
      <Caption>
        不支持的块{block.type ? ` · ${block.type}` : ""}
      </Caption>
      <pre className="block-pre" data-testid="unsupported-block">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </BlockFrame>
  );
}

function stringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => (typeof item === "string" ? item : String(item ?? "")));
}

function stringTable(value: unknown): string[][] {
  if (!Array.isArray(value)) return [];
  return value.map((row) => stringList(row));
}

export function BlockView({ block }: { block: Block }) {
  const id = asString(block.id) || undefined;

  switch (block.type) {
    case "markdown":
      return <MarkdownBlock id={id} text={asString(block.text)} />;
    case "code":
      return (
        <CodeBlock
          id={id}
          path={asString(block.path)}
          language={asString(block.language)}
          text={asString(block.text)}
        />
      );
    case "diff":
      return (
        <DiffBlock id={id} path={asString(block.path)} text={asString(block.text)} />
      );
    case "log":
      return (
        <LogBlock
          id={id}
          command={asString(block.command)}
          exitCode={asNumber(block.exitCode)}
          text={asString(block.text)}
        />
      );
    case "table":
      return (
        <TableBlock
          id={id}
          caption={asString(block.caption) || undefined}
          columns={stringList(block.columns)}
          rows={stringTable(block.rows)}
        />
      );
    case "file":
      return (
        <FileBlock
          id={id}
          path={asString(block.path)}
          note={asString(block.note) || undefined}
        />
      );
    default:
      return <UnsupportedBlock block={block} />;
  }
}

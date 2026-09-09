import { i as __toESM } from "../_runtime.mjs";
import { B as require_react, _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route$2 } from "./router-iXolBtOb.mjs";
import { a as formatRelative, i as asString$1, n as STATUS_LABEL, o as safeHref, r as asNumber, s as useMarkReadOnView, t as AGENT_LABEL } from "./read-state-DqT_NqUM.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
import { t as remarkGfm } from "../_libs/remark-gfm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/runs._id-DpBrpdyv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BlockFrame({ id, status, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: status ? `block block-status-${status}` : "block",
		"data-block-id": id,
		children
	});
}
function Caption({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "block-caption",
		children
	});
}
var markdownComponents = {
	h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children }),
	h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children }),
	h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children }),
	a: ({ href, children }) => {
		const safe = safeHref(href);
		if (!safe) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children });
		const external = safe.startsWith("http");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: safe,
			...external ? { rel: "noreferrer noopener" } : {},
			children
		});
	},
	pre: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "block-pre",
		children
	}),
	table: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "table-scroll",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", { children })
	})
};
function MarkdownBlock({ id, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockFrame, {
		id,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "md-block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
				remarkPlugins: [remarkGfm],
				components: markdownComponents,
				children: text
			})
		})
	});
}
function CodeBlock({ id, path, language, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BlockFrame, {
		id,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Caption, { children: [path || "code", language ? ` · ${language}` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "block-pre",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: text })
		})]
	});
}
function DiffBlock({ id, path, text }) {
	const lines = text.split("\n");
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const hidden = lines.length > 40;
	const visible = expanded || !hidden ? lines : lines.slice(0, 40);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BlockFrame, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Caption, { children: ["diff · ", path || "unspecified"] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "block-pre diff-pre",
				children: visible.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `diff-line ${diffKind(line)}`,
					children: line.length ? line : " "
				}, index))
			}),
			hidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-toggle",
				onClick: () => setExpanded((value) => !value),
				children: expanded ? `只看前 40 行` : `展开全部 ${lines.length} 行`
			}) : null
		]
	});
}
function diffKind(line) {
	if (line.startsWith("+++") || line.startsWith("---")) return "diff-file";
	if (line.startsWith("@@")) return "diff-hunk";
	if (line.startsWith("+")) return "diff-add";
	if (line.startsWith("-")) return "diff-del";
	return "diff-ctx";
}
function LogBlock({ id, command, exitCode, text }) {
	const lines = text.split("\n");
	const [expanded, setExpanded] = (0, import_react.useState)(false);
	const hidden = lines.length > 80;
	const visible = expanded || !hidden ? lines : lines.slice(-80);
	const failed = exitCode !== null && exitCode !== 0;
	const skipped = hidden && !expanded ? lines.length - 80 : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BlockFrame, {
		id,
		status: failed ? "failed" : void 0,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Caption, { children: [
				command || "log",
				exitCode === null ? "" : ` · exit ${exitCode}`,
				skipped ? ` · 已省略前 ${skipped} 行` : ""
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "block-pre log-pre",
				"data-testid": "log-block",
				children: visible.map((line, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "log-line",
					children: line.length ? line : " "
				}, index))
			}),
			hidden ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "text-toggle",
				onClick: () => setExpanded((value) => !value),
				children: expanded ? `只看尾部 80 行` : `显示全部 ${lines.length} 行`
			}) : null
		]
	});
}
function TableBlock({ id, caption, columns, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockFrame, {
		id,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "table-block",
			children: [caption ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
				className: "block-caption",
				children: caption
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "table-scroll",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: column }, column)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, rowIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((_, colIndex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: row[colIndex] ?? "" }, colIndex)) }, rowIndex)) })] })
			})]
		})
	});
}
function FileBlock({ id, path, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BlockFrame, {
		id,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Caption, { children: "file" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "file-path",
				children: path || "(missing path)"
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted",
				children: note
			}) : null
		]
	});
}
function UnsupportedBlock({ block }) {
	const payload = { ...block };
	if (block.restJson) {
		try {
			Object.assign(payload, JSON.parse(block.restJson));
		} catch {}
		delete payload.restJson;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BlockFrame, {
		id: asString$1(block.id) || void 0,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Caption, { children: ["不支持的块", block.type ? ` · ${block.type}` : ""] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "block-pre",
			"data-testid": "unsupported-block",
			children: JSON.stringify(payload, null, 2)
		})]
	});
}
function stringList(value) {
	if (!Array.isArray(value)) return [];
	return value.map((item) => typeof item === "string" ? item : String(item ?? ""));
}
function stringTable(value) {
	if (!Array.isArray(value)) return [];
	return value.map((row) => stringList(row));
}
function BlockView({ block }) {
	const id = asString$1(block.id) || void 0;
	switch (block.type) {
		case "markdown": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownBlock, {
			id,
			text: asString$1(block.text)
		});
		case "code": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CodeBlock, {
			id,
			path: asString$1(block.path),
			language: asString$1(block.language),
			text: asString$1(block.text)
		});
		case "diff": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DiffBlock, {
			id,
			path: asString$1(block.path),
			text: asString$1(block.text)
		});
		case "log": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogBlock, {
			id,
			command: asString$1(block.command),
			exitCode: asNumber(block.exitCode),
			text: asString$1(block.text)
		});
		case "table": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBlock, {
			id,
			caption: asString$1(block.caption) || void 0,
			columns: stringList(block.columns),
			rows: stringTable(block.rows)
		});
		case "file": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBlock, {
			id,
			path: asString$1(block.path),
			note: asString$1(block.note) || void 0
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsupportedBlock, { block });
	}
}
function RunReader({ run }) {
	const { readIds, mark } = useMarkReadOnView(run.id);
	const alreadyRead = readIds.has(run.id);
	const actions = run.nextActions.slice(0, 3);
	const summary = run.summary.filter((item) => item.trim().length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: `reader status-${run.status}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "reader-top",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "back-link",
				children: "返回 Inbox"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "reader-meta",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: AGENT_LABEL[run.agent] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: " · "
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `status-word status-${run.status}`,
						children: STATUS_LABEL[run.status]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: " · "
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						dateTime: run.updatedAt,
						children: formatRelative(run.updatedAt)
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					"data-testid": "run-h1",
					children: run.title
				}),
				run.project ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "muted project-line",
					children: run.project
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "summary",
					"aria-label": "结论",
					children: summary.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: summary.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-copy",
						children: "这次没有结论，直接看证据"
					})
				}),
				actions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "next-actions",
					"aria-label": "下一步",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "下一步" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", { children: actions.map((action) => {
						const href = safeHref(action.href);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href,
							children: action.label
						}) : action.label }, action.label);
					}) })]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "blocks",
					children: run.blocks.length ? run.blocks.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BlockView, { block }, asString(block.id) || `${block.type}-${index}`)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "empty-copy",
						"data-testid": "empty-blocks",
						children: "这次没有证据块。"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
					className: "reader-foot",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn",
						onClick: () => mark(run.id),
						disabled: alreadyRead,
						children: alreadyRead ? "已读" : "标记已读"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/raw/$id",
						params: { id: run.id },
						className: "btn",
						children: "查看原始 JSON"
					})]
				})
			]
		})]
	});
}
function asString(value) {
	return typeof value === "string" ? value : "";
}
function RunPage() {
	const run = Route$2.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RunReader, { run });
}
//#endregion
export { RunPage as component };

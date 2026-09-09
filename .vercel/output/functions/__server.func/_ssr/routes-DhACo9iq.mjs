import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Route$4 } from "./router-iXolBtOb.mjs";
import { a as formatRelative, c as useReadState, n as STATUS_LABEL, t as AGENT_LABEL } from "./read-state-DqT_NqUM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DhACo9iq.js
var import_jsx_runtime = require_jsx_runtime();
function InboxList({ runs }) {
	const { isUnread } = useReadState();
	if (!runs.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "empty-copy",
		"data-testid": "empty-inbox",
		children: "还没有 Run。Agent 投递后会出现在这里。"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "inbox-list",
		children: runs.map((run) => {
			const unread = isUnread(run);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/runs/$id",
				params: { id: run.id },
				className: `inbox-row status-${run.status}${unread ? " is-unread" : ""}`,
				"data-testid": "inbox-row",
				"data-run-id": run.id,
				"data-unread": unread ? "true" : "false",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "unread-dot",
						"data-on": unread ? "true" : "false",
						"aria-hidden": unread ? void 0 : true,
						"aria-label": unread ? "未读" : void 0
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inbox-main",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inbox-title",
							children: run.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inbox-sub",
							children: [
								AGENT_LABEL[run.agent],
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: " · "
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `status-word status-${run.status}`,
									children: STATUS_LABEL[run.status]
								}),
								run.project ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									children: " · "
								}), run.project] }) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
						className: "inbox-time",
						dateTime: run.updatedAt,
						children: formatRelative(run.updatedAt)
					})
				]
			}) }, run.id);
		})
	});
}
function InboxPage() {
	const runs = Route$4.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "inbox-head",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "eyebrow",
					children: "Agent Output Reader"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Inbox" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "muted",
					children: [runs.length, " 次投递 · 按更新时间倒序"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InboxList, { runs })]
	});
}
//#endregion
export { InboxPage as component };

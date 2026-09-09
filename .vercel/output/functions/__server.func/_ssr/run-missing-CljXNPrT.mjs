import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-missing-CljXNPrT.js
var import_jsx_runtime = require_jsx_runtime();
function RunMissing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "empty-copy",
			children: "找不到这次 Run。"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/",
			className: "back-link",
			children: "返回 Inbox"
		}) })]
	});
}
function RoutePending() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "page",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "muted",
			children: "正在读取…"
		})
	});
}
//#endregion
export { RunMissing as n, RoutePending as t };

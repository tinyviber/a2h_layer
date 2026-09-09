import { _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Route$3 } from "./router-iXolBtOb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/raw._id-kM-RDqbF.js
var import_jsx_runtime = require_jsx_runtime();
function RawPage() {
	const run = Route$3.useLoaderData();
	const json = JSON.stringify(run, null, 2);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "raw-page",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "reader-top",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/runs/$id",
				params: { id: run.id },
				className: "back-link",
				children: "返回阅读页"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "reader-meta",
				children: run.id
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
			className: "raw-json",
			"data-testid": "raw-json",
			children: json
		})]
	});
}
//#endregion
export { RawPage as component };

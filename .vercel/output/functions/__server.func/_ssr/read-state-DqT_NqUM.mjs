import { i as __toESM } from "../_runtime.mjs";
import { B as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read-state-DqT_NqUM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var STATUS_LABEL = {
	running: "进行中",
	success: "成功",
	failed: "失败",
	partial: "部分完成"
};
var AGENT_LABEL = {
	codex: "Codex",
	"claude-code": "Claude Code",
	grok: "Grok",
	openclaw: "OpenClaw",
	other: "Other"
};
function formatRelative(iso, now = /* @__PURE__ */ new Date()) {
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return iso;
	const diff = now.getTime() - date.getTime();
	const minute = 6e4;
	const hour = 60 * minute;
	const day = 24 * hour;
	if (diff < minute) return "刚刚";
	if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
	if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
	const startOfToday = new Date(now);
	startOfToday.setHours(0, 0, 0, 0);
	const startOfThat = new Date(date);
	startOfThat.setHours(0, 0, 0, 0);
	const dayDiff = Math.round((startOfToday.getTime() - startOfThat.getTime()) / day);
	if (dayDiff === 1) return "昨天";
	if (dayDiff > 1 && dayDiff < 7) return `${dayDiff} 天前`;
	return date.toISOString().slice(0, 10);
}
function asString(value, fallback = "") {
	return typeof value === "string" ? value : fallback;
}
function asNumber(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function safeHref(href) {
	if (!href) return void 0;
	const value = href.trim();
	if (value.startsWith("#") || value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://") || value.startsWith("mailto:")) return value;
}
var KEY = "aor:read-ids";
function loadReadIds() {
	if (typeof localStorage === "undefined") return /* @__PURE__ */ new Set();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return /* @__PURE__ */ new Set();
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return /* @__PURE__ */ new Set();
		return new Set(parsed.filter((item) => typeof item === "string"));
	} catch {
		return /* @__PURE__ */ new Set();
	}
}
function persistReadIds(ids) {
	localStorage.setItem(KEY, JSON.stringify([...ids]));
}
function markRead(id) {
	const ids = loadReadIds();
	ids.add(id);
	persistReadIds(ids);
	return ids;
}
function isRunUnread(run, readIds) {
	if (readIds.has(run.id)) return false;
	return run.unread !== false;
}
function useReadState() {
	const [readIds, setReadIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		setReadIds(loadReadIds());
	}, []);
	return {
		readIds,
		mark: (0, import_react.useCallback)((id) => {
			setReadIds(markRead(id));
		}, []),
		isUnread: (0, import_react.useCallback)((run) => isRunUnread(run, readIds), [readIds])
	};
}
function useMarkReadOnView(id) {
	const state = useReadState();
	(0, import_react.useEffect)(() => {
		state.mark(id);
	}, [id, state.mark]);
	return state;
}
//#endregion
export { formatRelative as a, useReadState as c, asString as i, STATUS_LABEL as n, safeHref as o, asNumber as r, useMarkReadOnView as s, AGENT_LABEL as t };

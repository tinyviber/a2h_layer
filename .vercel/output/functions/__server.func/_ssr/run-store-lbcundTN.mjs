import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/run-store-lbcundTN.js
var run_auth_cookie_fix_default = {
	id: "run_auth_cookie_fix",
	title: "修复登录 Cookie 的 SameSite",
	agent: "grok",
	project: "checkout-web",
	status: "success",
	createdAt: "2026-09-08T08:10:00.000Z",
	updatedAt: "2026-09-08T08:25:00.000Z",
	unread: true,
	summary: ["跨站回跳后登录会话会保留，浏览器不再丢掉 sid。", "只改了 cookie 的 SameSite=Lax 与 Secure，登录流程未动。"],
	nextActions: [{
		"label": "查看 cookie diff",
		"href": "#blk_diff"
	}],
	blocks: [
		{
			"type": "markdown",
			"id": "blk_md",
			"text": "Safari 把 `SameSite=None; Secure=false` 的会话 cookie 直接丢掉，从支付页回跳后用户是未登录状态。\n\n改动集中在 `src/auth/session.ts`。没有改 CSRF、没有改登录表单。"
		},
		{
			"type": "diff",
			"id": "blk_diff",
			"path": "src/auth/session.ts",
			"text": "--- a/src/auth/session.ts\n+++ b/src/auth/session.ts\n@@ -12,8 +12,9 @@\n   res.cookie(\"sid\", token, {\n     httpOnly: true,\n-    sameSite: \"none\",\n-    secure: false,\n+    sameSite: \"lax\",\n+    secure: true,\n     path: \"/\",\n   });\n"
		},
		{
			"type": "file",
			"id": "blk_file",
			"path": "src/auth/session.ts",
			"note": "唯一改动文件"
		}
	]
};
var run_build_log_default = {
	id: "run_build_log",
	title: "生产构建日志过长",
	agent: "openclaw",
	project: "checkout-web",
	status: "partial",
	createdAt: "2026-09-08T06:02:00.000Z",
	updatedAt: "2026-09-08T06:20:00.000Z",
	unread: true,
	summary: ["生产构建已写出 dist/，但留下 14 条 deprecation 警告。", "没有失败，警告未清，所以标成部分完成。"],
	nextActions: [{
		"label": "看构建尾部",
		"href": "#blk_long_log"
	}],
	blocks: [{
		"type": "log",
		"id": "blk_long_log",
		"command": "pnpm run build",
		"exitCode": 0,
		"text": "$ pnpm run build\nvite v8.2.0 building for production...\n[info] 001 bundling src/chunks/mod-1.ts\n[info] 002 bundling src/chunks/mod-2.ts\n[info] 003 bundling src/chunks/mod-3.ts\n[info] 004 bundling src/chunks/mod-4.ts\n[info] 005 bundling src/chunks/mod-5.ts\n[info] 006 bundling src/chunks/mod-6.ts\n[info] 007 bundling src/chunks/mod-7.ts\n[info] 008 bundling src/chunks/mod-8.ts\n[info] 009 bundling src/chunks/mod-9.ts\n[info] 010 bundling src/chunks/mod-10.ts\n[info] 011 bundling src/chunks/mod-11.ts\n[info] 012 bundling src/chunks/mod-12.ts\n[info] 013 bundling src/chunks/mod-13.ts\n[info] 014 bundling src/chunks/mod-14.ts\n[info] 015 bundling src/chunks/mod-15.ts\n[info] 016 bundling src/chunks/mod-16.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-17.ts\n[warn] ../../node_modules/.pnpm/lodash@4.17.19_node_modules_lodash_lodash.js is 12.4% of the client bundle after minification and the path keeps going /very/long/vendor/path/that/must/scroll/instead/of-blowing-the-page-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\n[info] 019 bundling src/chunks/mod-19.ts\n[info] 020 bundling src/chunks/mod-20.ts\n[info] 021 bundling src/chunks/mod-21.ts\n[info] 022 bundling src/chunks/mod-22.ts\n[info] 023 bundling src/chunks/mod-23.ts\n[info] 024 bundling src/chunks/mod-24.ts\n[info] 025 bundling src/chunks/mod-25.ts\n[info] 026 bundling src/chunks/mod-26.ts\n[info] 027 bundling src/chunks/mod-27.ts\n[info] 028 bundling src/chunks/mod-28.ts\n[info] 029 bundling src/chunks/mod-29.ts\n[info] 030 bundling src/chunks/mod-30.ts\n[info] 031 bundling src/chunks/mod-31.ts\n[info] 032 bundling src/chunks/mod-32.ts\n[info] 033 bundling src/chunks/mod-33.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-34.ts\n[info] 035 bundling src/chunks/mod-35.ts\n[info] 036 bundling src/chunks/mod-36.ts\n[info] 037 bundling src/chunks/mod-37.ts\n[info] 038 bundling src/chunks/mod-38.ts\n[info] 039 bundling src/chunks/mod-39.ts\n[info] 040 bundling src/chunks/mod-40.ts\n[info] 041 bundling src/chunks/mod-41.ts\n[info] 042 bundling src/chunks/mod-42.ts\n[info] 043 bundling src/chunks/mod-43.ts\n[info] 044 bundling src/chunks/mod-44.ts\n[info] 045 bundling src/chunks/mod-45.ts\n[info] 046 bundling src/chunks/mod-46.ts\n[info] 047 bundling src/chunks/mod-47.ts\n[info] 048 bundling src/chunks/mod-48.ts\n[info] 049 bundling src/chunks/mod-49.ts\n[info] 050 bundling src/chunks/mod-50.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-51.ts\n[info] 052 bundling src/chunks/mod-52.ts\n[info] 053 bundling src/chunks/mod-53.ts\n[info] 054 bundling src/chunks/mod-54.ts\n[info] 055 bundling src/chunks/mod-55.ts\n[info] 056 bundling src/chunks/mod-56.ts\n[info] 057 bundling src/chunks/mod-57.ts\n[info] 058 bundling src/chunks/mod-58.ts\n[info] 059 bundling src/chunks/mod-59.ts\n[info] 060 bundling src/chunks/mod-60.ts\n[info] 061 bundling src/chunks/mod-61.ts\n[info] 062 bundling src/chunks/mod-62.ts\n[info] 063 bundling src/chunks/mod-63.ts\n[info] 064 bundling src/chunks/mod-64.ts\n[info] 065 bundling src/chunks/mod-65.ts\n[info] 066 bundling src/chunks/mod-66.ts\n[info] 067 bundling src/chunks/mod-67.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-68.ts\n[info] 069 bundling src/chunks/mod-69.ts\n[info] 070 bundling src/chunks/mod-70.ts\n[info] 071 bundling src/chunks/mod-71.ts\n[info] 072 bundling src/chunks/mod-72.ts\n[info] 073 bundling src/chunks/mod-73.ts\n[info] 074 bundling src/chunks/mod-74.ts\n[info] 075 bundling src/chunks/mod-75.ts\n[info] 076 bundling src/chunks/mod-76.ts\n[info] 077 bundling src/chunks/mod-77.ts\n[info] 078 bundling src/chunks/mod-78.ts\n[info] 079 bundling src/chunks/mod-79.ts\n[info] 080 bundling src/chunks/mod-80.ts\n[info] 081 bundling src/chunks/mod-81.ts\n[info] 082 bundling src/chunks/mod-82.ts\n[info] 083 bundling src/chunks/mod-83.ts\n[info] 084 bundling src/chunks/mod-84.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-85.ts\n[info] 086 bundling src/chunks/mod-86.ts\n[info] 087 bundling src/chunks/mod-87.ts\n[info] 088 bundling src/chunks/mod-88.ts\n[info] 089 bundling src/chunks/mod-89.ts\n[info] 090 bundling src/chunks/mod-90.ts\n[info] 091 bundling src/chunks/mod-91.ts\n[info] 092 bundling src/chunks/mod-92.ts\n[info] 093 bundling src/chunks/mod-93.ts\n[info] 094 bundling src/chunks/mod-94.ts\n[info] 095 bundling src/chunks/mod-95.ts\n[info] 096 bundling src/chunks/mod-96.ts\n[info] 097 bundling src/chunks/mod-97.ts\n[info] 098 bundling src/chunks/mod-98.ts\n[info] 099 bundling src/chunks/mod-99.ts\n[info] 100 bundling src/chunks/mod-100.ts\n[info] 101 bundling src/chunks/mod-101.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-102.ts\n[info] 103 bundling src/chunks/mod-103.ts\n[info] 104 bundling src/chunks/mod-104.ts\n[info] 105 bundling src/chunks/mod-105.ts\n[info] 106 bundling src/chunks/mod-106.ts\n[info] 107 bundling src/chunks/mod-107.ts\n[info] 108 bundling src/chunks/mod-108.ts\n[info] 109 bundling src/chunks/mod-109.ts\n[info] 110 bundling src/chunks/mod-110.ts\n[info] 111 bundling src/chunks/mod-111.ts\n[info] 112 bundling src/chunks/mod-112.ts\n[info] 113 bundling src/chunks/mod-113.ts\n[info] 114 bundling src/chunks/mod-114.ts\n[info] 115 bundling src/chunks/mod-115.ts\n[info] 116 bundling src/chunks/mod-116.ts\n[info] 117 bundling src/chunks/mod-117.ts\n[info] 118 bundling src/chunks/mod-118.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-119.ts\n[info] 120 bundling src/chunks/mod-120.ts\n[info] 121 bundling src/chunks/mod-121.ts\n[info] 122 bundling src/chunks/mod-122.ts\n[info] 123 bundling src/chunks/mod-123.ts\n[info] 124 bundling src/chunks/mod-124.ts\n[info] 125 bundling src/chunks/mod-125.ts\n[info] 126 bundling src/chunks/mod-126.ts\n[info] 127 bundling src/chunks/mod-127.ts\n[info] 128 bundling src/chunks/mod-128.ts\n[info] 129 bundling src/chunks/mod-129.ts\n[info] 130 bundling src/chunks/mod-130.ts\n[info] 131 bundling src/chunks/mod-131.ts\n[info] 132 bundling src/chunks/mod-132.ts\n[info] 133 bundling src/chunks/mod-133.ts\n[info] 134 bundling src/chunks/mod-134.ts\n[info] 135 bundling src/chunks/mod-135.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-136.ts\n[info] 137 bundling src/chunks/mod-137.ts\n[info] 138 bundling src/chunks/mod-138.ts\n[info] 139 bundling src/chunks/mod-139.ts\n[info] 140 bundling src/chunks/mod-140.ts\n[info] 141 bundling src/chunks/mod-141.ts\n[info] 142 bundling src/chunks/mod-142.ts\n[info] 143 bundling src/chunks/mod-143.ts\n[info] 144 bundling src/chunks/mod-144.ts\n[info] 145 bundling src/chunks/mod-145.ts\n[info] 146 bundling src/chunks/mod-146.ts\n[info] 147 bundling src/chunks/mod-147.ts\n[info] 148 bundling src/chunks/mod-148.ts\n[info] 149 bundling src/chunks/mod-149.ts\n[info] 150 bundling src/chunks/mod-150.ts\n[info] 151 bundling src/chunks/mod-151.ts\n[info] 152 bundling src/chunks/mod-152.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-153.ts\n[info] 154 bundling src/chunks/mod-154.ts\n[info] 155 bundling src/chunks/mod-155.ts\n[info] 156 bundling src/chunks/mod-156.ts\n[info] 157 bundling src/chunks/mod-157.ts\n[info] 158 bundling src/chunks/mod-158.ts\n[info] 159 bundling src/chunks/mod-159.ts\n[info] 160 bundling src/chunks/mod-160.ts\n[info] 161 bundling src/chunks/mod-161.ts\n[info] 162 bundling src/chunks/mod-162.ts\n[info] 163 bundling src/chunks/mod-163.ts\n[info] 164 bundling src/chunks/mod-164.ts\n[info] 165 bundling src/chunks/mod-165.ts\n[info] 166 bundling src/chunks/mod-166.ts\n[info] 167 bundling src/chunks/mod-167.ts\n[info] 168 bundling src/chunks/mod-168.ts\n[info] 169 bundling src/chunks/mod-169.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-170.ts\n[info] 171 bundling src/chunks/mod-171.ts\n[info] 172 bundling src/chunks/mod-172.ts\n[info] 173 bundling src/chunks/mod-173.ts\n[info] 174 bundling src/chunks/mod-174.ts\n[info] 175 bundling src/chunks/mod-175.ts\n[info] 176 bundling src/chunks/mod-176.ts\n[info] 177 bundling src/chunks/mod-177.ts\n[info] 178 bundling src/chunks/mod-178.ts\n[info] 179 bundling src/chunks/mod-179.ts\n[info] 180 bundling src/chunks/mod-180.ts\n[info] 181 bundling src/chunks/mod-181.ts\n[info] 182 bundling src/chunks/mod-182.ts\n[info] 183 bundling src/chunks/mod-183.ts\n[info] 184 bundling src/chunks/mod-184.ts\n[info] 185 bundling src/chunks/mod-185.ts\n[info] 186 bundling src/chunks/mod-186.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-187.ts\n[info] 188 bundling src/chunks/mod-188.ts\n[info] 189 bundling src/chunks/mod-189.ts\n[info] 190 bundling src/chunks/mod-190.ts\n[info] 191 bundling src/chunks/mod-191.ts\n[info] 192 bundling src/chunks/mod-192.ts\n[info] 193 bundling src/chunks/mod-193.ts\n[info] 194 bundling src/chunks/mod-194.ts\n[info] 195 bundling src/chunks/mod-195.ts\n[info] 196 bundling src/chunks/mod-196.ts\n[info] 197 bundling src/chunks/mod-197.ts\n[info] 198 bundling src/chunks/mod-198.ts\n[info] 199 bundling src/chunks/mod-199.ts\n[info] 200 bundling src/chunks/mod-200.ts\n[info] 201 bundling src/chunks/mod-201.ts\n[info] 202 bundling src/chunks/mod-202.ts\n[info] 203 bundling src/chunks/mod-203.ts\n[warn] deprecated util._extend used in chunk src/chunks/mod-204.ts\n[info] 205 bundling src/chunks/mod-205.ts\n[info] 206 bundling src/chunks/mod-206.ts\n[info] 207 bundling src/chunks/mod-207.ts\n[info] 208 bundling src/chunks/mod-208.ts\n[info] 209 bundling src/chunks/mod-209.ts\n[info] 210 bundling src/chunks/mod-210.ts\n[info] 211 bundling src/chunks/mod-211.ts\n[info] 212 bundling src/chunks/mod-212.ts\n[info] 213 bundling src/chunks/mod-213.ts\n[info] 214 bundling src/chunks/mod-214.ts\n[info] 215 bundling src/chunks/mod-215.ts\n[info] 216 bundling src/chunks/mod-216.ts\n[info] 217 bundling src/chunks/mod-217.ts\n[info] 218 bundling src/chunks/mod-218.ts\n[info] 219 bundling src/chunks/mod-219.ts\n[info] writing dist/assets/index-a1b2c3d4.js (214 kB)\n[warn] deprecated util._extend used in chunk src/chunks/mod-221.ts\n[info] 222 bundling src/chunks/mod-222.ts\n[info] 223 bundling src/chunks/mod-223.ts\n[info] 224 bundling src/chunks/mod-224.ts\n[info] 225 bundling src/chunks/mod-225.ts\n[info] 226 bundling src/chunks/mod-226.ts\n[info] 227 bundling src/chunks/mod-227.ts\n[info] 228 bundling src/chunks/mod-228.ts\n[info] 229 bundling src/chunks/mod-229.ts\n[info] 230 bundling src/chunks/mod-230.ts\n✓ built in 14.22s\n14 deprecation warnings (not fatal)\ndist/ written. warnings remain."
	}]
};
var run_checkout_tests_default = {
	id: "run_checkout_tests",
	title: "结算金额断言失败",
	agent: "claude-code",
	project: "checkout-web",
	status: "failed",
	createdAt: "2026-09-08T08:58:00.000Z",
	updatedAt: "2026-09-08T09:09:00.000Z",
	unread: true,
	summary: ["src/checkout.test.ts 在含税合计上失败：期望 20，实际 19.99。", "定价代码未改。失败来自既有断言，不是这次 diff。"],
	nextActions: [
		{
			"label": "看失败断言",
			"href": "#blk_assert"
		},
		{
			"label": "看测试日志",
			"href": "#blk_log"
		},
		{ "label": "核对分税舍入" }
	],
	blocks: [{
		"type": "markdown",
		"id": "blk_assert",
		"text": "失败断言在新加坡含税路径：\n\n```ts\nconst total = priceWithTax(items, { region: \"SG\" });\nexpect(total).toBe(20);\n```\n\n`19.99` 对 `20`。浮点金额没有用整数分。"
	}, {
		"type": "log",
		"id": "blk_log",
		"command": "pnpm test src/checkout.test.ts",
		"exitCode": 1,
		"text": "$ pnpm test src/checkout.test.ts\n\n FAIL  src/checkout.test.ts\n  ● totals tax into grand total\n    AssertionError: expected 19.99 to be 20\n\n      41 |   const total = priceWithTax(items, { region: \"SG\" });\n      42 |   expect(total).toBe(20);\n         |                 ^\n      43 | });\n\n      at Object.toBe (src/checkout.test.ts:42:17)\n\nTest Suites: 1 failed, 1 total\nTests:       1 failed, 3 passed, 4 total\nTime:        1.12 s\n"
	}]
};
var run_dep_audit_default = {
	id: "run_dep_audit",
	title: "依赖漏洞审计",
	agent: "grok",
	project: "checkout-web",
	status: "success",
	createdAt: "2026-09-07T09:40:00.000Z",
	updatedAt: "2026-09-07T10:00:00.000Z",
	unread: true,
	summary: ["3 个高危、1 个中危，都有可升级版本。", "lodash 与 next 应先处理，其余可随下次依赖窗口一起升。"],
	nextActions: [
		{ "label": "升级 lodash 到 4.17.21" },
		{ "label": "升级 next 到 14.2.15" },
		{ "label": "下周再看 micromatch" }
	],
	blocks: [{
		"type": "markdown",
		"id": "blk_audit_md",
		"text": "审计范围是生产 `dependencies`，不含 dev 扫描器误报。\n\n等级按 GitHub Advisory 的 CVSS。建议版本均在当前 major 内。"
	}, {
		"type": "table",
		"id": "blk_audit_table",
		"caption": "生产依赖 · 需处理项",
		"columns": [
			"包",
			"当前",
			"建议",
			"等级",
			"CVE",
			"说明"
		],
		"rows": [
			[
				"lodash",
				"4.17.19",
				"4.17.21",
				"高",
				"CVE-2021-23337",
				"命令注入 via template"
			],
			[
				"next",
				"14.2.3",
				"14.2.15",
				"高",
				"CVE-2024-34351",
				"SSR 重定向"
			],
			[
				"micromatch",
				"4.0.5",
				"4.0.8",
				"高",
				"CVE-2024-4067",
				"ReDoS"
			],
			[
				"postcss",
				"8.4.31",
				"8.4.47",
				"中",
				"CVE-2023-44270",
				"解析器行注入"
			]
		]
	}]
};
var run_empty_default = {
	id: "run_empty",
	title: "空转：没有可报告的变更",
	agent: "other",
	project: "sandbox",
	status: "success",
	createdAt: "2026-09-06T10:40:00.000Z",
	updatedAt: "2026-09-06T11:00:00.000Z",
	unread: true,
	summary: [],
	nextActions: [],
	blocks: []
};
var run_refactor_wip_default = {
	id: "run_refactor_wip",
	title: "正在拆分 billing 模块",
	agent: "codex",
	project: "checkout-web",
	status: "running",
	createdAt: "2026-09-08T09:18:00.000Z",
	updatedAt: "2026-09-08T09:24:00.000Z",
	unread: true,
	summary: ["已定位 BillingClient 与 cart 的循环依赖，开始拆文件。"],
	nextActions: [],
	blocks: [
		{
			"type": "markdown",
			"id": "blk_wip_md",
			"text": "进行中。下一步是把价格计算从 `cart.ts` 挪走。下面的代码还不能编译。"
		},
		{
			"type": "code",
			"id": "blk_wip_code",
			"path": "src/billing/client.ts",
			"language": "ts",
			"text": "export function createBillingClient(opts: BillingOpts) {\n  return {\n    quote(items: Item[]) {\n      // TODO: move tax tables out of cart.ts\n      return quoteItems(items, opts.region);\n    },\n  };\n}\n"
		},
		{
			"type": "screenshot",
			"id": "blk_shot",
			"path": "artifacts/billing-graph.png",
			"note": "Agent 试图附一张依赖图，本 App 不渲染该类型"
		}
	]
};
var AGENTS = [
	"codex",
	"claude-code",
	"grok",
	"openclaw",
	"other"
];
var STATUSES = [
	"running",
	"success",
	"failed",
	"partial"
];
var MARKDOWN_MAX = 8e3;
var NextActionSchema = object({
	label: string().trim().min(1).max(40),
	href: string().optional()
}).loose();
var BlockSchema = object({
	type: string().min(1),
	id: string().optional(),
	text: string().optional(),
	path: string().optional(),
	language: string().optional(),
	command: string().optional(),
	exitCode: number().optional(),
	caption: string().optional(),
	note: string().optional(),
	columns: array(string()).optional(),
	rows: array(array(string())).optional()
}).loose();
var RunSchema = object({
	id: string().trim().min(1),
	title: string().trim().min(1).max(80),
	agent: _enum(AGENTS),
	project: string(),
	status: _enum(STATUSES),
	createdAt: string().min(1),
	updatedAt: string().min(1),
	unread: boolean().optional(),
	summary: array(string().max(140)).max(5),
	nextActions: array(NextActionSchema),
	blocks: array(BlockSchema)
});
function isIsoDate(value) {
	return !Number.isNaN(Date.parse(value));
}
function toBlock(raw) {
	const block = { type: String(raw.type) };
	if (typeof raw.id === "string") block.id = raw.id;
	if (typeof raw.text === "string") block.text = raw.text;
	if (typeof raw.path === "string") block.path = raw.path;
	if (typeof raw.language === "string") block.language = raw.language;
	if (typeof raw.command === "string") block.command = raw.command;
	if (typeof raw.exitCode === "number") block.exitCode = raw.exitCode;
	if (typeof raw.caption === "string") block.caption = raw.caption;
	if (typeof raw.note === "string") block.note = raw.note;
	if (Array.isArray(raw.columns)) block.columns = raw.columns.map((item) => String(item));
	if (Array.isArray(raw.rows)) block.rows = raw.rows.map((row) => Array.isArray(row) ? row.map((cell) => String(cell)) : []);
	const known = /* @__PURE__ */ new Set([
		"type",
		"id",
		"text",
		"path",
		"language",
		"command",
		"exitCode",
		"caption",
		"note",
		"columns",
		"rows"
	]);
	const rest = {};
	for (const [key, value] of Object.entries(raw)) {
		if (known.has(key)) continue;
		rest[key] = value;
	}
	if (Object.keys(rest).length) block.restJson = JSON.stringify(rest);
	return block;
}
function parseRun(input) {
	if (input === null || typeof input !== "object" || Array.isArray(input)) return {
		ok: false,
		error: "Run 必须是一个 JSON 对象"
	};
	const parsed = RunSchema.safeParse(input);
	if (!parsed.success) return {
		ok: false,
		error: parsed.error.issues.map((issue) => {
			return `${issue.path.length ? issue.path.join(".") : "run"}: ${issue.message}`;
		}).join("; ")
	};
	const data = parsed.data;
	if (!isIsoDate(data.createdAt)) return {
		ok: false,
		error: "createdAt 必须是 ISO-8601"
	};
	if (!isIsoDate(data.updatedAt)) return {
		ok: false,
		error: "updatedAt 必须是 ISO-8601"
	};
	for (const block of data.blocks) if (block.type === "markdown" && typeof block.text === "string") {
		if (block.text.length > 8e3) return {
			ok: false,
			error: `markdown 块 ${block.id ?? "?"} 超过 ${MARKDOWN_MAX} 字`
		};
	}
	const rawBlocks = input.blocks;
	return {
		ok: true,
		run: {
			id: data.id,
			title: data.title,
			agent: data.agent,
			project: data.project,
			status: data.status,
			createdAt: data.createdAt,
			updatedAt: data.updatedAt,
			unread: data.unread ?? true,
			summary: data.summary,
			nextActions: data.nextActions.map((action) => ({
				label: action.label,
				...action.href ? { href: action.href } : {}
			})),
			blocks: rawBlocks.map((block) => toBlock(block))
		}
	};
}
function sortRuns(runs) {
	return [...runs].sort((a, b) => {
		const byTime = b.updatedAt.localeCompare(a.updatedAt);
		if (byTime !== 0) return byTime;
		return a.id.localeCompare(b.id);
	});
}
var modules = /* #__PURE__ */ Object.assign({
	"../fixtures/run_auth_cookie_fix.json": run_auth_cookie_fix_default,
	"../fixtures/run_build_log.json": run_build_log_default,
	"../fixtures/run_checkout_tests.json": run_checkout_tests_default,
	"../fixtures/run_dep_audit.json": run_dep_audit_default,
	"../fixtures/run_empty.json": run_empty_default,
	"../fixtures/run_refactor_wip.json": run_refactor_wip_default
});
var cached = null;
function listFixtureRuns() {
	if (cached) return cached;
	const runs = [];
	for (const [path, raw] of Object.entries(modules)) {
		const parsed = parseRun(raw);
		if (!parsed.ok) {
			console.warn(`[fixtures] skip ${path}: ${parsed.error}`);
			continue;
		}
		runs.push(parsed.run);
	}
	cached = sortRuns(runs);
	return cached;
}
function getFixtureRun(id) {
	return listFixtureRuns().find((run) => run.id === id);
}
var extras = /* @__PURE__ */ new Map();
function listRuns() {
	const byId = /* @__PURE__ */ new Map();
	for (const run of listFixtureRuns()) byId.set(run.id, run);
	for (const run of extras.values()) byId.set(run.id, run);
	return sortRuns([...byId.values()]);
}
function getRun(id) {
	return extras.get(id) ?? getFixtureRun(id) ?? null;
}
function ingestRun(run) {
	const stored = {
		...run,
		unread: run.unread ?? true
	};
	extras.set(stored.id, stored);
	return stored;
}
//#endregion
export { listRuns as a, listFixtureRuns as i, getRun as n, parseRun as o, ingestRun as r, getFixtureRun as t };

// Read the QA script's assumptions:
//   - Home is /, lists Tasks as quiet rows (not the old Run inbox).
//   - Coding (Run reader) lives under /coding/:id.
//   - Raw JSON is an inline toggle inside the Coding reader, not a route.
//
// This script keeps the spirit of the original (exercise the reading surface,
// check no overflow / one h1 / log tail / diff preview / mark-read) and points
// it at the new /coding surface.
import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8080";

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
});

const failures = [];

function check(name, ok, detail = "") {
  if (!ok) failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
}

await page.goto(base, { waitUntil: "networkidle" });
const rows = page.locator('[data-testid="home-row"]');
const homeRowCount = await rows.count();
check("home has 2 tasks", homeRowCount === 2, `count=${homeRowCount}`);

await page.goto(`${base}/coding`, { waitUntil: "networkidle" });
const runRows = page.locator('[data-testid="inbox-row"]');
const runRowCount = await runRows.count();
check("coding inbox has >= 6 runs", runRowCount >= 6, `count=${runRowCount}`);

await page.locator('[data-run-id="run_checkout_tests"]').click();
await page.waitForSelector('[data-testid="run-h1"]');
const h1 = await page.locator("h1").count();
check("failed run has exactly one h1", h1 === 1, `h1=${h1}`);
const evidence = page.getByText("AssertionError: expected 19.99 to be 20");
check("failed evidence visible", await evidence.isVisible());
const evidenceTop = await evidence.evaluate((el) => el.getBoundingClientRect().top);
check("failed evidence in first screen", evidenceTop < 844, `top=${evidenceTop}`);
check("failed has no next-actions", (await page.locator(".next-actions").count()) === 0);
const failedOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check("failed run no page overflow", !failedOverflow);
const statusColor = await page.locator(".status-word").evaluate((el) => getComputedStyle(el).color);
check(
  "status word is not green/red",
  !/rgb\(\s*(154|42|155|159),/.test(statusColor),
  statusColor,
);

// Inline raw JSON toggle
await page.getByText("查看原始 JSON").click();
await page.waitForSelector('[data-testid="raw-json"]');
check("raw-json opens inline", await page.locator('[data-testid="raw-json"]').isVisible());

// Empty run
await page.goto(`${base}/coding/run_empty`, { waitUntil: "networkidle" });
check("empty run copy", await page.getByTestId("empty-blocks").isVisible());
check(
  "empty summary copy",
  await page.getByText("这次没有结论，直接看证据").isVisible(),
);

// Long log tail
await page.goto(`${base}/coding/run_build_log`, { waitUntil: "networkidle" });
const logLines = await page.locator(".log-line").count();
check("long log tails to 80", logLines === 80, `lines=${logLines}`);
check("long log has expand", await page.getByText("显示全部").isVisible());
const longOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check("long log no page overflow", !longOverflow);

// Diff preview
await page.goto(`${base}/coding/run_auth_cookie_fix`, { waitUntil: "networkidle" });
const diffLines = await page.locator(".diff-line").count();
check("short diff previews 40", diffLines === 40, `lines=${diffLines}`);
check("short diff has expand", await page.getByText("展开全部").isVisible());

// Mark read
await page.goto(`${base}/coding`, { waitUntil: "networkidle" });
const runRow = page.locator('[data-run-id="run_checkout_tests"]');
check(
  "visited run marked read",
  (await runRow.getAttribute("data-unread")) === "false",
);
check(
  "read row has no unread dot",
  (await runRow.locator(".unread-dot").count()) === 0,
);

// Radar: signal list + reader
await page.goto(`${base}/radar`, { waitUntil: "networkidle" });
const signalRows = page.locator('[data-testid="signal-row"]');
const signalCount = await signalRows.count();
check("radar has >= 5 signals", signalCount >= 5, `count=${signalCount}`);

await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, base }, null, 2));
// Browser acceptance checks for the human-facing surfaces.
import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8080";

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
const failures = [];

function check(name, ok, detail = "") {
  if (!ok) failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
}

await page.goto(base, { waitUntil: "networkidle" });
const rows = page.locator('[data-testid="home-row"]');
check("home has 2 tasks", (await rows.count()) === 2, `count=${await rows.count()}`);

// Coding keeps the original reader acceptance criteria.
await page.goto(`${base}/coding`, { waitUntil: "networkidle" });
const runRows = page.locator('[data-testid="inbox-row"]');
check("coding inbox has >= 6 runs", (await runRows.count()) >= 6);

await page.locator('[data-run-id="run_checkout_tests"]').click();
await page.waitForSelector('[data-testid="run-h1"]');
check("failed run has exactly one h1", (await page.locator("h1").count()) === 1);
const evidence = page.getByText("AssertionError: expected 19.99 to be 20");
check("failed evidence visible", await evidence.isVisible());
const evidenceTop = await evidence.evaluate((el) => el.getBoundingClientRect().top);
check("failed evidence in first screen", evidenceTop < 844, `top=${evidenceTop}`);
check("failed has no next-actions", (await page.locator(".next-actions").count()) === 0);
const failedOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check("failed run no page overflow", !failedOverflow);

await page.getByText("查看原始 JSON").click();
await page.waitForSelector('[data-testid="raw-json"]');
check("raw-json opens inline", await page.locator('[data-testid="raw-json"]').isVisible());

await page.goto(`${base}/coding/run_empty`, { waitUntil: "networkidle" });
check("empty run copy", await page.getByTestId("empty-blocks").isVisible());
check("empty summary copy", await page.getByText("这次没有结论，直接看证据").isVisible());

await page.goto(`${base}/coding/run_build_log`, { waitUntil: "networkidle" });
check("long log tails to 80", (await page.locator(".log-line").count()) === 80);
check("long log has expand", await page.getByText("显示全部").isVisible());
const longOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check("long log no page overflow", !longOverflow);

await page.goto(`${base}/coding/run_auth_cookie_fix`, { waitUntil: "networkidle" });
check("diff previews 40", (await page.locator(".diff-line").count()) === 40);
check("diff has expand", await page.getByText("展开全部").isVisible());

await page.goto(`${base}/coding`, { waitUntil: "networkidle" });
const runRow = page.locator('[data-run-id="run_checkout_tests"]');
check("visited run marked read", (await runRow.getAttribute("data-unread")) === "false");

// Radar: list -> source reader -> Human decision -> undo -> read state.
await page.goto(`${base}/radar`, { waitUntil: "networkidle" });
const signalRows = page.locator('[data-testid="signal-row"]');
check("radar has >= 5 items", (await signalRows.count()) >= 5);

const sourceRow = page.locator('[data-signal-id="sig_flat_illustration"]');
check("known radar source exists", (await sourceRow.count()) === 1);
await sourceRow.click();
await page.waitForSelector('[data-testid="signal-h1"]');
check("radar reader has exactly one h1", (await page.locator("h1").count()) === 1);
const radarOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check("radar reader no page overflow", !radarOverflow);
check("radar source link visible", await page.getByText("打开原始 source").isVisible());

await page.getByRole("button", { name: "留待细读" }).click();
check("human decision rendered", await page.locator(".status-word").getByText("留待细读").isVisible());
await page.getByRole("button", { name: "撤销" }).click();
check("decision can undo", await page.getByRole("button", { name: "留待细读" }).isVisible());

await page.goto(`${base}/radar`, { waitUntil: "networkidle" });
const visitedSource = page.locator('[data-signal-id="sig_flat_illustration"]');
check("visited radar item marked read", (await visitedSource.getAttribute("data-unread")) === "false");

await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, base }, null, 2));

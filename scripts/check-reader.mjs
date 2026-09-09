import { chromium } from "playwright";

const base = process.argv[2] || "http://127.0.0.1:8080";

const browser = await chromium.launch({
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
const rows = page.locator('[data-testid="inbox-row"]');
check("inbox has 6 runs", (await rows.count()) >= 6, `count=${await rows.count()}`);
check(
  "inbox has no ol numbering",
  (await page.locator("main ol").count()) === 0,
);
const timeColumn = await page.locator(".inbox-time").count();
check("inbox time is not a right-edge column", timeColumn === 0);

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

await page.goto(`${base}/runs/run_empty`, { waitUntil: "networkidle" });
check("empty run copy", await page.getByTestId("empty-blocks").isVisible());
check(
  "empty summary copy",
  await page.getByText("这次没有结论，直接看证据").isVisible(),
);

await page.goto(`${base}/runs/run_build_log`, { waitUntil: "networkidle" });
const logLines = await page.locator(".log-line").count();
check("long log tails to 80", logLines === 80, `lines=${logLines}`);
check("long log has expand", await page.getByText("显示全部").isVisible());
const longOverflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
);
check("long log no page overflow", !longOverflow);

await page.goto(`${base}/runs/run_auth_cookie_fix`, { waitUntil: "networkidle" });
const diffLines = await page.locator(".diff-line").count();
check("short diff previews 40", diffLines === 40, `lines=${diffLines}`);
check("short diff has expand", await page.getByText("展开全部").isVisible());

await page.goto(base, { waitUntil: "networkidle" });
const unread = page.locator('[data-run-id="run_checkout_tests"]');
check(
  "visited run marked read",
  (await unread.getAttribute("data-unread")) === "false",
);
check(
  "read row has no unread dot",
  (await unread.locator(".unread-dot").count()) === 0,
);

await browser.close();

if (failures.length) {
  console.error(JSON.stringify({ ok: false, failures }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, base }, null, 2));

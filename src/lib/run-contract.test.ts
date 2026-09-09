import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { parseRun } from "./run-contract.ts";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "../fixtures");

describe("parseRun", () => {
  it("accepts all fixtures", () => {
    const files = readdirSync(fixturesDir).filter((name) => name.endsWith(".json"));
    assert.equal(files.length >= 6, true);
    for (const file of files) {
      const raw = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
      const parsed = parseRun(raw);
      assert.equal(parsed.ok, true, `${file} ${(parsed as { error?: string }).error}`);
    }
  });

  it("keeps unknown block types", () => {
    const parsed = parseRun({
      id: "run_x",
      title: "t",
      agent: "grok",
      project: "p",
      status: "running",
      createdAt: "2026-09-08T00:00:00.000Z",
      updatedAt: "2026-09-08T00:00:00.000Z",
      summary: [],
      nextActions: [],
      blocks: [{ type: "screenshot", id: "s", path: "a.png" }],
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.run.blocks[0]?.type, "screenshot");
    assert.equal(parsed.run.blocks[0]?.path, "a.png");
  });

  it("rejects a missing title", () => {
    const parsed = parseRun({
      id: "run_x",
      agent: "grok",
      project: "p",
      status: "success",
      createdAt: "2026-09-08T00:00:00.000Z",
      updatedAt: "2026-09-08T00:00:00.000Z",
      summary: [],
      nextActions: [],
      blocks: [],
    });
    assert.equal(parsed.ok, false);
  });
});

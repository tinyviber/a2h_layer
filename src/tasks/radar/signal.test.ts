import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getSignal, ingestSignal, setSignalDecision } from "./signal-store.ts";
import { parseSignal } from "./signal.ts";

const base = {
  id: "radar_test_item",
  title: "Small Japanese account posted an unusually useful game-design thread",
  topic: "game design",
  source: "x",
  author: "example-author",
  language: "ja",
  createdAt: "2026-09-09T10:00:00+08:00",
  updatedAt: "2026-09-09T10:00:00+08:00",
};

describe("Radar item contract", () => {
  it("normalizes legacy reader fields and preserves unknown task attributes", () => {
    const parsed = parseSignal({
      ...base,
      detail: "legacy summary",
      suggestion: "legacy reason",
      href: "https://example.com/source",
      modelScore: 0.91,
      custom: { lane: "story" },
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.signal.summary, "legacy summary");
    assert.equal(parsed.signal.whyWorthReading, "legacy reason");
    assert.equal(parsed.signal.url, "https://example.com/source");
    assert.equal(parsed.signal.modelScore, 0.91);
    assert.deepEqual(parsed.signal.custom, { lane: "story" });
    assert.equal(parsed.signal.createdAt, "2026-09-09T02:00:00.000Z");
  });

  it("does not let Agent ingest claim a Human decision", () => {
    const parsed = parseSignal({
      ...base,
      humanDecision: "saved",
      decision: "dismissed",
      status: "followed",
    });
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    assert.equal(parsed.signal.humanDecision, undefined);
    assert.equal(parsed.signal.decision, undefined);
    assert.equal(parsed.signal.status, undefined);
  });

  it("rejects non ISO-like timestamps", () => {
    const parsed = parseSignal({ ...base, createdAt: "next Tuesday" });
    assert.equal(parsed.ok, false);
  });
});

describe("Radar Human decision state", () => {
  it("is visible through the same item read path used by Agents", () => {
    const parsed = parseSignal(base);
    assert.equal(parsed.ok, true);
    if (!parsed.ok) return;
    ingestSignal(parsed.signal);

    const decided = setSignalDecision(base.id, "saved");
    assert.equal(decided?.humanDecision, "saved");
    assert.equal(getSignal(base.id)?.humanDecision, "saved");

    setSignalDecision(base.id, null);
    assert.equal(getSignal(base.id)?.humanDecision, undefined);
  });
});

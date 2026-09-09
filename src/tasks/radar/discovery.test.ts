import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { runDiscoveryWith } from "./discovery.ts";
import { radarCapabilities } from "./radar-capabilities.ts";
import type {
  Candidate,
  ModelCapability,
  SourceCapability,
} from "../../capabilities/types.ts";

const candidate = (id: string, title: string): Candidate => ({
  id,
  title,
  sourceId: "mock-source",
  sourceName: "Mock Source",
});

const mockSource: SourceCapability = {
  descriptor: {
    id: "mock-source",
    kind: "source",
    name: "Mock source",
    description: "mock",
    config: {},
  },
  run: async () => [
    candidate("a", "A genuinely useful game design thread"),
    candidate("b", ""),
    candidate("c", "https://example.com"),
  ],
};

// 一个确定性的 mock model：只保留 id === "a" 的候选。
const mockModel: ModelCapability = {
  descriptor: {
    id: "mock-model",
    kind: "model",
    name: "Mock model",
    description: "mock",
    config: {},
  },
  run: async ({ candidate: input }) => ({
    worthReading: input.id === "a",
    ...(input.id === "a"
      ? { summary: "keep this one" }
      : { confidence: 0.1 }),
  }),
};

describe("Radar capability declaration", () => {
  it("exposes a machine-readable descriptor for every connected capability", () => {
    const descriptors = radarCapabilities();
    assert.ok(descriptors.length >= 1);
    for (const descriptor of descriptors) {
      assert.ok(descriptor.id);
      assert.ok(descriptor.kind === "source" || descriptor.kind === "model");
      assert.ok(descriptor.name);
      assert.ok(descriptor.description);
    }
    assert.ok(descriptors.some((d) => d.kind === "source"));
    assert.ok(descriptors.some((d) => d.kind === "model"));
  });
});

describe("Radar discovery path", () => {
  it("runs discover → triage and keeps only worthReading candidates", async () => {
    const result = await runDiscoveryWith(
      ["mock-source"],
      { "mock-source": mockSource },
      mockModel,
    );
    assert.equal(result.triaged, 3);
    assert.equal(result.skipped, 2);
    assert.equal(result.ingested, 1);
    assert.equal(result.items.length, 1);
  });

  it("maps candidate metadata into the Radar item and never writes Human state", async () => {
    const result = await runDiscoveryWith(
      ["mock-source"],
      { "mock-source": mockSource },
      mockModel,
    );
    const item = result.items[0];
    assert.equal(item.id, "radar:a");
    assert.equal(item.source, "Mock Source");
    assert.equal(item.summary, "keep this one");
    assert.equal(item.unread, true);
    assert.equal(item.humanDecision, undefined);
  });

  it("is a pure transform: empty sources produce no items and touch no store", async () => {
    const result = await runDiscoveryWith([], {}, mockModel);
    assert.equal(result.triaged, 0);
    assert.equal(result.items.length, 0);
  });
});

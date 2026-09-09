import { getModel, getSource } from "../../capabilities/registry.ts";
import type {
  Candidate,
  ModelCapability,
  SourceCapability,
  TriageResult,
} from "../../capabilities/types.ts";
import { parseSignal, type RadarItem } from "./signal.ts";
import { RADAR_MODEL_ID, RADAR_SOURCE_IDS } from "./radar-capabilities.ts";

// Radar 的 machine 链路：discover → triage → map → items。
//
// 它不是通用 workflow engine——它就是 Radar 自己的一个函数，把能力按顺序串起来。
// 之所以值得存在，是因为它证明了一条清楚的数据路径：
//   source.run() → Candidate[] → model.run() → worthReading → RadarItem
//      → 由调用边界 ingest 进现有 Human-facing Inbox（GET /api/radar/ + 阅读页）
// 上游是可复用的 capability，下游是已存在的 Task surface，两者都不需要为它改。
//
// 这里刻意不 import signal-store（它依赖 import.meta.glob，node 测试无法执行），
// 因此 ingest 由调用边界负责：server fn 与 /api/radar/run 两条入口各自写回 store。

export type DiscoverySourceOutcome = {
  sourceId: string;
  name: string;
  candidates: number;
  worthReading: number;
};

export type DiscoveryOutcome = {
  runId: string;
  startedAt: string;
  finishedAt: string;
  sources: DiscoverySourceOutcome[];
  /** 参与 triage 的候选总数。 */
  triaged: number;
  /** 进入 Inbox 的条数。 */
  ingested: number;
  /** 被 triage 挡下的候选数。 */
  skipped: number;
};

export type DiscoveryResult = DiscoveryOutcome & { items: RadarItem[] };

function toRadarItem(
  candidate: Candidate,
  triage: TriageResult,
  now: string,
): RadarItem | null {
  const raw = {
    id: `radar:${candidate.id}`,
    title: candidate.title,
    topic: candidate.sourceName,
    source: candidate.sourceName,
    ...(candidate.author ? { author: candidate.author } : {}),
    ...(candidate.language ? { language: candidate.language } : {}),
    ...(candidate.url ? { url: candidate.url } : {}),
    ...(candidate.publishedAt ? { publishedAt: candidate.publishedAt } : {}),
    summary: triage.summary ?? "",
    whyWorthReading: triage.whyWorthReading ?? "",
    critique: triage.critique ?? "",
    ...(triage.confidence !== undefined ? { confidence: triage.confidence } : {}),
    createdAt: now,
    updatedAt: now,
    unread: true,
  };
  const parsed = parseSignal(raw);
  return parsed.ok ? parsed.signal : null;
}

/**
 * 纯逻辑核心：依赖注入 source / model，不碰 store，方便测试「可替换」与映射正确性。
 * 返回的 items 是「将要进入 Inbox 的 item」，真正的 ingest 由调用方完成。
 */
export async function runDiscoveryWith(
  sourceIds: string[] | undefined,
  sources: Record<string, SourceCapability>,
  model: ModelCapability,
): Promise<DiscoveryResult> {
  const startedAt = new Date().toISOString();
  const ids = sourceIds && sourceIds.length ? sourceIds : Object.keys(sources);

  const sourceOutcomes: DiscoverySourceOutcome[] = [];
  const items: RadarItem[] = [];
  let triaged = 0;
  let skipped = 0;

  for (const sourceId of ids) {
    const source = sources[sourceId];
    if (!source) continue;
    const candidates = await source.run({});
    let worthReading = 0;
    for (const candidate of candidates) {
      triaged += 1;
      const result = await model.run({ candidate });
      if (!result.worthReading) {
        skipped += 1;
        continue;
      }
      worthReading += 1;
      const item = toRadarItem(candidate, result, startedAt);
      if (item) items.push(item);
    }
    sourceOutcomes.push({
      sourceId,
      name: source.descriptor.name,
      candidates: candidates.length,
      worthReading,
    });
  }

  const finishedAt = new Date().toISOString();
  return {
    runId: crypto.randomUUID(),
    startedAt,
    finishedAt,
    sources: sourceOutcomes,
    triaged,
    ingested: items.length,
    skipped,
    items,
  };
}

/** 触发一次真实 discovery，返回结果与将要进入 Inbox 的 items。 */
export async function runDiscovery(options?: {
  sourceIds?: string[];
}): Promise<DiscoveryResult> {
  const model = getModel(RADAR_MODEL_ID);
  if (!model) {
    throw new Error(`Radar 连接了不存在的 model: ${RADAR_MODEL_ID}`);
  }
  const sourceIds = options?.sourceIds ?? [...RADAR_SOURCE_IDS];
  const sources = Object.fromEntries(
    sourceIds
      .map((id) => [id, getSource(id)] as const)
      .filter(([, source]) => Boolean(source)),
  ) as Record<string, SourceCapability>;

  return runDiscoveryWith(sourceIds, sources, model);
}

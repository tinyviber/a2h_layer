// Capability：系统里一段「机器可读声明 + 可调用实现」的能力。
//
// 这一层只回答一个问题：一个 Task 要连接某种能力时，靠什么来描述和调用它。
// 它刻意不做 taxonomy——Model / Agent / Workflow / Tool / Schedule 不是同级对象。
// 当前真实需求只支撑一个窄抽象：Capability，用 kind 区分两种真的需要区分的调用形态。

export type CapabilityKind = "source" | "model";

/** 机器可读配置里的标量值（JSON 标量），保证可在 server fn 边界序列化。 */
export type JsonScalar = string | number | boolean | null;

/**
 * 机器可读声明：Agent 读它就知道「这个 Task 连接了什么、怎么调用」。
 * 它不是 Human-facing UI 的素材，而是 machine-facing state 的一部分。
 */
export type CapabilityDescriptor = {
  id: string;
  kind: CapabilityKind;
  /** 人类可读名，只用于最少量的展示。 */
  name: string;
  /** 机器可读描述：给 Agent 的「这是什么、产出什么」。 */
  description: string;
  /** 机器可读的连接信息（endpoint / provider / 参数），不做强 schema。 */
  config: Record<string, JsonScalar>;
};

/**
 * 一次发现产出的「候选」：尚未 triage，还不是 Task 的最终 item。
 * 它是 capability 层与 Task 之间最窄的交接面，字段都是发现阶段就能拿到的。
 */
export type Candidate = {
  id: string;
  title: string;
  url?: string;
  author?: string;
  language?: string;
  publishedAt?: string;
  sourceId: string;
  sourceName: string;
  [key: string]: unknown;
};

/** model 对单个候选做初判的产出。 */
export type TriageResult = {
  worthReading: boolean;
  summary?: string;
  whyWorthReading?: string;
  critique?: string;
  confidence?: number;
};

export type SourceRunInput = { since?: string };
export type TriageInput = { candidate: Candidate };

/** 一个能产出候选的来源（search / RSS / list / topic 都是它的一种形态）。 */
export type SourceCapability = {
  descriptor: CapabilityDescriptor;
  run: (input: SourceRunInput) => Promise<Candidate[]>;
};

/**
 * 一个能做初判的模型。签名稳定，内部实现可替换：
 * 现在是 heuristic，未来换成真实 LLM 时上层（discovery）一行都不改。
 */
export type ModelCapability = {
  descriptor: CapabilityDescriptor;
  run: (input: TriageInput) => Promise<TriageResult>;
};

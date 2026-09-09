import type { Candidate, ModelCapability, TriageResult } from "./types.ts";

// 一个可替换的 triage model。
//
// 现在的实现是 heuristic：把明显的噪音候选挡在 Inbox 之外，剩下的先放进来由人判断。
// 它刻意不假装成 LLM 摘要。签名稳定后，换成真实 LLM 只改 run 内部，
// discovery 层与 UI 层完全无感——这正是「共享 Capability 不共享 UI」的 seam。

function triageCandidate(candidate: Candidate): TriageResult {
  const title = (candidate.title ?? "").trim();
  const isNoise =
    title.length < 12 ||
    /^\d+$/.test(title) ||
    /^https?:\/\//i.test(title) ||
    /^\s*$/.test(title);

  if (isNoise) {
    return {
      worthReading: false,
      confidence: 0.1,
      critique: "标题过短或仅含链接，疑似噪音，未进入 Inbox。",
    };
  }

  return {
    worthReading: true,
    confidence: 0.6,
    summary: `${candidate.sourceName} · ${title}`,
    whyWorthReading: "来自已连接来源的新内容，先进入阅读 Inbox 由你判断。",
  };
}

export const radarTriageModel: ModelCapability = {
  descriptor: {
    id: "radar-triage",
    kind: "model",
    name: "初判模型（heuristic）",
    description:
      "对单个候选做 worthReading 初判并给出占位摘要。当前为启发式，可替换为真实 LLM。",
    config: { provider: "heuristic", model: "rule-based" },
  },
  run: async ({ candidate }: { candidate: Candidate }): Promise<TriageResult> =>
    triageCandidate(candidate),
};

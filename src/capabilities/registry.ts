import { radarTriageModel } from "./models.ts";
import { hnTopSource, rssMinicapSource } from "./sources.ts";
import type {
  CapabilityDescriptor,
  ModelCapability,
  SourceCapability,
} from "./types.ts";

// 系统级 capability registry：Task 从这里「连接」自己需要的能力，但不拥有它们。
// 未来 Coding 或其他 Task 复用同一个 source / model 时，在这里加一个引用即可，
// 不需要重新实现 model client 或 source fetcher。

export const SOURCES: Record<string, SourceCapability> = {
  "hn-top": hnTopSource,
  "rss-minicap": rssMinicapSource,
};

export const MODELS: Record<string, ModelCapability> = {
  "radar-triage": radarTriageModel,
};

/** 所有能力的机器可读声明，供 Agent / Task 读取。 */
export function listCapabilityDescriptors(): CapabilityDescriptor[] {
  return [
    ...Object.values(SOURCES).map((capability) => capability.descriptor),
    ...Object.values(MODELS).map((capability) => capability.descriptor),
  ];
}

export function getSource(id: string): SourceCapability | undefined {
  return SOURCES[id];
}

export function getModel(id: string): ModelCapability | undefined {
  return MODELS[id];
}

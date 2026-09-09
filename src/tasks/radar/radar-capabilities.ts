import {
  getModel,
  getSource,
  listCapabilityDescriptors,
} from "../../capabilities/registry.ts";
import type { CapabilityDescriptor } from "../../capabilities/types.ts";

// Radar 对自己需要的 capability 的「连接声明」。
// 这是 machine-facing state：Agent 读它就知道 Radar 用什么 source / model，
// 进而可以通过 API 触发 discovery 或直接投递结果。
//
// 注意：这里只声明「连接了哪些能力」，不声明这些能力如何被展示给人类。
// 展示由 Radar 自己的 surface 决定（radar-discover.tsx），系统不强加统一 UI。

export const RADAR_SOURCE_IDS = ["hn-top", "rss-minicap"] as const;
export const RADAR_MODEL_ID = "radar-triage";

/** 校验 Radar 声明的能力都在 registry 里真实存在，防止 id 打错静默失败。 */
export function radarCapabilities(): CapabilityDescriptor[] {
  const descriptors: CapabilityDescriptor[] = [];
  for (const sourceId of RADAR_SOURCE_IDS) {
    const source = getSource(sourceId);
    if (source) descriptors.push(source.descriptor);
  }
  const model = getModel(RADAR_MODEL_ID);
  if (model) descriptors.push(model.descriptor);
  return descriptors;
}

export { listCapabilityDescriptors };

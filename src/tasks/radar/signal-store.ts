import { getFixtureSignal, listFixtureSignals } from "./signal-fixtures";
import {
  sortSignals,
  type RadarDecision,
  type RadarItem,
  type Signal,
} from "./signal";

// 内存投递 + fixtures。进程重启后内存投递与 human decisions 都消失。
// 重要的是 ownership：Agent 写 RadarItem；Human 写 decision；GET 合并两者给 Agent/网页读取。
const extras = new Map<string, RadarItem>();
const decisions = new Map<string, RadarDecision>();

function withDecision(signal: RadarItem): RadarItem {
  const humanDecision = decisions.get(signal.id);
  return humanDecision ? { ...signal, humanDecision } : { ...signal };
}

export function listSignals(): Signal[] {
  const byId = new Map<string, RadarItem>();
  for (const signal of listFixtureSignals()) byId.set(signal.id, signal);
  for (const signal of extras.values()) byId.set(signal.id, signal);
  return sortSignals([...byId.values()]).map(withDecision);
}

export function getSignal(id: string): Signal | null {
  const signal = extras.get(id) ?? getFixtureSignal(id) ?? null;
  return signal ? withDecision(signal) : null;
}

export function ingestSignal(signal: RadarItem): RadarItem {
  // parseSignal 已经剥离 human-owned 字段；这里再次显式防御。
  const { humanDecision: _ignored, ...agentOwned } = signal;
  const stored: RadarItem = {
    ...agentOwned,
    unread: agentOwned.unread ?? true,
  };
  extras.set(stored.id, stored);
  return withDecision(stored);
}

export function setSignalDecision(
  id: string,
  decision: RadarDecision | null,
): RadarItem | null {
  const signal = extras.get(id) ?? getFixtureSignal(id) ?? null;
  if (!signal) return null;
  if (decision) decisions.set(id, decision);
  else decisions.delete(id);
  return withDecision(signal);
}

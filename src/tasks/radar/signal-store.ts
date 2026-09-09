import { getFixtureSignal, listFixtureSignals } from "./signal-fixtures";
import { sortSignals, type Signal } from "./signal";

// 内存投递 + fixtures。进程重启后内存投递消失，fixtures 仍在。
// 与 Coding 的 run-store 同一个模式：Agent 连进来，投结构化数据。
const extras = new Map<string, Signal>();

export function listSignals(): Signal[] {
  const byId = new Map<string, Signal>();
  for (const signal of listFixtureSignals()) byId.set(signal.id, signal);
  for (const signal of extras.values()) byId.set(signal.id, signal);
  return sortSignals([...byId.values()]);
}

export function getSignal(id: string): Signal | null {
  return extras.get(id) ?? getFixtureSignal(id) ?? null;
}

export function ingestSignal(signal: Signal): Signal {
  const stored: Signal = {
    ...signal,
    unread: signal.unread ?? true,
    status: signal.status ?? "new",
  };
  extras.set(stored.id, stored);
  return stored;
}

import { parseSignal, sortSignals, type Signal } from "./signal";

const modules = import.meta.glob("./fixtures/*.json", {
  eager: true,
  import: "default",
}) as Record<string, unknown>;

export function listFixtureSignals(): Signal[] {
  const signals: Signal[] = [];
  for (const [path, raw] of Object.entries(modules)) {
    const parsed = parseSignal(raw);
    if (!parsed.ok) {
      console.warn(`[radar] skip ${path}: ${parsed.error}`);
      continue;
    }
    signals.push(parsed.signal);
  }
  return sortSignals(signals);
}

export function getFixtureSignal(id: string): Signal | undefined {
  return listFixtureSignals().find((signal) => signal.id === id);
}

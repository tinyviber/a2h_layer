import { useCallback, useEffect, useState } from "react";
import type { Run } from "./run-types";

const KEY = "aor:read-ids";

export function loadReadIds(): Set<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

export function persistReadIds(ids: Set<string>): void {
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}

export function markRead(id: string): Set<string> {
  const ids = loadReadIds();
  ids.add(id);
  persistReadIds(ids);
  return ids;
}

export function isRunUnread(run: Run, readIds: Set<string>): boolean {
  if (readIds.has(run.id)) return false;
  return run.unread !== false;
}

export function useReadState() {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadIds(loadReadIds());
  }, []);

  const mark = useCallback((id: string) => {
    setReadIds(markRead(id));
  }, []);

  const isUnread = useCallback(
    (run: Run) => isRunUnread(run, readIds),
    [readIds],
  );

  return { readIds, mark, isUnread };
}

export function useMarkReadOnView(id: string) {
  const state = useReadState();

  useEffect(() => {
    state.mark(id);
  }, [id, state.mark]);

  return state;
}

import { useCallback, useEffect, useState } from "react";

// 通用「已读」状态：按 storageKey 隔离，各任务各存各的。
// Coding 沿用旧 key（aor:read-ids）以保留已有本地状态；Radar 用新 key。

export type Item = { id: string; unread?: boolean };

function loadIds(storageKey: string): Set<string> {
  if (typeof localStorage === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return new Set();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((item): item is string => typeof item === "string"));
  } catch {
    return new Set();
  }
}

function persistIds(storageKey: string, ids: Set<string>): void {
  localStorage.setItem(storageKey, JSON.stringify([...ids]));
}

export function markRead(storageKey: string, id: string): Set<string> {
  const ids = loadIds(storageKey);
  ids.add(id);
  persistIds(storageKey, ids);
  return ids;
}

export function isItemUnread(item: Item, readIds: Set<string>): boolean {
  if (readIds.has(item.id)) return false;
  return item.unread !== false;
}

export function useItemReadState(storageKey: string) {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setReadIds(loadIds(storageKey));
  }, [storageKey]);

  const mark = useCallback(
    (id: string) => {
      setReadIds(markRead(storageKey, id));
    },
    [storageKey],
  );

  const isUnread = useCallback(
    (item: Item) => isItemUnread(item, readIds),
    [readIds],
  );

  return { readIds, mark, isUnread };
}

export function useItemMarkReadOnView(storageKey: string, id: string) {
  const state = useItemReadState(storageKey);

  useEffect(() => {
    state.mark(id);
    // 只在首次挂载标记，避免循环。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, storageKey]);

  return state;
}

// —— Coding（Run）沿用旧 key ——

const RUN_KEY = "aor:read-ids";

export function useReadState() {
  return useItemReadState(RUN_KEY);
}

export function useMarkReadOnView(id: string) {
  return useItemMarkReadOnView(RUN_KEY, id);
}

export function isRunUnread(run: Item, readIds: Set<string>): boolean {
  return isItemUnread(run, readIds);
}

import { useCallback, useEffect, useState } from "react";
import type { SignalStatus } from "./signal";

// Radar 的本地交互状态：
// - 已读（复用通用 useItemReadState，key 见 READ_KEY）
// - 人对信号的判断（跟进 / 忽略），本地覆盖，不改服务端。

export const RADAR_READ_KEY = "aor:radar-read-ids";

const STATUS_KEY = "aor:radar-status";

type StatusOverrides = Record<string, SignalStatus>;

function loadOverrides(): StatusOverrides {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(STATUS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as StatusOverrides;
    }
    return {};
  } catch {
    return {};
  }
}

function persistOverrides(overrides: StatusOverrides): void {
  localStorage.setItem(STATUS_KEY, JSON.stringify(overrides));
}

/** 人对信号做出判断（跟进 / 忽略）。返回最新覆盖表。 */
export function useSignalDecision() {
  const [overrides, setOverrides] = useState<StatusOverrides>({});

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const decide = useCallback((signalId: string, status: SignalStatus) => {
    const next = { ...loadOverrides(), [signalId]: status };
    persistOverrides(next);
    setOverrides(next);
  }, []);

  const statusOf = useCallback(
    (signalId: string): SignalStatus | null => overrides[signalId] ?? null,
    [overrides],
  );

  return { statusOf, decide };
}

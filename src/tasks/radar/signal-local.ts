import { useCallback, useEffect, useState } from "react";
import type { RadarDecision } from "./signal";

// Radar 的本地状态只承担 UI cache / offline fallback。
// Human decision 的语义归属在 Task state；正常路径会 PUT 给 /api/radar/，
// 从而让后续 Agent GET 能看到人的判断。

export const RADAR_READ_KEY = "aor:radar-read-ids";
const DECISION_CACHE_KEY = "aor:radar-decision-cache";

type DecisionOverrides = Record<string, RadarDecision>;

function loadOverrides(): DecisionOverrides {
  if (typeof localStorage === "undefined") return {};
  try {
    const raw = localStorage.getItem(DECISION_CACHE_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as DecisionOverrides;
    }
    return {};
  } catch {
    return {};
  }
}

function persistOverrides(overrides: DecisionOverrides): void {
  localStorage.setItem(DECISION_CACHE_KEY, JSON.stringify(overrides));
}

export function useSignalDecision() {
  const [overrides, setOverrides] = useState<DecisionOverrides>({});

  useEffect(() => {
    setOverrides(loadOverrides());
  }, []);

  const decide = useCallback(async (signalId: string, decision: RadarDecision | null) => {
    const next = { ...loadOverrides() };
    if (decision) next[signalId] = decision;
    else delete next[signalId];
    persistOverrides(next);
    setOverrides(next);

    try {
      const response = await fetch("/api/radar/", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: signalId, decision }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      // 本地 cache 保留人的操作；开发期断网/服务端重启不阻塞阅读。
      console.warn("Radar decision 暂未同步到 Task state", error);
    }
  }, []);

  const decisionOf = useCallback(
    (signalId: string): RadarDecision | null => overrides[signalId] ?? null,
    [overrides],
  );

  return { decisionOf, decide };
}

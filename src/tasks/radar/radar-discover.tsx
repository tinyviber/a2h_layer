import { useCallback, useEffect, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import type { CapabilityDescriptor } from "@/capabilities/types";
import { getRadarCapabilitiesFn, runDiscoveryFn } from "./discovery-functions";
import type { DiscoveryOutcome } from "./discovery";

/**
 * Radar 自己的 Human-facing 配置面。
 *
 * 它只暴露「需要人工介入」的最小部分：看连了哪些来源、手动触发一次发现、看结果。
 * 不是通用 Models / Settings 页，也不复刻 capability 的全部 config——那属于机器。
 * 默认折叠，避免把底层配置强塞进阅读 Inbox。
 */
export function RadarDiscover() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [capabilities, setCapabilities] = useState<CapabilityDescriptor[]>([]);
  const [running, setRunning] = useState(false);
  const [outcome, setOutcome] = useState<DiscoveryOutcome | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || capabilities.length) return;
    getRadarCapabilitiesFn()
      .then(setCapabilities)
      .catch(() => setCapabilities([]));
  }, [open, capabilities.length]);

  const run = useCallback(async () => {
    setRunning(true);
    setError(null);
    try {
      const result = await runDiscoveryFn({ data: {} });
      setOutcome(result);
      await router.invalidate();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "发现失败");
    } finally {
      setRunning(false);
    }
  }, [router]);

  const sources = capabilities.filter((capability) => capability.kind === "source");
  const models = capabilities.filter((capability) => capability.kind === "model");

  return (
    <section className="radar-discover" data-testid="radar-discover">
      <button
        type="button"
        className="radar-discover-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>来源与发现</span>
        <span className="radar-discover-hint">{open ? "收起" : "展开"}</span>
      </button>

      {open ? (
        <div className="radar-discover-body">
          {sources.length ? (
            <ul className="radar-source-list">
              {sources.map((source) => (
                <li key={source.id} className="radar-source">
                  <span className="radar-source-name">{source.name}</span>
                  <span className="radar-source-desc">{source.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">尚未连接任何来源。</p>
          )}

          {models.length ? (
            <p className="radar-model">
              初判：{models.map((model) => model.name).join(" · ")}
            </p>
          ) : null}

          <button
            type="button"
            className="radar-run"
            onClick={() => void run()}
            disabled={running}
            data-testid="radar-run"
          >
            {running ? "正在发现…" : "运行一次发现"}
          </button>

          {error ? (
            <p className="radar-run-error" data-testid="radar-error">
              {error}
            </p>
          ) : null}

          {outcome ? (
            <p className="radar-run-outcome" data-testid="radar-outcome">
              发现 {outcome.triaged} 条候选 · 进入 Inbox {outcome.ingested} 条 ·
              略过 {outcome.skipped} 条
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

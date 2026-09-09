import type { Candidate, SourceCapability } from "./types.ts";

// 两个真实的 source capability：
// - hn-top：真实拉 Hacker News 首页（失败降级到内置候选，保证 dev 可演示）。
// - rss-minicap：一个垂直 RSS 源的占位实现（mock），代表用户主动配置的窄源。
//
// 两者都实现同一个 SourceCapability.run 签名；上层 discovery 不关心内部是
// fetch、解析 RSS 还是读缓存——这正是「可替换」要证明的点。

const HN_TOP_URL = "https://hacker-news.firebaseio.com/v0/topstories.json";
const HN_ITEM_URL = (id: number) =>
  `https://hacker-news.firebaseio.com/v0/item/${id}.json`;

type HnItem = {
  id: number;
  title?: string;
  url?: string;
  by?: string;
  time?: number;
  type?: string;
};

async function fetchJson(url: string, timeoutMs = 6000): Promise<unknown> {
  const response = await fetch(url, { signal: AbortSignal.timeout(timeoutMs) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function toCandidate(item: HnItem): Candidate {
  return {
    id: `hn-${item.id}`,
    title: item.title ?? "",
    ...(item.url ? { url: item.url } : {}),
    ...(item.by ? { author: item.by } : {}),
    language: "en",
    ...(item.time ? { publishedAt: new Date(item.time * 1000).toISOString() } : {}),
    sourceId: "hn-top",
    sourceName: "Hacker News",
  };
}

// 降级候选：真实 fetch 失败时仍能演示完整数据路径。
const HN_FALLBACK: Candidate[] = [
  {
    id: "hn-fallback-1",
    title: "Show HN: A tiny puzzle engine built with PixiJS v8",
    author: "tinyviber",
    language: "en",
    publishedAt: "2026-09-08T09:30:00.000Z",
    sourceId: "hn-top",
    sourceName: "Hacker News",
  },
  {
    id: "hn-fallback-2",
    title: "Designing a Minish Cap style overworld in 2D",
    author: "mapmaker",
    language: "en",
    publishedAt: "2026-09-07T18:12:00.000Z",
    sourceId: "hn-top",
    sourceName: "Hacker News",
  },
];

export const hnTopSource: SourceCapability = {
  descriptor: {
    id: "hn-top",
    kind: "source",
    name: "Hacker News 首页",
    description:
      "拉取 Hacker News 当前 top stories（约 12 条），产出 title/url/author/publishedAt 候选。",
    config: { endpoint: HN_TOP_URL, limit: 12 },
  },
  run: async (): Promise<Candidate[]> => {
    try {
      const ids = (await fetchJson(HN_TOP_URL)) as number[];
      const top = ids.slice(0, 12);
      const items = (await Promise.all(
        top.map((id) => fetchJson(HN_ITEM_URL(id))),
      )) as HnItem[];
      const candidates = items
        .filter((item) => item.type === "story" && item.title)
        .map(toCandidate);
      return candidates.length ? candidates : HN_FALLBACK;
    } catch {
      return HN_FALLBACK;
    }
  },
};

const RSS_MINI_CANDIDATES: Candidate[] = [
  {
    id: "rss-minicap-1",
    title: "小さな日本のアカウントが書いた、異常に有用なゲームデザインのスレッド",
    author: "game_design_jp",
    language: "ja",
    url: "https://example.com/minicap-thread",
    publishedAt: "2026-09-09T07:05:00.000Z",
    sourceId: "rss-minicap",
    sourceName: "Minicap 设计周刊",
  },
  {
    id: "rss-minicap-2",
    title: "小学奥数谜题如何变成可玩的机关：一个关卡设计笔记",
    author: "puzzle-craft",
    language: "zh",
    url: "https://example.com/puzzle-mechanics",
    publishedAt: "2026-09-08T22:40:00.000Z",
    sourceId: "rss-minicap",
    sourceName: "Minicap 设计周刊",
  },
];

// 垂直 RSS 源现在用内置候选代替真实解析；接口稳定，未来换成真实 RSS fetch。
export const rssMinicapSource: SourceCapability = {
  descriptor: {
    id: "rss-minicap",
    kind: "source",
    name: "Minicap 设计周刊",
    description:
      "关注游戏设计 / 解谜机关 / 多语言账号的垂直 RSS 源，产出候选供 triage。",
    config: { kind: "rss", language: "multi" },
  },
  run: async (): Promise<Candidate[]> => RSS_MINI_CANDIDATES,
};

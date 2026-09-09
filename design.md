# design.md

Visual principle: an engineering reader, not a SaaS marketing page.

## Intent

Open the App and within three seconds know:

1. What the Agent finished
2. Which evidence to read first
3. What to do if it failed

The UI is a document. It is not a dashboard, not a card wall, not a hero landing.

## Viewport

- Mobile first. Design at **390px**.
- Body measure: **40rem** max.
- `table` / `diff` / `code` / `log` may fill the content column (still inside page padding) and scroll internally. They must not blow the page width.

## Type

System stack only. No Google Fonts.

- Sans: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
- Mono (code / diff / log / raw JSON): `ui-monospace, "SF Mono", Menlo, Consolas, monospace`

| Role | Size / line-height | Weight | Tracking |
| --- | --- | --- | --- |
| Titles (`h1`) | 22px / 28px | semibold 600 | -0.7px |
| Section headers | 17px / 24px | semibold 600 | 0 |
| Body / summary | 16px / 24px | regular | 0 |
| Meta (time, agent, project, captions) | 14.5px / 18px | regular | 0.3px |
| Code / diff / log | 13px / 24px | regular | 0 |

One `h1` per reading page: the Run title.

## Color

Only these color tokens:

```css
:root {
  --paper: #f4f1ea;
  --text: #1a1916;
  --muted: #6b6660;
  --strong: #1a1916;
  --track: #ddd6c8;
  --bar-success: #2a6b45;
  --bar-running: #2c4a6e;
  --bar-failed: #9b2c2c;
  --bar-partial: #8a5a12;
}
```

| Token | Role |
| --- | --- |
| `--paper` | Page background |
| `--text` | Primary copy, unread titles |
| `--muted` | Time, agent, project, read titles, empty copy |
| `--strong` | Unread 6px dot |
| `--track` | 1px hairlines |
| `--bar-*` | 3px left status bar only |

Status words use `--text` or `--muted`. Never green/red type. Dividers are `1px var(--track)`. Do not wrap lists or code in bordered cards.

## Space

Only these steps: **4 / 8 / 12 / 16 / 24 / 40**.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 40px;
```

## Chrome

- Inbox: one row per Run. No large cards. Time on the meta line under the title, with agent · status · project, all `--muted`.
- Status as words: 进行中 / 成功 / 失败 / 部分完成.
- Unread: 6px `--strong` dot + semibold title. Read: regular title, no dot, slightly muted.
- Footer:「标记已读 · 查看原始 JSON」as text buttons.
- Reading page order is fixed. The Agent cannot rearrange it.

Reading page:

1. Top bar: 返回 | agent · status · 时间
2. `h1` = title (Titles scale)
3. Summary (or「这次没有结论，直接看证据」)
4. Next actions (hide the whole block if none)
5. Blocks in array order
6. Footer: mark read · view raw JSON

## Blocks

- Markdown: prose, GFM tables/code, no raw HTML.
- Code / diff / log: mono, horizontal scroll, hairline top/bottom, no shadow card.
- Diff: collapsed; preview 40 lines.
- Log: tail 80 lines. A failed Run must show this evidence under the summary.
- Table: full content width.
- File: path only.
- Unknown type:「不支持的块」+ payload. Must not white-screen.

## Motion

150–250ms opacity/transform on expand/collapse. Honor `prefers-reduced-motion`.

## Forbidden

- Decorative gradients, glow, glass, blobs
- Generic hero copy + card grid
- Cards inside cards
- Badge / pill piles, upgrade capsules, metric triptychs, ring charts
- Dark theme, FAB, search chrome, bottom tab bar
- Three synonymous summary sections
- Author voice:「我首先分析了仓库…」
- Dark rounded boxes wrapping every code block, then wrapping that in a card
- Agent-supplied CSS or HTML

## Checks (must pass)

- 390px width: no unexpected page-level horizontal overflow (internal code scroll is allowed)
- Reading page has exactly one `h1`
- Failed Run: log or error evidence is visible below summary
- Empty Run: explicit empty copy
- Unknown block type: no white screen

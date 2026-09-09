# design.md

Visual principle: a warm, card-based reading surface — still an engineering
reader, not a SaaS marketing page.

## Intent

Open the App and within three seconds know:

1. Which long-lived tasks you have
2. What changed and where you need to look
3. When you're inside a task, what to read and what to decide next

The product is **task-shaped, not page-shaped**. Different tasks are allowed to
look genuinely different. The UI is a set of calm, warm cards on paper — not a
dashboard, not a hero landing, not a mini n8n, not a wall of identical tiles.

What stays consistent across tasks is the *system*: design tokens, the task
chrome, the way agents read and write, the visual treatment of status and
attention. What stays *flexible* is each task's surface: what the human
actually sees, in what order, with what interactions.

## Core product ideas

- **Task** is a long-lived mini-workspace. Each task owns its data, state, its
  own human-facing surface, and its own ingest contract. See `src/task/` and
  `src/tasks/<id>/`.
- **Human-facing UI ≠ machine-facing data.** The system renders structure into
  a reading layer; the agent never dictates the page.
- **Home is an overview, not a dashboard.** A bento of task cards: name,
  description, what needs attention, latest change. No metrics, no charts, no
  KPI tiles.
- **Reading order is fixed per task.** The agent writes data; the task's
  surface decides how to read it. The agent cannot rearrange the UI.

## Viewport

- Mobile first. Design at **390px**.
- Body measure: **40rem** max.
- Cards fill the content column; `table` / `diff` / `code` / `log` may fill a
  card and scroll internally. They must not blow the page width.
- Desktop uses the same measure centered; cards may sit side by side where a
  bento layout reads better (Home), but the content column stays a document.

## Type

System stack only. No Google Fonts.

- Sans: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
- Mono (code / diff / log / raw JSON): `ui-monospace, "SF Mono", Menlo, Consolas,
  monospace`

| Role | Size / line-height | Weight | Tracking |
| --- | --- | --- | --- |
| Titles (`h1`) | 22px / 28px | semibold 600 | -0.7px |
| Section headers | 17px / 24px | semibold 600 | 0 |
| Body / summary | 16px / 24px | regular | 0 |
| Meta (time, agent, topic, source, captions) | 14.5px / 18px | regular | 0.3px |
| Code / diff / log | 13px / 24px | regular | 0 |

One `h1` per reading page: the item's title. Lists (Home, Radar, Coding) have
exactly one `h1` — the list title.

## Color

Only these color tokens:

```css
:root {
  --paper: #efeae0;        /* 页面背景：暖纸，微深于卡片，让卡片浮起 */
  --card: #fdfcf8;         /* 卡片面：暖白 */
  --card-border: #e6dfcf;  /* 卡片 1px 描边 */
  --text: #1a1916;
  --muted: #6b6660;
  --strong: #1a1916;
  --track: #ded7c7;        /* 卡片内分隔 hairline */
  --bar-success: #2a6b45;
  --bar-running: #2c4a6e;
  --bar-failed: #9b2c2c;
  --bar-partial: #8a5a12;
}
```

| Token | Role |
| --- | --- |
| `--paper` | Page background |
| `--card` | Card surface (always on `--paper`, never nested) |
| `--card-border` | 1px card border |
| `--text` | Primary copy, unread titles, names |
| `--muted` | Time, agent, topic, source, descriptions, read state |
| `--strong` | Unread 6px dot, high-importance accent bar |
| `--track` | Hairlines inside cards, low-importance accent bar |
| `--bar-*` | 3px top accent bar only (Run status: success / running / failed / partial) |

Status and importance words use `--text` or `--muted`. Never green/red type.
Dividers are `1px var(--track)`. Code inside cards stays transparent — never a
dark rounded box.

## Card

Cards are the primary container. One card = one idea (one task, one signal,
one run, one block, one section).

```css
--radius: 14px;
--card-shadow: 0 1px 2px rgba(26, 25, 22, 0.04),
  0 6px 20px rgba(26, 25, 22, 0.06);
--card-shadow-hover: 0 2px 4px rgba(26, 25, 22, 0.05),
  0 12px 32px rgba(26, 25, 22, 0.1);
```

- Card: `--card` fill, `1px var(--card-border)` border, `--radius` corners,
  `--card-shadow`. No gradient, no glass, no inner glow.
- Interactive cards (clickable list rows, Home task cards) lift `-2px` on hover
  and deepen shadow. Honor `prefers-reduced-motion`.
- **Accent bar**: a 3px `--track` strip along the card top carries one signal —
  Run status (`--bar-*`) OR Radar importance (`--strong` / `--muted` /
  `--track`). It is the *only* colored decoration on a card.
- Cards sit `16px` apart (list / section gap). Never cards inside cards.

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

### Home

- A bento of task cards, one per Task. Desktop: two columns. Mobile: single
  column. Card sizes may differ — the point is hierarchy, not a uniform tile
  floor.
- Card content: task name (strong) · description (muted) · meta line:
  `"N 条待处理"` (or "暂无待处理") · "最新：title" · relative time.
- Unread: 6px `--strong` dot beside the name, same dot as in-task lists.
- Empty copy when there are no tasks: explicit, muted, not decorative.

### Task chrome (shared across tasks)

- Sticky top bar on every task page (list + detail): `工作台 | TaskName`.
- Task name is a link back to the task's list — same affordance everywhere so
  the user always knows where they are and how to climb back.
- Hairline `--track` bottom border. No shadow, no card.

### In-task lists (e.g. Radar signal list, Coding run list)

- One card per item. Gap `16px`.
- Meta line under the title: relevant context + status word + relative time,
  all `--muted`.
- 3px top accent bar carries one signal: Run status (success / running / failed
  / partial) OR Radar importance (high / medium / low).
- Unread: 6px `--strong` dot + semibold title. Read: regular title, slightly
  muted.
- "Decided" Radar signals (跟进 / 忽略): muted title, regular weight, no dot.

### Reading pages

Each task decides its own reading order. The order is **fixed for that task**
and the agent cannot rearrange it. Sections are cards; the title + meta line
sit above them, uncarded.

#### Coding — Run reader

1. `h1` = title
2. Meta line: agent · status · project · time
3. Summary card (or "这次没有结论，直接看证据")
4. Next-actions card (hide the whole card if none)
5. Blocks in array order — each block is its own card
6. Footer card: 标记已读 · 查看原始 JSON (toggle)
7. Inline raw JSON (when toggled) — its own card, hairline top

#### Radar — Signal reader

1. `h1` = signal title
2. Meta line: topic · source · 重要度 X · time
3. 建议 card (suggestion, if any) — surfaces *before* detail so judgment comes first
4. 说明 card (detail; blank lines split paragraphs, single newlines preserved)
5. 来源 link (if any)
6. Decision footer card: 跟进 / 忽略 (or 已跟进 / 已忽略 + 撤销) · 标记已读

## Blocks

Run blocks (Coding) — each block is one card:

- Markdown: prose, GFM tables/code, no raw HTML.
- Code / diff / log: mono, horizontal scroll, transparent background inside the
  card. No shadow, no dark rounded box.
- Diff: collapsed; preview 40 lines.
- Log: tail 80 lines. A failed Run must show this evidence under the summary.
- Table: full content width, scrolls internally.
- File: path only.
- Unknown type: "不支持的块" + payload. Must not white-screen.

Radar signals are not block-structured — they are single items with title,
topic, source, importance, detail, suggestion.

## Motion

150–250ms opacity/transform on expand/collapse and card hover. Honor
`prefers-reduced-motion`.

## Forbidden

- Decorative gradients, glow, glassmorphism, neumorphism, blobs
- Generic hero copy
- Uniform tile floors — identical cards with identical content; every card
  should earn its size
- Cards inside cards
- Badge / pill piles, upgrade capsules, metric triptychs, ring charts
- Dark theme, FAB, search chrome, bottom tab bar
- Three synonymous summary sections
- Author voice: "我首先分析了仓库…"
- Dark rounded boxes wrapping every code block
- Agent-supplied CSS or HTML
- Forcing every Task to share one fixed page template — unify the *system*,
  not the pages
- Building a workflow editor / low-code canvas / mini n8n

## Checks (must pass)

- 390px width: no unexpected page-level horizontal overflow (internal code
  scroll is allowed)
- Each reading page has exactly one `h1`
- Failed Coding Run: log or error evidence is visible below summary
- Empty Radar / Coding list / empty Run: explicit empty copy
- Unknown block type: no white screen
- Home lists Tasks as a bento of cards, not a uniform grid
- Task chrome is present on every in-task page (list + detail)

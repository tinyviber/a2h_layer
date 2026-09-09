# design.md

Visual principle: a warm, card-based personal work surface — readable first, never generic SaaS chrome.

## Intent

Open the App and within three seconds know:

1. Which long-lived Tasks exist
2. Where something deserves attention
3. Inside a Task, what to read / inspect / decide next

The product is **task-shaped, not page-shaped**. Different Tasks may look genuinely different.

Unify the system, not the page template.

## Product boundaries

- **Human-facing UI ≠ machine-facing data.** Agent writes structured state; the Task surface decides how humans read it.
- **Home is an overview, not a metrics dashboard.**
- **Task surfaces are free to differ.** Radar may be a reading Inbox; Coding may emphasize diff / log / artifact; another Task may use timeline or workflow views.
- Item / unread / decision patterns are optional. Do not force them onto every Task.
- Shared capabilities such as Model / Agent / Workflow / Tool may exist beneath Tasks, but their UI is task-specific.

## Viewport

- Mobile first at **390px**.
- Main reading measure: **40rem** max.
- Desktop Home may use two columns when that improves hierarchy.
- Code / diff / log / tables scroll internally; never cause page-level horizontal overflow.

## Type

System stack only. No remote fonts.

- Sans: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`
- Mono: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`

| Role | Size / line-height | Weight |
| --- | --- | --- |
| `h1` | 22 / 28 | 600 |
| Section | 17 / 24 | 600 |
| Body | 16 / 24 | 400 |
| Meta | 14.5 / 18 | 400 |
| Code | 13 / 24 | 400 |

Exactly one `h1` per page.

## Color

```css
:root {
  --paper: #efeae0;
  --card: #fdfcf8;
  --card-border: #e6dfcf;
  --text: #1a1916;
  --muted: #6b6660;
  --strong: #1a1916;
  --track: #ded7c7;
  --bar-success: #2a6b45;
  --bar-running: #2c4a6e;
  --bar-failed: #9b2c2c;
  --bar-partial: #8a5a12;
}
```

Status text itself stays neutral; color is only a secondary cue.

## Cards

Cards are quiet structural containers, not decorative SaaS tiles.

```css
--radius: 14px;
--card-shadow: 0 1px 2px rgba(26,25,22,.04), 0 6px 20px rgba(26,25,22,.06);
--card-shadow-hover: 0 2px 4px rgba(26,25,22,.05), 0 12px 32px rgba(26,25,22,.10);
```

Rules:

- `--card` fill + 1px border + 14px radius.
- Never nest cards inside cards.
- Interactive cards may lift `-2px` on hover; respect `prefers-reduced-motion`.
- Accent bars carry one semantic signal only. Coding Run status may use `--bar-*`. Do not invent a colored Radar importance scale unless the Radar domain actually needs it.
- Code remains transparent inside its card; no dark rounded code boxes by default.

## Space

Only use **4 / 8 / 12 / 16 / 24 / 40**.

## Home

Home is a calm overview of Tasks.

Each Task decides what it projects to Home. Typical content:

- Task name
- short description
- attention summary if meaningful
- latest meaningful change if meaningful

Do not assume every Task has unread Items.

Desktop may use a loose two-column bento; mobile is one column. Avoid uniform KPI tile floors.

## Shared Task chrome

Every in-task page gets a small sticky breadcrumb-like chrome:

`工作台 | TaskName`

It provides location and escape, not navigation clutter.

## Coding surface

Preserve the existing evidence-first reader:

1. title
2. agent / status / project / time
3. summary
4. next actions when present
5. evidence blocks in order
6. read / raw JSON controls

Failed runs must make relevant error evidence easy to reach.

## Radar surface

Radar is a **source-discovery / reading Inbox**, not an alert console.

A Radar item may include:

- title / author / language / source
- visible engagement context
- concise summary
- argument / narrative map
- why it is worth reading
- critique / doubts
- original source link

Human decisions such as “留待细读 / 略过” are Human-owned state. They should be readable by later Agents but must not be supplied by Agent ingest.

The UI should encourage reading the original source and later Human Think / Reflection, not treat the item as a final generated article.

## Motion

150–250ms opacity / transform only where it clarifies state. Respect reduced motion.

## Forbidden

- decorative gradients / glow / glassmorphism / neumorphism
- purple-blue AI default visual language
- generic hero copy
- nested cards
- badge / pill piles
- KPI triptychs / ring charts without genuine need
- forcing every Task into an Inbox
- forcing every Task into a workflow canvas
- turning every noun in product docs into a sidebar item
- Agent-supplied CSS / HTML
- dark rounded boxes around every code sample
- enterprise-dashboard chrome by default

## Acceptance checks

- 390px: no unexpected page-level horizontal overflow
- one `h1` per page
- Task chrome present inside Tasks
- unknown Coding block never white-screens the page
- failed Coding evidence remains visible and readable
- Radar item opens as a reading page with original source access when URL exists
- Human Radar decision can be made and undone
- visual hierarchy remains understandable without relying on color alone

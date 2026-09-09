# Output contract

Agent 只准投这份 JSON。App 只准按这份渲染。未知字段保留，不丢数据。

## Run

```json
{
  "id": "run_xxx",
  "title": "string, required, ≤ 80 characters",
  "agent": "codex | claude-code | grok | openclaw | other",
  "project": "string",
  "status": "running | success | failed | partial",
  "createdAt": "ISO-8601",
  "updatedAt": "ISO-8601",
  "unread": true,
  "summary": ["≤ 5 items, each ≤ 140 characters, conclusions not process"],
  "nextActions": [{ "label": "≤ 40 characters", "href": "optional url or path" }],
  "blocks": []
}
```

| Field | Rule |
| --- | --- |
| `id` | Required. Stable. Ingest with an existing id replaces the previous Run. |
| `title` | Required. Trimmed. Max 80. The reading page `h1`. |
| `agent` | One of the five enums. Anything else is rejected on ingest. |
| `project` | Required string. May be empty. |
| `status` | `running` / `success` / `failed` / `partial`. |
| `createdAt` / `updatedAt` | ISO-8601. Inbox sorts by `updatedAt` descending. |
| `unread` | Optional. Default `true`. App overlays local read state. |
| `summary` | Array, max 5. Each item ≤ 140. Must be conclusions. Empty array is valid. |
| `nextActions` | Array. `label` required ≤ 40. `href` optional (`#block-id`, path, or URL). Reading page shows at most 3. Omit or `[]` hides the section. |
| `blocks` | Array, order is the reading order. The App never reorders. |

## Block

Every block has `type` and should have `id` (used as the DOM id and hash target). Unknown `type` is kept and rendered as an unsupported block — never dropped, never executed.

| type | Fields | Render |
| --- | --- | --- |
| `markdown` | `id`, `text` (≤ 8000) | GFM markdown. No raw HTML. |
| `code` | `id`, `path`, `language`, `text` | Monospace, path as caption, horizontal scroll. |
| `diff` | `id`, `path`, `text` (unified diff) | Collapsed by default. Preview first 40 lines. |
| `log` | `id`, `command`, `exitCode`, `text` | Tail 80 lines by default. Non-zero exit is visible. |
| `table` | `id`, `caption?`, `columns: string[]`, `rows: string[][]` | Full width of the content column. |
| `file` | `id`, `path`, `note?` | Path (+ optional note). Do not embed file contents. |
| other | `type` plus original payload | Label「不支持的块」+ payload. |

## Ingest

`POST /api/runs` with `Content-Type: application/json`.

- No auth.
- Body must be one Run object (not an array).
- Invalid envelope → `400` with `{ "error": "..." }`.
- Valid → `201` and the Run appears in Inbox.
- Extra keys on the Run or on a block are preserved.

`GET /api/runs` lists fixtures plus ingested runs, `updatedAt` desc.

`GET /api/runs/:id` returns one Run or `404`.

## What this is not

Agents do not send HTML, CSS, or JavaScript for the App to execute. The App does not run `rehype-raw`, does not inject Agent CSS, and does not render arbitrary HTML.

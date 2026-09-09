# 工作台

我和 Agent 一起工作的个人界面。长期 Task 为骨，Human-facing Surface 为人读层。

它不是 IDE、不是笔记、不是 SaaS Dashboard，也不是 n8n 的缩小版。

## 核心想法

**Task** 是长期存在的小型工作空间。

不同 Task 可以拥有完全不同的数据、状态、能力和 Human-facing UI。系统统一的是底层能力和边界，而不是页面模板。

机器为了工作需要看到的东西，与人为了理解、判断和行动需要看到的东西，从一开始就是分开的。Agent 不决定最终页面长什么样。

## 当前两个 Task

| Task | Human-facing 形态 |
| --- | --- |
| **Radar** | 多语言 source discovery / reading Inbox：发现 → 阅读 → Human Think |
| **Coding** | Coding Agent Run reader：结论 → 下一步 → evidence blocks |

Radar 不是告警系统。它用于收集值得阅读的 source，保留作者、语言、来源、互动指标、摘要、argument map、为什么值得读和必要质疑，再交给人阅读原始 source。

## 路由

| 路径 | 用途 |
| --- | --- |
| `/` | Task overview |
| `/radar` | Radar reading Inbox |
| `/radar/:id` | 一条 Radar source 的阅读页 |
| `/coding` | Coding Runs |
| `/coding/:id` | Run reader |

## Agent 接入

当前仍是开发期的内存 API：

- `GET /api/runs`
- `POST /api/runs`
- `GET /api/radar/`
- `POST /api/radar/`：Agent 投 RadarItem
- `PUT /api/radar/`：Human interaction layer 写 `{ id, decision }`

Radar 的 Human decision 会出现在后续 `GET /api/radar/` 中，因此 Agent 可以读取人的判断继续工作；但 Agent ingest 不能伪造 Human decision。

## Task core 不假设 Inbox

`TaskMeta` 只描述 Task identity。`items / unread / readKey / decision` 都不是所有 Task 的必选属性。

Home 通过每个 Task 自己提供的 projection 了解“哪里值得注意、最近发生了什么”。当前 Radar / Coding 使用 local-read projection；未来 Workflow / Project 类 Task 可以用完全不同的 attention 模式。

```text
src/
  task/
    types.ts          Task core + Home projection types
    tasks.ts          Task identity registry
    home-registry.ts  Task-specific Home adapters
    home.ts           generic Home aggregation
  tasks/
    radar/            Radar domain + reader + store
  components/         shared Human-facing UI
  routes/             Home / Radar / Coding / API
```

## 视觉

视觉规则见 [`design.md`](./design.md)。核心是暖纸背景、克制的 card、移动端优先、避免 AI 默认 SaaS 审美，同时允许不同 Task 拥有不同 surface。

## 产品方向

详见 [`docs/direction.md`](./docs/direction.md)。

下一阶段重点不是继续堆静态页面，而是验证 Task 如何连接共享的 Model / Agent / Workflow / Tool/API / Schedule 等 capability，同时仍保持每个 Task 的 UI 自由。

## 本地运行

```bash
npm i
npm run dev
```

开发服务器默认在 `http://localhost:8080`。

验证入口：

```bash
npm run typecheck
npm test
node scripts/check-reader.mjs
```

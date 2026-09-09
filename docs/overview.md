# 概览：任务型个人工作界面

## 一句话

把 `Agent Output Reader` 从单任务阅读层推进成可以长期加入不同 Task 的个人工作界面，同时保留 Coding Reader 已有成果。

## 当前结构

### Task core

`src/task/` 只保留真正通用的部分：

- `TaskMeta`：id / name / path / description / hint
- `TaskSummary`：Task 投给 Home 的 projection，而不是 Task domain model
- `tasks.ts`：Task identity registry
- `home-registry.ts`：Task-specific Home adapter
- `home.ts`：完全通用的 Home aggregation

**Item / unread / decision / Inbox 都不是 Task 的必选概念。**

### Home

Home 只显示 Task 以及每个 Task 自己愿意投影出来的 attention / latest change。

当前 Radar / Coding 都使用 local-read attention pattern；未来 Task 可以直接给 count，或没有 attention。

入口直接使用 `task.path`，Home 不再写 Radar/Coding 分支。

### Radar

Radar 是 **多语言 source discovery / reading Inbox**，不是告警 Signal console。

Canonical item 可以表达：

- title / topic / source
- author / language / original URL
- visible engagement context
- summary
- argument map
- why worth reading
- critique / doubts
- task-specific flexible attributes

旧 prototype 的 `detail / suggestion / href` 仍可作为 migration input；parser 会 normalize 成新的字段。

未知 task attributes 会保留，不再出现“接收成功但静默丢字段”。时间戳在 ingest 时 normalize 成 UTC ISO string。

### Human decision ownership

Agent 通过 `POST /api/radar/` 写 RadarItem。

Human 通过 `PUT /api/radar/` 写 `{ id, decision }`。

Human decision 与 Agent-owned item 分开存储，并在 `GET /api/radar/` 时合并，所以后续 Agent 能读取人的判断；Agent ingest 中出现的 `humanDecision / decision / status` 会被剥离，不能冒充人的判断。

localStorage 只承担 UI cache / offline fallback，不再被定义成人类状态的最终语义归属。

### Coding

旧 Run reader 保留并重定位到 `/coding`：summary → next actions → evidence blocks → inline raw JSON。

### Capability 与机器链路

`src/capabilities/` 是系统级的、可被任何 Task 复用的能力注册表。当前只支持两种真实 `kind`：`source`（发现候选）与 `model`（初判）。Model / Agent / Workflow / Schedule 不被提升为同级别 class——Agent 通过 API 连接 Task；Workflow 是 Task 自己的一个函数；Schedule 暂缓。

`src/tasks/radar/radar-capabilities.ts` 只声明 Radar 连接了哪些 id（`hn-top`、`rss-minicap`、`radar-triage`），不重新实现能力。

`src/tasks/radar/discovery.ts` 是 Radar 专属的机器链路：`source.run() → Candidate → model.run() → worthReading → RadarItem → ingestSignal → 现有 Inbox`。核心逻辑做成可注入的 `runDiscoveryWith` 便于测试「可替换」与映射正确性。

两条入口走同一条路径：Human 在 `/radar` 点「运行一次发现」；Agent / 外部通过 `POST /api/radar/run`（可选 `sourceIds`），或先 `GET /api/radar/capabilities` 看 Radar 当前的能力声明。

Radar 在 `/radar` 列表页顶部提供一个克制的折叠卡片 `来源与发现` 展示自己连接了什么、能触发一次发现。这不是通用 Models / Settings 页。

## 视觉

保留这次 redesign 的主要视觉方向：暖纸背景、暖白 card、克制阴影、移动端优先、无 gradient/glass/badge pile。

`design.md` 已明确：card 是安静的结构容器，不是 SaaS card wall；Radar 不再使用虚构的 importance 色条。

## QA

- `run-contract.test.ts` 已接入 `npm test`
- 新增 Radar contract tests：legacy normalize、unknown attrs preserve、Agent 不能写 Human decision、ISO time
- Browser QA 现在实际打开 Radar reader，测试原始 source 链接、Human decision、撤销、已读状态和 mobile overflow

## 下一步

Capability boundary 已经用一个 Radar 上的 vertical slice 落地并端到端验证（真实 HN fetch → triage → ingest → Inbox）。详细决策与边界见 `docs/direction.md`。

下一步候选（待真实需求驱动，不预设）：

- 让 Radar 的 triage model 从 heuristic 切到真实 LLM（接口已稳定，只换 `run` 内部）。
- 让另一个 Task（例如未来 Coding 的「自动补跑」或某个新 Task）声明并复用同一份 capability。
- 让 Radar 支持按 source 启用/禁用、记录 human-owned 的 capability preferences（在不引入通用 Settings 的前提下）。
- schedule：仅当 Radar 真的需要「定时发现」时再上，作为 source descriptor 的元信息，不造 scheduler。

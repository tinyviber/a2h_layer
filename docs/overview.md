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

## 视觉

保留这次 redesign 的主要视觉方向：暖纸背景、暖白 card、克制阴影、移动端优先、无 gradient/glass/badge pile。

`design.md` 已明确：card 是安静的结构容器，不是 SaaS card wall；Radar 不再使用虚构的 importance 色条。

## QA

- `run-contract.test.ts` 已接入 `npm test`
- 新增 Radar contract tests：legacy normalize、unknown attrs preserve、Agent 不能写 Human decision、ISO time
- Browser QA 现在实际打开 Radar reader，测试原始 source 链接、Human decision、撤销、已读状态和 mobile overflow

## 下一步

下一阶段优先验证 Task 如何连接共享的 Capability：Model / Agent / Workflow / Tool/API / Schedule。

Capability 可以系统级复用；它在具体 Task 里如何组合、配置和展示，由 Task 自己决定。先从 Radar 的真实需求形成一个小而清楚的 capability boundary，不急着造完整 n8n 式画布。

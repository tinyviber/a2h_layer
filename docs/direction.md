# 产品方向（个人记录）

这份文档记录产品为什么这样演化。视觉细节看 `design.md`；Coding 的 Run 契约看 `output-contract.md`。

## 最终想做什么

这是一个我与多个 Model / Agent 长期共同工作的个人界面。

我会有多个长期存在的 **Task**。Task 可能是 Radar、Coding、研究、内容生产、项目观察、自动化，也可能是现在还没出现的形态。

统一的是系统能力和边界，不是页面模板。

- Task 可以连接 Model、Agent、Workflow、Tool/API、Artifact、Schedule 等能力。
- 某些 Task 可以提供轻量可视化配置；某些 Agent 知道该做什么时可以直接通过 API 读写。
- 每个 Task 自己决定 Human-facing structure tree、信息层级和 interaction layers。
- Agent-facing data 与 Human-facing UI 从一开始分离；Agent 不决定最终页面长什么样。

## 核心抽象：Task

Task 是长期存在的小型工作空间。

真正属于 Task core 的只有少量 identity / lifecycle 信息，例如：

- id / name / path
- description / hint
- 自己的人类 Surface
- 自己如何暴露和消费系统能力

**Item、Unread、Decision、Inbox 都不是所有 Task 必须拥有的核心概念。**
它们只是 Radar、Coding 等某些 Task 可以选择使用的 interaction pattern。

例如未来 Workflow 型 Task 完全可能只关心 running / next run / approval，而不存在“未读 Item”。

## Home 是 projection，不是 domain model

Home 只回答：

> 现在有哪些 Task？哪里值得我注意？最近发生了什么？

每个 Task 自己向 Home 提供一个轻量 projection。当前 Radar / Coding 使用 `local-read` attention pattern；未来 Task 可以直接提供 count，或完全不使用 attention。

因此 Home 不应该知道 Task 内部到底是 Run、Source、Workflow 还是别的数据。

`src/task/home-registry.ts` 是 Task-specific projection 的注册点；`home.ts` 只做通用聚合。

## Radar 的真实语义

Radar 不是监控告警系统，也不是“importance + suggestion”的 Signal 列表。

它是一个 **多语言 source discovery / reading inbox**：

1. Agent / Workflow 从 X、RSS、Search、GitHub 等来源扩大候选池。
2. 筛出值得人类投入注意力的 source。
3. 保存作者、语言、来源、可见互动指标等上下文。
4. 给出中文短摘要、argument map、为什么值得读，以及必要的批判或疑点。
5. 人阅读原始 source，再进行 Human Think / Reflection。
6. 人的判断可以被后续 Agent 消费，继续研究或创作。

Radar contract 允许 task-specific attributes 演化，并保留未知字段；但 Human-owned decision 是保留字段，Agent ingest 不能伪造。

## Human state 的 ownership

机器产出的状态与人的判断必须分开。

- Agent 可以创建 / 更新 RadarItem。
- Human 可以产生 decision / reflection。
- Agent 可以读取 Human state，作为下一轮工作的输入。
- Agent 不可以在 ingest 时冒充 Human 写 decision。

当前 persistence 仍然只是开发期内存 + local cache，但这只是 adapter，不是语义归属。

## System-level Capability

Model、Agent、Workflow、Tool/API、Artifact、Schedule 等能力最终应该成为可复用的 system-level primitives。

但是：

**能力可以统一，能力如何被组合和呈现必须由 Task 决定。**

这意味着未来可以共享同一个 model registry / agent runtime / workflow runtime，但 Radar 不必因此长得像 Coding，也不必强迫所有 Task 使用可视化 workflow editor。

现在不要急着实现完整 capability registry；先通过真实 Task 验证需要哪些 primitive。

## 当前已经验证的两个 Task

### Coding

保留原 Agent Output Reader：Run → summary → next action → evidence blocks → raw JSON。

### Radar

作为第二种完全不同的 surface，验证“统一系统，不统一页面”。它更接近阅读 Inbox，而不是 Run reader。

## 暂不做

这一阶段仍然故意不做：

- 完整 workflow editor / node canvas
- 企业级低代码平台
- 多用户 / 权限系统
- 推送系统
- 完整 artifact storage
- 动态 YAML/JSON 驱动所有页面的 schema engine
- 为未来需求预先造复杂插件框架

## 接下来应该验证什么

下一阶段优先验证 **Task 如何使用共享 Capability**，而不是继续增加静态页面。

可以从 Radar 开始，让它能够描述和连接自己需要的：

- model
- agent
- source/search API
- schedule / workflow

先形成一个小而清楚的 capability boundary，再决定哪些值得提升为真正的通用系统能力。

## Capability boundary（这一阶段已落地）

用一个 Radar 上的 vertical slice 回答了「一个自由形态的 Task 应该怎样自然地连接 Agent-era capabilities」。

### 核心抽象：Capability（窄定义）

只引入一个抽象，避免先建 taxonomy 再寻找用途：

- **`Capability`** = 机器可读的 descriptor（`id` / `kind` / `name` / `description` / `config`）+ 可调用实现（`run`）。
- 当前 `kind` 真实只有两种：`source`（发现候选）与 `model`（triage 判断）。
- 能力在 `src/capabilities/registry.ts` 集中注册。Task 通过声明自己连接哪些 id 来复用它们，**不重新实现 model client 或 source fetcher**。

### 为什么 Model / Agent / Workflow / Schedule 不应是同级别 class

- **Model** → 由 `kind: "model"` 的 capability 承担。`run` 签名稳定，内部实现可替换（现在 heuristic，将来真实 LLM 时上层一行都不改）。
- **Agent** → 不是 capability，是使用 capability 的主体。Agent 通过 API 读 capability 声明、触发 run、投递结果。
- **Workflow** → 不是对象，就是 Radar 的一个函数（`runDiscovery`）。把「按顺序调用」提升为 engine 是过度设计。
- **Schedule** → 不是对象，是元信息。明确暂缓；若以后需要，会作为 source descriptor `config` 的一部分出现，而不是再造一个 scheduler。

### 共享 Capability，UI 由 Task 自己决定

Capability 是机器接口，不是 UI 模板。

- Radar 暴露一个克制的折叠卡片「来源与发现」：看连了哪些 source、当前 model、能手动触发一次 run。**不是**通用 Models / Agents / Workflows / Settings 页。
- Coding 不需要这个面——它的能力是「读 Agent 投递的 Run」，Task surface 自然不同。
- 未来 Task 自己决定要不要暴露、怎么暴露。

### 数据路径（端到端在浏览器验证过）

```
source.run() → Candidate[]
  → model.run({ candidate }) → TriageResult
  → toRadarItem(...) → RadarItem
  → ingestSignal() → 现有 Human Inbox（GET /api/radar/ + 阅读页）
```

两条入口走同一条路径：

- Human：`/radar` 页面点「运行一次发现」。
- Agent / 外部：`POST /api/radar/run`（可选 `sourceIds`），或先 `GET /api/radar/capabilities` 看 Radar 用了什么。

### Human-owned state 继续分离

- `runDiscoveryWith` 只返回 `items`，不碰 store；ingest 由调用边界负责（server fn 与 route handler 各一行）。
- `parseSignal` / `ingestSignal` 仍然剥离 `humanDecision` / `decision` / `status`，机器不会冒充人的判断。
- run 按钮只是触发器，不是配置面板。source 启用/禁用、model 切换、schedule 频率都不在这一阶段。

### 边界文件

- `src/capabilities/`：types / sources / models / registry（系统级、可复用）。
- `src/tasks/radar/radar-capabilities.ts`：Radar 对 registry 的连接声明。
- `src/tasks/radar/discovery.ts`：Radar 专属的机器链路（一个函数，含可测试的 `runDiscoveryWith`）。
- `src/tasks/radar/radar-discover.tsx`：Radar 自己的 Human-facing 配置面。
- `src/routes/api/radar.capabilities.ts`、`src/routes/api/radar.run.ts`：machine-facing API。

### 仍暂缓（与原清单一致）

- 完整 workflow editor / node canvas
- 通用 plugin framework
- provider / credential marketplace
- schedule runtime
- 任意 Task 的 Models / Agents / Workflows / Settings 导航页
- schema 引擎驱动所有页面

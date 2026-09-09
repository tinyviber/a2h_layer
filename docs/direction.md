# 产品方向（个人记录）

> 这份文档是「我为什么这样决定」的留档，给未来的我自己看。
> 不是规范文档；设计细节看 `design.md`，Coding 任务的契约看
> `output-contract.md`。

## 这次要解决的真正问题

把「Agent Output Reader」从一个**单任务工具**（读 Coding Agent 的 Run），
推进到「长期可以往里加新任务形态」的产品骨架。

需求里反复出现的真问题是：

1. 我有多个长期存在的任务，不是单次投递。
2. 任务各自天然不同——Radar ≠ Coding ≠ 之后的研究/自动化。
3. 某些流程需要可视化配置；某些只需要 Agent 直接读写。
4. 不要把所有任务都长成同一种 SaaS Dashboard。
5. 我和 Agent 长期协作，不是做给企业用的。

## 核心抽象：Task

**Task 是长期存在的小型工作空间。** 它拥有：

- **manifest**（id、name、path、description、hint、readKey）—— Home 列出
  任务、chrome 标任务名时用。
- **自己的数据契约**（Signal / Run / 未来别的类型）—— zod 校验。
- **自己的存储**（in-memory + fixtures + POST endpoint）—— Agent 连进来的接
  口。
- **自己的 surface**（人阅读它的 React 组件）—— 自由。
- **本地交互状态**（已读、判断）—— localStorage 覆盖在服务端状态之上。

统一的是**「底层能力如何被描述和连接」**，不是页面。

## 概念清单（核心 5 个，刻意压住）

| 概念 | 是什么 | 谁能动它 |
| --- | --- | --- |
| **Task** | 一个长期工作空间 | 我（加/改），Task 自己（自己的数据） |
| **Surface** | Task 的人读层 | Task 自己 |
| **Item** | Task 里的一条记录（Run / Signal / 未来别的） | Agent / 自动化 / 我 |
| **Decision** | 人对一条 Item 的判断（已读 / 跟进 / 忽略 / …） | 只有我（localStorage） |
| **Ingest endpoint** | Agent 投数据的入口 | Agent |

刻意没有引入的概念：workflow engine、event bus、capability registry、用户
系统、权限、推送、跨任务聚合。详见「暂不做」。

## 「统一系统，不统一页面」怎么落

**统一的（所有 Task 必须用）：**

- 设计 token（paper / text / muted / track / 强条色 4 个）
- 字体、间距、字号梯度
- Task chrome（`工作台 | TaskName`），sticky，所有 Task 都用
- 「未读 = 6px 近黑圆点」「待处理 = 文字词」这套视觉语言
- 「3px 左边条 = 单一信号（状态 / 重要度）」的用法
- Agent ingest 端点的协议风格（`POST /api/<task>/`，返回 400/201，zod
  校验）

**灵活的（每个 Task 自己决定）：**

- 数据形状与字段名（Signal 有 `topic/source/importance`，Run 有
  `agent/status/blocks`）
- 阅读顺序（Run: 标题→结论→下一步→证据；Signal: 标题→建议→详情→判断）
- 行的 meta 字段（Run 有 `agent · status · project`，Signal 有
  `topic · source · 重要度`）
- 人的交互动作（Run: 标记已读；Signal: 跟进 / 忽略）

## Home 是概览，不是 Dashboard

只有 5 个组件在页面上：

- 任务名
- 一行描述
- 待处理条数（或「暂无待处理」）
- 最新变化（标题 + 相对时间）
- 一个未读圆点

没有 cards，没有 metric triptych，没有图表，没有 KPI。一份安静的清单，像打开
笔记的第一页。

## 为什么 Radar 放在第一位

Radar 是需求里被点名最多的任务类型，也是最容易证伪「统一系统不统一页面」
的——它的交互本质是「读 → 判断 → 继续」，和 Coding 的「读结果」完全不是同
一件事。如果 Radar 也能用任务基座跑起来，并且看起来**根本不像** Coding，那
这个抽象就是对的。

Coding 是已存在的工作，**完全保留**，重定位为「Coding 任务」，证明旧内容不
会被抽象掉。

## 暂不做（明确清单）

这一阶段**故意没做**的事。每一条都是深思熟虑的「以后再说」，不是遗漏。

- **没有 workflow editor / 低代码画布**。Radar 的自动化将来是 Radar 自己
  的 `automations/`（cron + Agent 调用），不是一个通用的可视化层。某些 Task
  可以拥有 workflow 能力，**但 workflow 不是产品的核心**。
- **没有真实的模型 / Agent / 搜索 API 调用**。fixtures 起步，Agent 的接入是
  通过 `POST` 端点已经跑通，剩下的是 Radar 自己内部的事。
- **没有跨任务的事件总线 / 时间线聚合**。Home 当前只问每个 Task 「最新一条
  是什么」，跨任务的事件流是另一种语义层，加之前会先看是否真的需要。
- **没有真实数据库 / 持久化**。重启丢内存投递；这是 dev 阶段的诚实选择，
  上线前会接存储。
- **没有登录 / 鉴权 / 多用户**。单人长期使用，不需要。
- **没有推送 / 实时通知**。当前是「我打开看」。
- **没有 artifact 文件存储 / 预览服务器**。Signal 里的 `href` 是外链，不是
  上传。
- **没有 per-task 自定义属性 schema 引擎**（YAML 驱动 surface）。Surface
  现在是 React 代码，是更诚实的实现方式。
- **没有 darker mode / 主题切换**。design.md 明确不要 dark theme；如果以
  后真要，要么整体重做设计语言，要么就别做。
- **没有跨设备的同步**。localStorage 是设备本地的；以后要么接存储，要么接
  某个轻同步层。

## 决策里我特意避开的东西

- **没把 Dashboard 做成默认入口**。Home 是清单，不是工作台里的另一张
  Dashboard。需求里点名了 n8n / dashboard / workflow / tree / layer 这些词，
  这些是描述体验时使用的语言，不是 UI 元素的名字。
- **没把 importance 做成颜色徽章 / 胶囊**。design.md 明确禁掉了 badge /
  pill 堆。importance 通过左边条 + 文字词表达，最强也只是「近黑」。
- **没把 跟进 / 忽略 写成 server mutation**。判断是人的事，留在
  localStorage；这是 dev 阶段的诚实选择。
- **没把 Task 设计成插件系统**。注册表就是 `src/task/tasks.ts` 里的一个数
  组，加 Task = 写 manifest、components、route。这个数量级的「扩展机制」
  对个人项目是合适的，不值得做一个框架。
- **没把 output-contract.md 改成支持 Signal**。它是 Coding 任务的契约；
  Radar 的契约在 `src/tasks/radar/signal.ts`。每个 Task 自己定义契约。
- **没把 raw JSON 留在独立路由**。原来 `/raw/:id` 现在折叠到
  `/coding/:id` 的页脚里。Debug 视角不应该有自己的顶级路由。

## 未来可以长出来的方向

这些**不是这一阶段的目标**，但基座已经为它们留出了位置：

- 第三个 Task：研究 / 内容 / 项目观察 / 自动化之一，看那时真实需求而定。
- Radar 内部的自动化（cron 拉取、Agent 巡检、模型打分重要性）作为 Radar
  自己的能力，不是系统的通用能力。
- 持久化（替换 in-memory Map）。
- 跨任务通知：当一个 Task 的状态变化波及另一个时——但**先看是否真的需要**。
- 在某个 Task 内部出现「不是 inbox 也不是文档」的第三种形态（比如一个
  timeline view、或者一个 workflow step 列表），证明 surface 的自由度能撑住。

## 演化轨迹

设计语言因为产品范围扩大而演化的部分：

- 新增「任务框架」概念：Home / Task chrome / in-task list / reading pages
  四层，每一层有自己的视觉规则。
- 新增 attention 模型：未读圆点 + 待处理计数 + 重要度左边条。
- 共享的视觉语言（设计 token）完全保留，没有被新组件稀释。
- 没有任何规则被削弱；只有新规则被加入。
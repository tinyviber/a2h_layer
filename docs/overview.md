# 概览：把仓库推进到「任务型个人工作界面」

## 一句话

把 `Agent Output Reader` 从「单任务阅读层」推进成「任务型个人工作界面」的
产品骨架：Home 概览 + 第一个新任务 Radar + 重定位 Coding，**保留**所有已有
有效成果。

## 做了什么

### 核心抽象：Task（统一系统，不统一页面）

`src/task/` 引入最小的任务基座：
- `TaskMeta`：id / name / path / readKey / description / hint（Home 与 chrome 用）
- `TaskSummary`：归一化条目数组（让 Home 不感知 Signal/Run 的具体形状）
- `tasks.ts`：注册表——加 Task = 写一个文件 + 登记一行
- `home.ts`：Home 聚合（pure `buildHomeSummary` + `getHomeFn` server fn）

### Home（`/`）—— 概览，不是 Dashboard

`src/components/home-list.tsx`：安静的任务清单。
- 每行：任务名（strong）+ 描述（muted）+ 待处理计数 + 最新变化 + 相对时间
- 未读沿用 6px 近黑圆点
- 没有 cards，没有指标，没有图表

### 第一个新任务：Radar（`/radar`）

`src/tasks/radar/`：
- Signal 契约（`signal.ts`，zod 校验）：id / title / topic / source /
  importance / detail / suggestion / href / 时间戳 / unread / status
- 内存存储 + fixtures（5 条贴近真实关注主题的信号）
- `POST /api/radar/` ingest（与 `POST /api/runs` 同模式）
- 列表 + 阅读组件：
  - **阅读顺序固定为** 标题 → 元信息 → **建议（先于详情，判断优先）** →
    详情 → 来源 → 跟进/忽略
  - 跟进/忽略为本地状态（localStorage），不改服务端
  - 重要度通过 3px 左边条表达：高=近黑、中=muted、低=track（去强调）

### 现有 Reader 重定位为 Coding（`/coding`）

- 完全保留 Run 契约与阅读组件，重挂到 `/coding` 路径
- raw JSON 折叠到阅读页内（去掉独立 `/raw/:id` 路由）
- 已读状态 hook 泛化（`useItemReadState(storageKey)`），保留旧 key 兼容

### 共享框架

- `TaskChrome`：sticky 顶部 `工作台 | TaskName`（所有任务页统一）
- 每个任务的路由用 layout + index 模式，TaskChrome 上移到 layout

### 文档

- `README.md`：从「Agent Output Reader」重写为产品 README
- `design.md`：在原原则基础上加入 Home / Task chrome / Radar 信号语言 / per-
  task surface 自由度
- `docs/direction.md`：核心决策 + **「暂不做」清单**（workflow editor / 跨
  任务事件总线 / 真实数据库 / 推送 / 鉴权 / 工作流编辑器 全部明确推迟）
- `output-contract.md`：不变（Coding 任务的契约）

## 关键设计判断（不能机械实现的部分）

1. **核心抽象是 Task，不是 Dashboard/workflow/tree/layer**——这些是描述语言
   不是 UI 元素。
2. **Home 是清单，不是 dashboard**——一行一个任务 + 未读点 + 最新变化。
3. **Unify system, not pages**——设计 token / chrome / ingest 协议一致，
   surface（人读层）每个任务自由。
4. **重要性/状态的视觉语言**只用「文字词 + 3px 边条 + 6px 圆点」，没有 badge
   / pill / 卡片堆。
5. **判断（跟进/忽略）是 localStorage 覆盖**——dev 阶段的诚实选择，不假装有
   mutation API。
6. **Radar 放第一位**：它与 Coding 交互完全不同（读→判断 vs 读结果），最能证
   伪「统一系统不统一页面」。

## 暂不做（明确清单）

- workflow editor / 低代码画布
- 真实模型 / Agent / 搜索 API 调用
- 跨任务事件总线 / 推送 / 通知
- 真实数据库 / 持久化
- 登录 / 鉴权 / 多用户
- artifact 文件存储 / 预览服务器
- per-task 动态 schema 引擎

详见 `docs/direction.md`。

## 验证

- `npm run typecheck`：通过
- `npm run build`：通过（Vite + nitro，89ms）
- `npm test`：189/195 通过（6 个失败均在 `grok-pwa-plugin.test.mjs` 平台测试
  里，与产品改动无关，是本地环境差异）
- `node scripts/check-reader.mjs`：所有断言通过（Home 2 任务、Coding ≥6
  runs、failed 证据可见、log tail 80、diff preview 40、mark-read、Radar ≥5
  信号 等）
- 真实浏览器渲染：桌面 + 移动（390px）截图均在 `screenshots/`

## 接下来可以做的（按基座已留出的位置）

- 第三个 Task（研究 / 内容 / 项目观察 / 自动化 之一）——证明 surface 自由度
- Radar 内部自动化（cron + Agent 调用）——作为 Radar 自己的能力
- 持久化替换 in-memory
- 跨任务通知——**先看是否真的需要**
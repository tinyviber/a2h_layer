# 工作台

我和 Agent 一起工作的个人界面。长期任务为骨，结构化产出为肉。

不是 IDE、不是笔记、不是 SaaS Dashboard、不是 n8n 缩小版。

## 核心想法

任务 (Task) 是一个长期存在的小型工作空间。每个任务有自己的数据、状态、
历史、模型、Agent、工具、API，以及人与 Agent 之间的交互方式。

系统统一的是**「底层能力如何被描述和连接」**，而不是页面。不同的任务可以
拥有**真正适合自己的界面**——Radar 看起来像阅读 Inbox，Coding 看起来像
diff / preview / artifact，别的任务以后可以是别的形态。

机器为了工作需要看到的东西，与人为了理解、判断和行动需要看到的东西，从
**一开始就是分开的**。Agent 不决定最终的人类界面长什么样。

## 当前包含两个任务

| 任务 | 是什么 | 交互方式 |
| --- | --- | --- |
| **Radar** | 持续观察几个主题，Agent 产出需要人判断的信号 | 阅读 → 判断（跟进 / 忽略） → 继续 |
| **Coding** | Coding Agent 每次跑完投一份结构化 Run，你按固定顺序读完结论与证据 | 读结果 → 看证据 |

更多任务（Radar 是其中一个例子，将来还会有内容生产、项目观察、研究、
自动化，等等）会按需加入，每个任务都长成最适合自己的样子，但共享同一套
设计语言、同一个 Home、同一种 Agent 接入方式。

## 怎么读

| 路径 | 干什么 |
| --- | --- |
| `/` 工作台 | 一行一个长期任务：名字、描述、最新变化、待处理条数 |
| `/radar` | Radar 信号列表 |
| `/radar/:id` | 单条信号：标题 → 元信息 → 建议 → 详情 → 跟进 / 忽略 |
| `/coding` | Coding Runs 列表（按时间倒序） |
| `/coding/:id` | 一次 Run：标题 → 元信息 → 结论 → 下一步 → 证据块 → 标记已读 / 原始 JSON |

第一版不接真实数据库、登录、推送。仓库里有 6 份静态 Run fixture 和 5 份
静态 Signal fixture，启动就能读。也可以 `POST /api/runs` 或 `POST /api/radar/`
往内存里再投一份。

## Agent 怎么连进来

每个任务暴露一个极简的 ingest 端点（无鉴权，内存投递）：

| 端点 | 给什么 | 校验 |
| --- | --- | --- |
| `POST /api/runs` | Run JSON（见 `output-contract.md`） | zod |
| `POST /api/radar/` | Signal JSON（`importance` + `suggestion` + `topic`） | zod |

Agent 读任务的当前状态：`GET /api/runs`、`GET /api/radar/`。Agent 不必通过
任何可视化 workflow 搭建——知道自己该做什么的 Agent 直接读写就行。某些流程
可以是固定的自动运行；某些会在中间停下来等人读、判断、继续。

## 第一版能做什么 / 明确不能做什么

| 能做 | 不能做 |
| --- | --- |
| Home 列出长期任务（名字、描述、最新变化、待处理） | 主题市场、多用户、评论 |
| Radar 信号列表 + 单条阅读（判断 / 跟进 / 忽略，本地状态） | 跨任务的事件总线 / 推送 |
| Coding Runs 列表 + 阅读（markdown / code / diff / log / table / file） | 在 App 里改代码 |
| 未知 block 类型显示「不支持的块」，不丢数据 | 渲染任意 HTML / JS / Agent CSS |
| 打开阅读页后用 localStorage 标已读 | 登录、推送、文件上传、真实数据库 |
| Coding 原始 JSON 在阅读页内折叠展开 | 卡片墙、指标胶囊、图表库 |
| Radar 信号跟进 / 忽略为本地状态，不写回 | 工作流编辑器、低代码平台 |
| 离线打开已缓存的 fixtures（PWA） | 嵌套卡片、紫渐变英雄区 |
| `POST /api/runs` 与 `POST /api/radar/` 内存投递（无鉴权） | 把过程写成「我首先分析了仓库…」 |

状态只显示为：进行中 / 成功 / 失败 / 部分完成。颜色只是左边 3px 色条的辅
助，不能单独承担含义。

## 本地运行

```bash
npm i
npm run dev
```

开发服务器在 `http://localhost:8080`。所有 fixture 启动即可读。

## 用 HTTP 投一份

投一次 Run：

```bash
curl -sS -X POST http://localhost:8080/api/runs \
  -H 'content-type: application/json' \
  -d @src/fixtures/run_empty.json
```

投一条 Radar 信号：

```bash
curl -sS -X POST http://localhost:8080/api/radar/ \
  -H 'content-type: application/json' \
  -d '{
    "id": "sig_x",
    "title": "某主题出现了新东西",
    "topic": "某观察主题",
    "source": "rss",
    "importance": "high",
    "suggestion": "今天花 10 分钟看一下",
    "createdAt": "2026-09-09T10:00:00.000Z",
    "updatedAt": "2026-09-09T10:00:00.000Z"
  }'
```

字段不合格返回 `400`。`id` 已存在则覆盖。Home / 任务列表刷新后能看到新内容。
进程重启后内存投递消失，fixtures 仍在。

## 仓库怎么读

```
src/
  task/         任务基座（types / 注册表 / Home 聚合 / 共享设计概念）
  tasks/
    radar/      Radar 任务：信号契约、fixtures、列表与阅读组件
    coding/     （Coding 沿用 src/lib/run-*，见下文）
  components/   通用 UI（task-chrome、home-list、inbox-list、run-reader…）
  routes/       路由：index（Home）、radar(.index & $id)、coding(.index & $id)、api/*
  lib/          通用数据层：run-*（=Coding 的 Coding 契约）、fixtures、format…
  styles.css    设计 token + 共享 CSS
docs/direction.md  产品决策与「暂不做」清单
design.md          视觉与交互原则
output-contract.md Coding 任务的 Run 契约（Agent 必须按这份投）
```

## 它故意长成什么样

简单、可理解、可修改、可组合、长期维护成本低、每天愿意打开。

可以很强，但不应该因为能力强而显得复杂。

不是企业后台、SaaS Dashboard、满屏 Cards、低代码平台，也不是 n8n 的缩小
版。那些产品可以作为能力层面的参考，但不应该成为视觉与交互上的默认答案
。它它首先是一个我和很多 Agent 长期共同工作的界面。
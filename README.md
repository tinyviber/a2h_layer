# Agent Output Reader

一次 Agent 跑完之后，人要读的那一层。不是 IDE，不是笔记，不是 Dashboard。

Coding Agent 只投一份结构化 JSON（一次叫一个 **Run**）。这个 App 独占渲染：列表里找到它，打开后按固定顺序读完结论和证据。

打开应在三秒内看懂三件事：

1. 这次干完了什么
2. 该先看哪段证据
3. 失败时下一步是什么

## 怎么读

| 页面 | 干什么 |
| --- | --- |
| `/` Inbox | 一行一次 Run：标题、来源 Agent、状态、相对时间、未读点 |
| `/runs/:id` | 阅读页。顺序锁死：标题 → 结论 → 下一步 → 证据块 |
| `/raw/:id` | 原始 JSON，调试用 |

第一版不接真实数据库、登录、推送。仓库里有 6 份静态 fixture，启动就能读。也可以 `POST /api/runs` 往内存里再投一份。

契约：[output-contract.md](./output-contract.md)。视觉：[design.md](./design.md)。

## 第一版能做什么 / 明确不能做什么

| 能做 | 不能做 |
| --- | --- |
| Inbox 列出 Run（标题、来源、状态文字、相对时间、未读） | 主题市场、多用户、评论 |
| 阅读页按固定顺序渲染 summary / 下一步 / blocks | 在 App 里改代码 |
| markdown / code / diff / log / table / file | 渲染任意 HTML / JS / Agent CSS |
| 未知 block 显示「不支持的块」，不丢数据 | 卡片墙、指标胶囊、图表库 |
| 点进阅读页后用 localStorage 标已读 | 登录、推送、文件上传、真实数据库 |
| 离线打开已缓存的 fixtures（PWA） | 嵌套卡片、紫渐变英雄区 |
| `POST /api/runs` 内存投递（无鉴权） | 把过程写成「我首先分析了仓库…」 |

状态只显示为：进行中 / 成功 / 失败 / 部分完成。颜色只是左边 3px 色条的辅助，不能单独承担含义。

## 本地运行

```bash
npm i
npm run dev
```

开发服务器在 `http://localhost:8080`。六个静态 fixture 在 `src/fixtures/`，启动即可读。

## 用 HTTP 投一份 Run

同一进程提供极简 ingest（内存，无鉴权）：

```bash
curl -sS -X POST http://localhost:8080/api/runs \
  -H 'content-type: application/json' \
  -d @src/fixtures/run_empty.json
```

```bash
curl -sS http://localhost:8080/api/runs
curl -sS http://localhost:8080/api/runs/run_empty
```

字段不合格返回 `400`。`id` 已存在则覆盖。Inbox 刷新后能看到新 Run。进程重启后内存投递消失，fixtures 仍在。

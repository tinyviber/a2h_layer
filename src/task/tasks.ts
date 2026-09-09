import type { TaskMeta } from "./types";

// 任务注册表只放真正属于 Task identity 的元信息。
// Home 如何汇总 attention 由 home-registry 单独适配，避免把 unread/items 强塞给所有 Task。
export const TASKS: TaskMeta[] = [
  {
    id: "radar",
    name: "Radar",
    path: "/radar",
    description: "持续发现值得阅读的多语言 source，整理成人类阅读 Inbox。",
    hint: "发现 · 阅读 · 思考",
  },
  {
    id: "coding",
    name: "Coding",
    path: "/coding",
    description: "Coding Agent 每次跑完投一份结构化 Run，你按固定顺序读完结论与证据。",
    hint: "读结果 · 看证据",
  },
];

export function getTaskMeta(id: string): TaskMeta | undefined {
  return TASKS.find((task) => task.id === id);
}

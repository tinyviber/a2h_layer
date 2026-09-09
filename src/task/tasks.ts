import type { TaskMeta } from "./types";

// 任务注册表。加一个 Task = 在 src/tasks/<id>/ 写它的契约与 surface，
// 然后在这里登记一条元信息。
export const TASKS: TaskMeta[] = [
  {
    id: "radar",
    name: "Radar",
    path: "/radar",
    readKey: "aor:radar-read-ids",
    description: "持续观察几个主题，Agent 产出需要你判断的信号。",
    hint: "阅读 · 判断 · 继续",
  },
  {
    id: "coding",
    name: "Coding",
    path: "/coding",
    readKey: "aor:read-ids",
    description: "Coding Agent 每次跑完投一份结构化 Run，你按固定顺序读完结论与证据。",
    hint: "读结果 · 看证据",
  },
];

export function getTaskMeta(id: string): TaskMeta | undefined {
  return TASKS.find((task) => task.id === id);
}

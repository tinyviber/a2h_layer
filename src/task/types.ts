// 任务基座：统一的是「系统」，不是「页面」。
//
// Task 只描述长期工作空间本身。Inbox / unread / items 都不是 Task 的固有属性；
// 它们只是某些 Task 选择使用的 Home projection pattern。

export type TaskId = string;

export type TaskMeta = {
  id: TaskId;
  name: string;
  /** 这个任务的入口路径。 */
  path: string;
  description: string;
  /** Home 上提示这个任务主要的人类交互方式。 */
  hint: string;
};

/** 某些 Task 可以把内部记录投影成 Home 可理解的一条“最新变化”。 */
export type HomeItem = {
  id: string;
  title: string;
  updatedAt: string;
  unread?: boolean;
};

/**
 * Home 只关心“哪里值得我注意”，不要求 Task 内部一定存在 items / unread。
 * local-read 是当前 Radar / Coding 使用的模式；未来任务也可以直接给 count，
 * 或完全没有 attention 概念。
 */
export type TaskAttention =
  | { kind: "local-read"; storageKey: string; items: HomeItem[] }
  | { kind: "count"; count: number; label?: string }
  | { kind: "none" };

/** Home 消费的 Task 快照。它是 projection，不是 Task 的 domain model。 */
export type TaskSummary = TaskMeta & {
  attention: TaskAttention;
  latest?: HomeItem;
};

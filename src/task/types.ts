// 任务基座：统一的是「系统」，不是「页面」。
//
// 一个 Task 是一个长期存在的小型工作空间。它在这里只被描述成最少的东西：
// 元信息（Home 用它列出来）+ 它自己的 surface（人阅读它的方式）。
// 数据、状态、契约、交互全部由每个 Task 自己定义，见 src/tasks/<id>/。

export type TaskId = string;

export type TaskMeta = {
  id: TaskId;
  name: string;
  /** 这个任务列表页的路由路径（任务名在 chrome 里点它回到列表）。 */
  path: string;
  /** 本地已读状态的 localStorage key（Home 用它判断「哪里需要我注意」）。 */
  readKey: string;
  description: string;
  /** Home 上这一行提示这个任务的交互方式（阅读 / 判断 / 观察…）。 */
  hint: string;
};

/** Home 聚合时对任意任务条目做的归一化，让 Home 不感知 Signal / Run 的具体形状。 */
export type HomeItem = {
  id: string;
  title: string;
  updatedAt: string;
  unread: boolean;
};

/** Home 概览里一行任务的快照。 */
export type TaskSummary = TaskMeta & {
  /** 按 updatedAt 倒序的条目，用于算「最新变化」和「未读数」。 */
  items: HomeItem[];
};

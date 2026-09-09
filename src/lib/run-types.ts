export const AGENTS = [
  "codex",
  "claude-code",
  "grok",
  "openclaw",
  "other",
] as const;

export const STATUSES = ["running", "success", "failed", "partial"] as const;

export type Agent = (typeof AGENTS)[number];
export type RunStatus = (typeof STATUSES)[number];

export type NextAction = {
  label: string;
  href?: string;
};

export type Block = {
  type: string;
  id?: string;
  text?: string;
  path?: string;
  language?: string;
  command?: string;
  exitCode?: number;
  caption?: string;
  note?: string;
  columns?: Array<string>;
  rows?: Array<Array<string>>;
  restJson?: string;
};

export type Run = {
  id: string;
  title: string;
  agent: Agent;
  project: string;
  status: RunStatus;
  createdAt: string;
  updatedAt: string;
  unread: boolean;
  summary: Array<string>;
  nextActions: Array<NextAction>;
  blocks: Array<Block>;
};

export const DIFF_PREVIEW_LINES = 40;
export const LOG_TAIL_LINES = 80;
export const TITLE_MAX = 80;
export const SUMMARY_MAX_ITEMS = 5;
export const SUMMARY_ITEM_MAX = 140;
export const ACTION_LABEL_MAX = 40;
export const MARKDOWN_MAX = 8000;
export const ACTIONS_VISIBLE = 3;

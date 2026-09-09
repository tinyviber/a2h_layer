import { Link } from "@tanstack/react-router";

export function RunMissing() {
  return (
    <main className="page">
      <p className="empty-copy">找不到这次 Run。</p>
      <p>
        <Link to="/coding" className="back-link">
          返回 Coding
        </Link>
      </p>
    </main>
  );
}

export function RoutePending() {
  return (
    <main className="page">
      <p className="muted">正在读取…</p>
    </main>
  );
}

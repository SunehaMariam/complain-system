import React from "react";

const styles = {
  Pending: "bg-amber-50 text-amber-600",
  "In Progress": "bg-progress-bg text-progress",
  Resolved: "bg-success-bg text-success",
  Rejected: "bg-danger-bg text-danger",
  pending: "bg-amber-50 text-amber-600",
  active: "bg-success-bg text-success",
  rejected: "bg-danger-bg text-danger",
  deactivated: "bg-surface-border text-ink-muted",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
      styles[status] || "bg-surface-border text-ink-muted"
    }`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {status}
  </span>
);

export default StatusBadge;

import React from "react";
import { Clock, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const priorityColor = {
  Low: "text-ink-faint",
  Medium: "text-progress",
  High: "text-amber-600",
  Urgent: "text-danger",
};

const ComplaintCard = ({ complaint, onEdit, onDelete, showUser }) => {
  const canModify = complaint.status === "Pending" && (onEdit || onDelete);

  return (
    <div className="bg-white border border-surface-border rounded-lg p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-serif text-lg font-semibold text-navy-800 truncate">
              {complaint.title}
            </h3>
            <span className={`text-xs font-semibold ${priorityColor[complaint.priority]}`}>
              {complaint.priority}
            </span>
          </div>
          {showUser && complaint.user && (
            <p className="text-xs text-ink-muted mt-0.5">
              {complaint.user.name} · {complaint.user.email}
            </p>
          )}
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <p className="text-sm text-ink-muted mt-3 line-clamp-2">{complaint.description}</p>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-border">
        <div className="flex items-center gap-3 text-xs text-ink-faint">
          <span className="rounded-full bg-surface-sunken px-2.5 py-1">{complaint.category}</span>
          <span className="flex items-center gap-1">
            <Clock size={13} />
            {new Date(complaint.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {canModify && (
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(complaint)}
                className="p-1.5 rounded-md text-ink-muted hover:bg-surface-sunken hover:text-navy-700"
                title="Edit"
              >
                <Pencil size={15} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(complaint)}
                className="p-1.5 rounded-md text-ink-muted hover:bg-danger-bg hover:text-danger"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {complaint.adminRemarks && (
        <div className="mt-3 text-xs bg-surface-sunken rounded-md px-3 py-2 text-ink-muted">
          <span className="font-medium text-navy-700">Admin note: </span>
          {complaint.adminRemarks}
        </div>
      )}
    </div>
  );
};

export default ComplaintCard;

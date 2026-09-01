import React from "react";

const Loader = ({ full }) => (
  <div
    className={
      full
        ? "min-h-screen flex items-center justify-center bg-surface-sunken"
        : "flex items-center justify-center py-12"
    }
  >
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-navy-100 border-t-navy animate-spin" />
      <span className="text-sm text-ink-muted">Loading…</span>
    </div>
  </div>
);

export default Loader;

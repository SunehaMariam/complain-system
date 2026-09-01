import React from "react";

const StatCard = ({ label, value, icon: Icon, tone = "navy" }) => {
  const tones = {
    navy: "bg-navy-700 text-white",
    amber: "bg-amber text-navy-800",
    white: "bg-white text-navy-800 border border-surface-border",
  };

  return (
    <div className={`rounded-lg p-5 shadow-card ${tones[tone]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p
            className={`text-xs font-medium ${
              tone === "white" ? "text-ink-muted" : "text-white/70"
            }`}
          >
            {label}
          </p>
          <p className="font-serif text-3xl font-semibold mt-1.5">{value}</p>
        </div>
        {Icon && (
          <div
            className={`h-9 w-9 rounded-md flex items-center justify-center ${
              tone === "white" ? "bg-surface-sunken" : "bg-white/15"
            }`}
          >
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

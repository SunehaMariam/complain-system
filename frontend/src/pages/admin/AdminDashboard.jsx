import React, { useEffect, useState } from "react";
import { Users, FileText, Clock, CheckCircle2, UserCheck } from "lucide-react";
import AppShell from "../../components/AppShell";
import StatCard from "../../components/StatCard";
import Loader from "../../components/Loader";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [userStats, setUserStats] = useState(null);
  const [complaintStats, setComplaintStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/users/stats"), api.get("/complaints/stats")])
      .then(([u, c]) => {
        setUserStats(u.data);
        setComplaintStats(c.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell title="Admin overview" subtitle="Monitor accounts and complaints across the institution.">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
            Accounts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total users" value={userStats.total} icon={Users} tone="navy" />
            <StatCard label="Pending approval" value={userStats.pending} icon={Clock} tone="amber" />
            <StatCard label="Active" value={userStats.active} icon={UserCheck} tone="white" />
            <StatCard label="Deactivated" value={userStats.deactivated} icon={Users} tone="white" />
          </div>

          <h2 className="text-sm font-semibold text-ink-muted uppercase tracking-wide mb-3">
            Complaints
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total complaints" value={complaintStats.total} icon={FileText} tone="navy" />
            <StatCard label="Pending review" value={complaintStats.pending} icon={Clock} tone="white" />
            <StatCard label="In progress" value={complaintStats.inProgress} icon={Clock} tone="white" />
            <StatCard label="Resolved" value={complaintStats.resolved} icon={CheckCircle2} tone="white" />
          </div>

          <div className="bg-white border border-surface-border rounded-lg p-6 shadow-card">
            <h3 className="font-serif text-lg font-semibold text-navy-800 mb-4">
              Complaints by category
            </h3>
            <div className="space-y-3">
              {complaintStats.byCategory.length === 0 && (
                <p className="text-sm text-ink-muted">No complaints submitted yet.</p>
              )}
              {complaintStats.byCategory.map((cat) => {
                const pct = complaintStats.total
                  ? Math.round((cat.count / complaintStats.total) * 100)
                  : 0;
                return (
                  <div key={cat._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-navy-800 font-medium">{cat._id}</span>
                      <span className="text-ink-muted">{cat.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-surface-sunken overflow-hidden">
                      <div
                        className="h-full bg-navy-700 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
};

export default AdminDashboard;

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Clock, Loader2Icon, CheckCircle2, PlusCircle } from "lucide-react";
import AppShell from "../../components/AppShell";
import StatCard from "../../components/StatCard";
import ComplaintCard from "../../components/ComplaintCard";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const UserDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/complaints/mine")
      .then(({ data }) => setComplaints(data.complaints))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    pending: complaints.filter((c) => c.status === "Pending").length,
    inProgress: complaints.filter((c) => c.status === "In Progress").length,
    resolved: complaints.filter((c) => c.status === "Resolved").length,
  };

  return (
    <AppShell
      title={`Welcome back, ${user?.name?.split(" ")[0]}`}
      subtitle="Here's a snapshot of your complaints."
    >
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total submitted" value={complaints.length} icon={FileText} tone="navy" />
            <StatCard label="Pending" value={counts.pending} icon={Clock} tone="white" />
            <StatCard label="In progress" value={counts.inProgress} icon={Loader2Icon} tone="white" />
            <StatCard label="Resolved" value={counts.resolved} icon={CheckCircle2} tone="white" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg font-semibold text-navy-800">Recent complaints</h2>
            <Link
              to="/dashboard/submit"
              className="flex items-center gap-1.5 text-sm font-medium text-navy-700 hover:text-navy-600"
            >
              <PlusCircle size={16} />
              New complaint
            </Link>
          </div>

          {complaints.length === 0 ? (
            <div className="bg-white border border-dashed border-surface-border rounded-lg p-10 text-center">
              <p className="text-ink-muted text-sm">
                You haven't submitted any complaints yet.
              </p>
              <Link
                to="/dashboard/submit"
                className="inline-block mt-4 rounded-md bg-navy-700 text-white text-sm font-medium px-5 py-2.5 hover:bg-navy-600"
              >
                Submit your first complaint
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {complaints.slice(0, 4).map((c) => (
                <ComplaintCard key={c._id} complaint={c} />
              ))}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
};

export default UserDashboard;

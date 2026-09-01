import React, { useEffect, useState } from "react";
import { Search, Check, X as XIcon, Power, ShieldPlus, ShieldMinus, Trash2 } from "lucide-react"; // <-- Trash2 added here
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const tabs = ["pending", "active", "rejected", "deactivated", "all"];

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    const params = {};
    if (tab !== "all") params.status = tab;
    if (search) params.search = search;
    api
      .get("/users", { params })
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  };

  useEffect(load, [tab]);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const act = async (id, action, payload) => {
    setBusyId(id);
    try {
      if (action === "approve") await api.patch(`/users/${id}/approve`);
      if (action === "reject") await api.patch(`/users/${id}/reject`);
      if (action === "toggle") await api.patch(`/users/${id}/toggle-active`);
      if (action === "role") await api.patch(`/users/${id}/role`, { role: payload });
      if (action === "delete") await api.delete(`/users/${id}`); // <-- Delete API call added
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <AppShell title="Manage users" subtitle="Approve registrations and control account access.">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border capitalize transition-colors ${
                tab === t
                  ? "bg-navy-700 text-white border-navy-700"
                  : "bg-white text-ink-muted border-surface-border hover:border-navy-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="pl-9 pr-3 py-2 text-sm rounded-md border border-surface-border outline-none focus:border-navy-400 w-64"
          />
        </form>
      </div>

      {loading ? (
        <Loader />
      ) : users.length === 0 ? (
        <div className="bg-white border border-dashed border-surface-border rounded-lg p-10 text-center">
          <p className="text-ink-muted text-sm">No users in this view.</p>
        </div>
      ) : (
        <div className="bg-white border border-surface-border rounded-lg shadow-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-sunken text-left text-ink-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-surface-border">
                  <td className="px-5 py-3.5 font-medium text-navy-800">{u.name}</td>
                  <td className="px-5 py-3.5 text-ink-muted">{u.email}</td>
                  <td className="px-5 py-3.5 capitalize">{u.role}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={u.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {u.status === "pending" && (
                        <>
                          <button
                            disabled={busyId === u.id}
                            onClick={() => act(u.id, "approve")}
                            className="flex items-center gap-1 text-xs font-medium text-success bg-success-bg rounded-md px-2.5 py-1.5 hover:opacity-80 disabled:opacity-50"
                          >
                            <Check size={13} /> Approve
                          </button>
                          <button
                            disabled={busyId === u.id}
                            onClick={() => act(u.id, "reject")}
                            className="flex items-center gap-1 text-xs font-medium text-danger bg-danger-bg rounded-md px-2.5 py-1.5 hover:opacity-80 disabled:opacity-50"
                          >
                            <XIcon size={13} /> Reject
                          </button>
                        </>
                      )}
                      {(u.status === "active" || u.status === "deactivated") &&
                        u.id !== currentUser.id && (
                          <button
                            disabled={busyId === u.id}
                            onClick={() => act(u.id, "toggle")}
                            className="flex items-center gap-1 text-xs font-medium text-ink-muted bg-surface-sunken rounded-md px-2.5 py-1.5 hover:opacity-80 disabled:opacity-50"
                          >
                            <Power size={13} />
                            {u.status === "active" ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      {u.status === "active" && u.id !== currentUser.id && (
                        <button
                          disabled={busyId === u.id}
                          onClick={() => act(u.id, "role", u.role === "admin" ? "user" : "admin")}
                          className="flex items-center gap-1 text-xs font-medium text-navy-700 bg-navy-50 rounded-md px-2.5 py-1.5 hover:opacity-80 disabled:opacity-50"
                        >
                          {u.role === "admin" ? <ShieldMinus size={13} /> : <ShieldPlus size={13} />}
                          {u.role === "admin" ? "Demote" : "Make admin"}
                        </button>
                      )}
                      
                      {/* --- DELETE BUTTON ADDED HERE --- */}
                      {u.id !== currentUser.id && (
                        <button
                          disabled={busyId === u.id}
                          onClick={() => {
                            if(window.confirm("Are you sure you want to delete this user?")) {
                              act(u.id, "delete");
                            }
                          }}
                          className="flex items-center gap-1 text-xs font-medium text-danger bg-danger-bg rounded-md px-2.5 py-1.5 hover:opacity-80 disabled:opacity-50"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  );
};

export default ManageUsers;

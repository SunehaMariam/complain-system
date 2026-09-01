import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import AppShell from "../../components/AppShell";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import api from "../../api/axios";

const statuses = ["Pending", "In Progress", "Resolved", "Rejected"];
const categories = [
  "Academics", "Hostel", "Faculty", "Facilities",
  "Administration", "IT & Network", "Harassment", "Other",
];

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    if (category) params.category = category;
    if (search) params.search = search;
    api
      .get("/complaints", { params })
      .then(({ data }) => setComplaints(data.complaints))
      .finally(() => setLoading(false));
  };

  useEffect(load, [status, category]);

  const openDetail = (c) => {
    setSelected(c);
    setRemarks(c.adminRemarks || "");
    setNewStatus(c.status);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.patch(`/complaints/${selected._id}/status`, { status: newStatus, remarks });
      setSelected(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update complaint");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell title="Manage complaints" subtitle="Review, filter, and update the status of every complaint.">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
          className="relative flex-1"
        >
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or description"
            className="pl-9 pr-3 py-2 text-sm rounded-md border border-surface-border outline-none focus:border-navy-400 w-full lg:w-80"
          />
        </form>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-surface-border outline-none bg-white"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 text-sm rounded-md border border-surface-border outline-none bg-white"
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : complaints.length === 0 ? (
        <div className="bg-white border border-dashed border-surface-border rounded-lg p-10 text-center">
          <p className="text-ink-muted text-sm">No complaints match these filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-surface-border rounded-lg shadow-card overflow-hidden overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="bg-surface-sunken text-left text-ink-muted">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Submitted by</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr
                  key={c._id}
                  onClick={() => openDetail(c)}
                  className="border-t border-surface-border hover:bg-surface-sunken cursor-pointer"
                >
                  <td className="px-5 py-3.5 font-medium text-navy-800 max-w-[220px] truncate">{c.title}</td>
                  <td className="px-5 py-3.5 text-ink-muted">{c.user?.name}</td>
                  <td className="px-5 py-3.5">{c.category}</td>
                  <td className="px-5 py-3.5">{c.priority}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5 text-ink-muted whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 px-4">
          <div className="bg-white rounded-lg shadow-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between mb-1">
              <h2 className="font-serif text-lg font-semibold text-navy-800 pr-4">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-ink-muted hover:text-navy-800 shrink-0">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-ink-muted mb-4">
              {selected.user?.name} · {selected.user?.email}
              {selected.user?.department ? ` · ${selected.user.department}` : ""}
            </p>

            <div className="flex gap-2 mb-4">
              <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs">{selected.category}</span>
              <span className="rounded-full bg-surface-sunken px-2.5 py-1 text-xs">{selected.priority} priority</span>
            </div>

            <p className="text-sm text-ink-muted leading-relaxed mb-6 whitespace-pre-wrap">
              {selected.description}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Update status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm outline-none bg-white"
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Remarks <span className="text-ink-faint font-normal">(visible to the student)</span>
              </label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm outline-none resize-none focus:border-navy-400"
                placeholder="Explain what action was taken or is needed"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-navy-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-navy-700 text-white text-sm font-medium px-5 py-2 hover:bg-navy-600 disabled:opacity-60"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default ManageComplaints;

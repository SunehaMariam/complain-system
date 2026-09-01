import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import AppShell from "../../components/AppShell";
import ComplaintCard from "../../components/ComplaintCard";
import Loader from "../../components/Loader";
import api from "../../api/axios";

const categories = [
  "Academics", "Hostel", "Faculty", "Facilities",
  "Administration", "IT & Network", "Harassment", "Other",
];
const priorities = ["Low", "Medium", "High", "Urgent"];

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", category: "Academics", priority: "Medium" });
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/complaints/mine")
      .then(({ data }) => setComplaints(data.complaints))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openEdit = (c) => {
    setEditing(c);
    setForm({ title: c.title, description: c.description, category: c.category, priority: c.priority });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/complaints/${editing._id}`, form);
      setEditing(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not update complaint");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/complaints/${c._id}`);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete complaint");
    }
  };

  const filtered =
    filter === "All" ? complaints : complaints.filter((c) => c.status === filter);

  const tabs = ["All", "Pending", "In Progress", "Resolved", "Rejected"];

  return (
    <AppShell title="My complaints" subtitle="Track the status of everything you've submitted.">
      <div className="flex gap-2 flex-wrap mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              filter === t
                ? "bg-navy-700 text-white border-navy-700"
                : "bg-white text-ink-muted border-surface-border hover:border-navy-400"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-surface-border rounded-lg p-10 text-center">
          <p className="text-ink-muted text-sm">No complaints match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((c) => (
            <ComplaintCard
              key={c._id}
              complaint={c}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 px-4">
          <div className="bg-white rounded-lg shadow-card w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-lg font-semibold text-navy-800">Edit complaint</h2>
              <button onClick={() => setEditing(null)} className="text-ink-muted hover:text-navy-800">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">Title</label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm outline-none focus:border-navy-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy-800 mb-1.5">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm outline-none bg-white"
                  >
                    {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">Description</label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm outline-none resize-none focus:border-navy-400"
                />
              </div>
              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 text-sm font-medium text-ink-muted hover:text-navy-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-md bg-navy-700 text-white text-sm font-medium px-5 py-2 hover:bg-navy-600 disabled:opacity-60"
                >
                  {saving && <Loader2 size={15} className="animate-spin" />}
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
};

export default MyComplaints;

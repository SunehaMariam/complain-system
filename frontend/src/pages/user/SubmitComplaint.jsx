import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";
import AppShell from "../../components/AppShell";
import api from "../../api/axios";

const categories = [
  "Academics",
  "Hostel",
  "Faculty",
  "Facilities",
  "Administration",
  "IT & Network",
  "Harassment",
  "Other",
];
const priorities = ["Low", "Medium", "High", "Urgent"];

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academics",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.post("/complaints", form);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard/complaints"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit complaint. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell title="Submit a complaint" subtitle="Describe the issue clearly so it can be reviewed quickly.">
      <div className="max-w-2xl">
        {success ? (
          <div className="bg-white border border-surface-border rounded-lg p-10 text-center shadow-card">
            <div className="mx-auto h-12 w-12 rounded-full bg-success-bg text-success flex items-center justify-center mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h2 className="font-serif text-xl font-semibold text-navy-800">Complaint submitted</h2>
            <p className="text-sm text-ink-muted mt-2">Taking you to your complaints…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-surface-border rounded-lg p-6 sm:p-8 shadow-card space-y-5">
            {error && (
              <div className="text-sm text-danger bg-danger-bg rounded-md px-3 py-2">{error}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Title</label>
              <input
                required
                maxLength={120}
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none"
                placeholder="Brief summary of the issue"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-800 mb-1.5">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none bg-white"
                >
                  {priorities.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Description</label>
              <textarea
                required
                rows={6}
                maxLength={3000}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none resize-none"
                placeholder="What happened, when, and where? Include any relevant details."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 rounded-md bg-navy-700 text-white font-medium px-6 py-2.5 text-sm hover:bg-navy-600 transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Submit complaint
            </button>
          </form>
        )}
      </div>
    </AppShell>
  );
};

export default SubmitComplaint;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", department: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen bg-navy-800 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-card p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-success-bg text-success flex items-center justify-center mb-4">
            <CheckCircle2 size={24} />
          </div>
          <h1 className="font-serif text-xl font-semibold text-navy-800">Account created</h1>
          <p className="text-sm text-ink-muted mt-2">
            Your registration was received. An administrator needs to approve your account
            before you can sign in — this usually doesn't take long.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 rounded-md bg-navy-700 text-white text-sm font-medium px-5 py-2.5 hover:bg-navy-600"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck size={26} className="text-amber" />
          <span className="font-serif text-2xl font-semibold text-white">Redress</span>
        </div>

        <div className="bg-white rounded-lg shadow-card p-8">
          <h1 className="font-serif text-2xl font-semibold text-navy-800">Create an account</h1>
          <p className="text-sm text-ink-muted mt-1 mb-6">
            New accounts are reviewed by an administrator before access is granted.
          </p>

          {error && (
            <div className="mb-4 text-sm text-danger bg-danger-bg rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Full name</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none"
                placeholder="Jordan Ahmed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none"
                placeholder="you@institution.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Department <span className="text-ink-faint font-normal">(optional)</span>
              </label>
              <input
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none"
                placeholder="Computer Science"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none"
                placeholder="At least 6 characters"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-navy-700 text-white font-medium py-2.5 text-sm hover:bg-navy-600 transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Create account
            </button>
          </form>

          <p className="text-sm text-ink-muted text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-navy-700 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      const res = err.response?.data;
      if (res?.status === "pending") navigate("/pending");
      else setError(res?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <ShieldCheck size={26} className="text-amber" />
          <span className="font-serif text-2xl font-semibold text-white">Redress</span>
        </div>

        <div className="bg-white rounded-lg shadow-card p-8">
          <h1 className="font-serif text-2xl font-semibold text-navy-800">Sign in</h1>
          <p className="text-sm text-ink-muted mt-1 mb-6">
            One login for students, staff, and administrators.
          </p>

          {error && (
            <div className="mb-4 text-sm text-danger bg-danger-bg rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-md border border-surface-border px-3 py-2.5 text-sm focus:border-navy-400 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-navy-700 text-white font-medium py-2.5 text-sm hover:bg-navy-600 transition-colors disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              Sign in
            </button>
          </form>

          <p className="text-sm text-ink-muted text-center mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-navy-700 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

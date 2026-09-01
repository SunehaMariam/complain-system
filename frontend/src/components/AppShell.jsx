import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Users,
  ClipboardList,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const userLinks = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/dashboard/submit", label: "Submit a complaint", icon: PlusCircle },
  { to: "/dashboard/complaints", label: "My complaints", icon: FileText },
];

const adminLinks = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/users", label: "Manage users", icon: Users },
  { to: "/admin/complaints", label: "Manage complaints", icon: ClipboardList },
];

const AppShell = ({ children, title, subtitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-surface-sunken">
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between bg-navy-700 px-4 py-3">
        <div className="flex items-center gap-2 text-white">
          <ShieldCheck size={20} className="text-amber" />
          <span className="font-serif text-lg font-semibold">Redress</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-white p-1">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            open ? "block" : "hidden"
          } lg:block fixed lg:sticky top-0 z-30 h-screen w-64 shrink-0 bg-navy-700 text-navy-50 flex flex-col`}
        >
          <div className="hidden lg:flex items-center gap-2 px-6 py-6">
            <ShieldCheck size={22} className="text-amber" />
            <span className="font-serif text-xl font-semibold text-white">Redress</span>
          </div>
          <div className="px-6 pb-4 pt-2 lg:pt-0">
            <p className="text-xs uppercase tracking-wide text-navy-100/60">
              {user?.role === "admin" ? "Administrator" : "Student / Staff"}
            </p>
          </div>

          <nav className="flex-1 px-3 space-y-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/dashboard" || to === "/admin"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors border-l-2 ${
                    isActive
                      ? "bg-navy-600 text-white border-amber"
                      : "text-navy-100/80 border-transparent hover:bg-navy-600/60 hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-navy-600 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-amber text-navy-800 flex items-center justify-center font-semibold text-sm shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-navy-100/60 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-navy-100/80 hover:text-white w-full px-1 py-1.5"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </aside>

        {open && (
          <div
            className="fixed inset-0 bg-black/40 z-20 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <header className="bg-white border-b border-surface-border px-6 lg:px-10 py-6">
            <h1 className="font-serif text-2xl font-semibold text-navy-800">{title}</h1>
            {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
          </header>
          <div className="px-6 lg:px-10 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;

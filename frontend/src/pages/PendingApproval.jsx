import React from "react";
import { useNavigate } from "react-router-dom";
import { Clock, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PendingApproval = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-navy-800 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-card p-8 text-center">
        <div className="mx-auto h-12 w-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
          <Clock size={24} />
        </div>
        <h1 className="font-serif text-xl font-semibold text-navy-800">
          Waiting for approval
        </h1>
        <p className="text-sm text-ink-muted mt-2">
          Your account is pending review by an administrator. You'll be able to sign in as
          soon as it's approved.
        </p>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="inline-flex items-center gap-2 mt-6 rounded-md border border-surface-border text-navy-700 text-sm font-medium px-5 py-2.5 hover:bg-surface-sunken"
        >
          <LogOut size={15} />
          Sign out
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;

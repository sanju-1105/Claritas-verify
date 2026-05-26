import { LogOut, FileSpreadsheet, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();

  const clientSheet =
    "https://docs.google.com/spreadsheets/d/13f_WYCu2NZuJifbfToJY-4kBpNcGRPPUK0elLOTHBDs/edit?usp=sharing";

  const verifierSheet =
    "https://docs.google.com/spreadsheets/d/1tBUQ0_ghU0EUub4LQeEbO-jbMiA1q0U18oz4pIc6YXs/edit?usp=sharing";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-navy-900 text-white px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
          </div>

          <div>
            <h1 className="text-lg font-bold">
              Claritas Verify
            </h1>

            <p className="text-xs text-slate-300">
              Client Dashboard
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>

      {/* Welcome */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-navy-900">
            Welcome, {user?.fullName}
          </h2>

          <p className="text-slate-500 mt-2">
            Manage verification cases and reports.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Client Sheet */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-5">
              <FileSpreadsheet className="w-7 h-7 text-green-600" />
            </div>

            <h3 className="text-xl font-bold text-navy-900 mb-2">
              Client Sheet
            </h3>

            <p className="text-slate-500 mb-6">
              Add candidate details, case ID, and case type.
            </p>

            <a
              href={clientSheet}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Open Client Sheet
            </a>
          </div>

          {/* Verifier Sheet */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200 hover:shadow-lg transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-5">
              <ShieldCheck className="w-7 h-7 text-blue-600" />
            </div>

            <h3 className="text-xl font-bold text-navy-900 mb-2">
              Verifier Sheet
            </h3>

            <p className="text-slate-500 mb-6">
              Internal verification management and status updates.
            </p>

            <a
              href={verifierSheet}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all"
            >
              Open Verifier Sheet
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
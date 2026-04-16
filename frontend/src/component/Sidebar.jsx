import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  FiActivity,
  FiBarChart2,
  FiClipboard,
  FiClock,
  FiHome,
  FiLogOut,
  FiMessageCircle,
  FiShield,
  FiX,
  FiSun,
  FiMoon
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import { useTheme } from "../context/ThemeContext";

const navigationItems = [
  { label: "Overview", to: "/dashboard", icon: FiHome },
  { label: "Health Input", to: "/dashboard/health-input", icon: FiClipboard },
  { label: "Prediction", to: "/dashboard/prediction", icon: FiActivity },
  { label: "Results", to: "/dashboard/results", icon: FiBarChart2 },
  { label: "History", to: "/dashboard/history", icon: FiClock },
  { label: "AI Assistant", to: "/dashboard/chat", icon: FiMessageCircle },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, profileCompletion, currentPrediction } = useApp();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-slate-950/35 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`premium-scroll fixed inset-y-0 left-0 z-40 flex w-[18rem] flex-col overflow-y-auto border-r border-white/20 bg-slate-950/90 px-5 py-6 text-slate-100 shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-md">
              <FiActivity className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">Pulse AI</h1>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-400/70">
                Healthcare OS
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-white/10 p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
            >
              {theme === "dark" ? <FiSun /> : <FiMoon />}
            </button>
            <button
              type="button"
              className="rounded-full border border-white/10 p-2 text-slate-300 lg:hidden"
              onClick={onClose}
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col">
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-500">Active Profile</p>
            <h2 className="mt-2 text-base font-bold text-white">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>

          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-300">
              <span>Profile Integrity</span>
              <span className="text-cyan-400">{profileCompletion.percentage}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-cyan-500 transition-all duration-500"
                style={{ width: `${profileCompletion.percentage}%` }}
              />
            </div>
            <p className="text-[10px] italic text-slate-500">
              {currentPrediction
                ? "Risk intelligence active."
                : "Complete profile for AI insights."}
            </p>
          </div>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {navigationItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/dashboard"}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`text-lg transition-colors ${isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-400"}`} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/5 bg-white/[0.02] p-4">
          <div className="flex items-center gap-3 text-xs font-medium text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            AI Engine Synced
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
            Pulse AI is operating on encrypted local session data.
          </p>
        </div>

        <button
          type="button"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-100 transition hover:bg-red-500/20"
          onClick={() => {
            logout();
            onClose();
            toast.success("Signed out successfully", {
              icon: "👋",
              style: {
                borderRadius: "12px",
                background: "#1e293b",
                color: "#fff",
              },
            });
            navigate("/", { replace: true });
          }}
        >
          <FiLogOut />
          Sign out
        </button>
      </aside>
    </>
  );
}

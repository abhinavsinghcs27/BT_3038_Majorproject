import { FiBell, FiMenu } from "react-icons/fi";
import { useApp } from "../context/AppContext";

function getInitials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function Navbar({ title, subtitle, onMenuToggle }) {
  const { user, currentPrediction } = useApp();

  return (
    <header className="page-enter relative z-10 overflow-hidden rounded-2xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/80 sm:px-6">

      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            className="mt-1 inline-flex rounded-2xl border border-slate-200 bg-white/80 p-3 text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 lg:hidden"
            onClick={onMenuToggle}
          >
            <FiMenu />
          </button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400 md:block">
            {currentPrediction
              ? `${currentPrediction.riskLevel} RI Active`
              : "Pulse Engine Synced"}
          </div>

          <button
            type="button"
            className="inline-flex rounded-2xl border border-slate-200 bg-white/80 p-3 text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300"
            aria-label="Notifications"
          >
            <FiBell />
          </button>

          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white dark:bg-cyan-600">
              {getInitials(user?.name)}
            </div>

            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-[10px] font-medium text-slate-500">Pulse AI Assessment</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

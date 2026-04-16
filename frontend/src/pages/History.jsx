import { useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiSearch,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import RiskIndicator from "../component/RiskIndicator";

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(value) {
  return new Date(value).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function History() {
  const navigate = useNavigate();
  const { history, deleteHistoryItem } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const filteredHistory = history.filter((entry) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      entry.riskLevel.toLowerCase().includes(term) ||
      entry.headline?.toLowerCase().includes(term) ||
      entry.carePriority?.toLowerCase().includes(term) ||
      formatDate(entry.createdAt).toLowerCase().includes(term)
    );
  });

  if (history.length === 0) {
    return (
      <div className="page-enter flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-slate-100 p-5">
          <FiClock className="text-3xl text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-950">No saved predictions</h2>
        <p className="max-w-md text-sm text-slate-600">
          Run a prediction and save it to start building your health assessment timeline.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/prediction")}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Run a prediction
          <FiArrowRight />
        </button>
      </div>
    );
  }

  return (
    <div className="page-enter space-y-6">
      {/* Search + summary bar */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/50">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by risk level, date, or priority..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-1 focus:ring-cyan-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
          />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">{history.length}</span> saved{" "}
          {history.length === 1 ? "assessment" : "assessments"}
        </p>
      </section>

      {/* History cards */}
      <div className="space-y-4">
        {filteredHistory.map((entry) => {
          const isExpanded = expandedId === entry.id;

          return (
            <article
              key={entry.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
            >
              {/* Header row */}
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <RiskIndicator level={entry.riskLevel} score={entry.riskScore} compact />
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {entry.headline || `${entry.riskLevel} risk assessment`}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(entry.createdAt)} at {formatTime(entry.createdAt)} •
                      Confidence {entry.confidence}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    Score {entry.riskScore}/100
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/report/${entry.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                  >
                    View Report
                    <FiArrowRight />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteHistoryItem(entry.id)}
                    className="inline-flex rounded-xl border border-rose-200 bg-rose-50 p-1.5 text-rose-600 transition hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40"
                    aria-label="Delete this assessment"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {filteredHistory.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-slate-50 py-12 text-center dark:border-slate-800 dark:bg-slate-900/50">
            <FiSearch className="text-2xl text-slate-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No assessments match "<span className="font-semibold">{searchTerm}</span>"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

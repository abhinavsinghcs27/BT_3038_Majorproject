import { Link } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  FiActivity,
  FiArrowRight,
  FiBarChart2,
  FiClipboard,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import heroImage from "../assets/hero.png";
import RiskIndicator from "../component/RiskIndicator";
import StatCard from "../component/StatCard";
import { useApp } from "../context/AppContext";

const distributionColors = {
  Low: "#10b981",
  Moderate: "#f59e0b",
  High: "#f97316",
  Critical: "#f43f5e",
};

const badgeColors = {
  Critical: "bg-rose-100 text-rose-700 border-rose-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Moderate: "bg-amber-100 text-amber-700 border-amber-200",
  Low: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Protective: "bg-teal-100 text-teal-700 border-teal-200",
};

function formatShortDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });
}

function formatFullDate(value) {
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/90 p-4 shadow-xl backdrop-blur-md">
        <p className="mb-2 text-sm font-medium text-slate-500">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-3 text-sm font-semibold text-slate-900">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color || entry.payload.fill || "#0891b2" }}
            />
            {entry.name}: {entry.value}
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user, history, currentPrediction, profileCompletion, healthProfile } = useApp();

  const latestRecord = currentPrediction ?? history[0] ?? null;
  const trendData = history
    .slice(0, 6)
    .reverse()
    .map((entry) => ({
      name: formatShortDate(entry.createdAt),
      "Risk Score": entry.riskScore,
    }));

  const riskDistribution = ["Low", "Moderate", "High", "Critical"].map((label) => ({
    name: label,
    Count: history.filter((entry) => entry.riskLevel === label).length,
  }));

  // Quick Stats Logic
  const totalPredictions = history.length;
  const highRiskCount = history.filter((h) => ["High", "Critical"].includes(h.riskLevel)).length;
  const lowRiskCount = history.filter((h) => ["Low", "Moderate", "Protective"].includes(h.riskLevel)).length;

  const readinessLabel =
    profileCompletion.percentage >= 80
      ? "Ready for deep analysis"
      : "More context improves prediction";

  const nextActions = latestRecord?.recommendations?.slice(0, 3) ?? [
    "Complete the health intake form with the latest vitals.",
    "Upload a lab report or imaging summary to enrich the AI context.",
    "Run a fresh prediction to generate a care-ready result summary.",
  ];

  const biomarkerCards = [
    {
      label: "Blood pressure",
      value:
        healthProfile.systolic && healthProfile.diastolic
          ? `${healthProfile.systolic}/${healthProfile.diastolic}`
          : "Not entered",
    },
    {
      label: "Glucose",
      value: healthProfile.glucose ? `${healthProfile.glucose} md/dL` : "Not entered",
    },
    {
      label: "Sleep",
      value: healthProfile.sleepHours ? `${healthProfile.sleepHours} hrs` : "Not min",
    },
  ];

  return (
    <div className="page-enter space-y-8 pb-10">
      {/* ── 1. Header ── */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Good morning, {user?.name?.split(" ")[0]}
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Here's what's happening with your care profile today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/dashboard/health-input"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            Update Vitals
          </Link>
          <Link
            to="/dashboard/prediction"
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
          >
            <FiActivity />
            Run Analysis
          </Link>
        </div>
      </div>

      {/* ── 2. Quick Stats Row ── */}
      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Predictions"
          value={totalPredictions}
          description="Historical AI assessments saved."
          icon={FiBarChart2}
          tone="cyan"
        />
        <StatCard
          title="High Risk Alerts"
          value={highRiskCount}
          description="Assessments flagged as High or Critical risk."
          icon={FiAlertCircle}
          tone="rose"
        />
        <StatCard
          title="Healthy Insights"
          value={lowRiskCount}
          description="Assessments marked as Low or Moderate risk."
          icon={FiCheckCircle}
          tone="emerald"
        />
        <StatCard
          title="Data Readiness"
          value={`${profileCompletion.percentage}%`}
          description={readinessLabel}
          icon={FiClipboard}
          tone="amber"
        />
      </section>

      {/* ── 3. Charts Section ── */}
      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="glass-panel group rounded-[2rem] p-6 sm:p-8 border border-white/60 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 flex items-center gap-2 dark:text-white">
                <FiTrendingUp className="text-cyan-600 dark:text-cyan-400" />
                Risk Trend Timeline
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Tracking your AI risk score over your last {trendData.length || 0} assessments.
              </p>
            </div>
          </div>

          <div className="mt-8 h-[300px]">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area
                    type="monotone"
                    dataKey="Risk Score"
                    stroke="#0ea5e9"
                    fill="url(#riskGradient)"
                    strokeWidth={4}
                    activeDot={{ r: 6, strokeWidth: 0, fill: '#0284c7' }}
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                  <FiBarChart2 className="text-4xl text-slate-300 mb-3 dark:text-slate-700" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Not enough data to graph trends.</p>
                  <p className="text-xs text-slate-400 mt-1 dark:text-slate-500">Run an AI prediction to get started.</p>
               </div>
            )}
          </div>
        </article>

        <article className="glass-panel group rounded-[2rem] p-6 sm:p-8 border border-white/60 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800">
          <h3 className="text-xl font-semibold text-slate-950 flex items-center gap-2 dark:text-white">
            <FiBarChart2 className="text-teal-600 dark:text-teal-400" />
            Risk Distribution
          </h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Breakdown of your historical assessments by severity.
          </p>

          <div className="mt-8 h-[300px]">
            {riskDistribution.some((item) => item.Count > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskDistribution} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }} 
                    dy={10}
                  />
                  <YAxis 
                    allowDecimals={false} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
                  <Bar 
                    dataKey="Count" 
                    radius={[6, 6, 6, 6]} 
                    barSize={40}
                    animationDuration={1500}
                  >
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={distributionColors[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex h-full flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/50">
                  <FiTrendingDown className="text-4xl text-slate-300 mb-3 dark:text-slate-700" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No assessments catalogued.</p>
               </div>
            )}
          </div>
        </article>
      </section>

      {/* ── 4. Recent Predictions Table ── */}
      <section className="glass-panel overflow-hidden rounded-[2rem] border border-white/60 shadow-sm dark:border-slate-800">
        <div className="border-b border-slate-100 bg-white/50 px-6 py-5 sm:px-8 dark:border-slate-800/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-950 dark:text-white">Recent Intelligence Reports</h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review your past 5 AI health assessments.</p>
            </div>
            <Link
              to="/dashboard/history"
              className="hidden text-sm font-semibold text-cyan-600 hover:text-cyan-700 sm:block dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              View all history &rarr;
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-900/50 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-semibold sm:px-8">Date</th>
                <th className="px-6 py-4 font-semibold">Risk Level</th>
                <th className="px-6 py-4 font-semibold">Risk Score</th>
                <th className="px-6 py-4 font-semibold">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {history.length > 0 ? (
                history.slice(0, 5).map((entry) => (
                  <tr key={entry.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900 sm:px-8">
                      {formatFullDate(entry.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          badgeColors[entry.riskLevel] || badgeColors.Moderate
                        }`}
                      >
                        {entry.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-medium">
                        {entry.riskScore}
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-slate-100">
                          <div 
                            className="h-full bg-slate-800" 
                            style={{ width: `${Math.min(100, entry.riskScore)}%`}} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        {entry.confidence}%
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="py-12 text-center text-slate-500">
                    No predictions found. Run a prediction to see it here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 text-center sm:hidden">
            <Link
              to="/dashboard/history"
              className="text-sm font-semibold text-cyan-600 hover:text-cyan-700"
            >
              View all history &rarr;
            </Link>
        </div>
      </section>

      {/* ── 5. Biometrics & Recommendations ── */}
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="glass-panel rounded-[2rem] p-6 sm:p-8 border border-white/60 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Biometric Snapshot</h3>
              <p className="mt-1 text-sm text-slate-500">
                Core data powering your AI models.
              </p>
            </div>
            <Link
              to="/dashboard/health-input"
              className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Edit
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {biomarkerCards.map((item) => (
              <div key={item.label} className="rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.label}</p>
                <p className="mt-2 text-xl font-bold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2 rounded-[1.25rem] bg-indigo-50/50 px-5 py-4 text-sm text-indigo-900 border border-indigo-100">
            <FiActivity className="text-indigo-500" />
            <span>Lifestyle profile: <strong className="capitalize">{healthProfile.activityLevel || "Unknown"}</strong></span>
            <span className="text-indigo-300 mx-1">•</span>
            <span>Conditions: <strong>{healthProfile.conditions?.length || 0}</strong> tracked</span>
          </div>
        </article>

        <article className="glass-panel rounded-[2rem] p-6 sm:p-8 border border-white/60 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-950">AI Care Suggestions</h3>
          <p className="mt-1 text-sm text-slate-500">
            Actionable steps based on your recent activity and data.
          </p>

          <div className="mt-8 space-y-3">
            {nextActions.map((action, index) => (
              <div
                key={index}
                className="group flex gap-4 rounded-[1.25rem] border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-cyan-200 hover:shadow-md"
              >
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 text-sm font-semibold text-white shadow-inner">
                  {index + 1}
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed group-hover:text-slate-900">{action}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

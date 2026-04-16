const RISK_THEME = {
  Low: {
    badge: "bg-emerald-100 text-emerald-800",
    bar: "from-emerald-400 via-teal-400 to-cyan-400",
  },
  Moderate: {
    badge: "bg-amber-100 text-amber-800",
    bar: "from-amber-400 via-orange-400 to-yellow-400",
  },
  High: {
    badge: "bg-orange-100 text-orange-800",
    bar: "from-orange-400 via-red-400 to-rose-400",
  },
  Critical: {
    badge: "bg-rose-100 text-rose-800",
    bar: "from-rose-500 via-red-500 to-pink-500",
  },
};

export default function RiskIndicator({ level = "Low", score = 24, compact = false }) {
  const theme = RISK_THEME[level] ?? RISK_THEME.Low;

  return (
    <div className="space-y-2">
      <div
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${theme.badge}`}
      >
        <span className="status-dot inline-flex h-2.5 w-2.5 rounded-full bg-current opacity-80" />
        {level} risk
      </div>

      {!compact && (
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500">
            <span>Risk score</span>
            <span>{score}/100</span>
          </div>

          <div className="mt-2 h-2.5 rounded-full bg-slate-200">
            <div
              className={`h-2.5 rounded-full bg-gradient-to-r ${theme.bar}`}
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const toneClasses = {
  cyan: {
    icon: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
    accent: "from-cyan-400/20 via-teal-400/10 to-transparent",
  },
  teal: {
    icon: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    accent: "from-teal-400/20 via-emerald-400/10 to-transparent",
  },
  emerald: {
    icon: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    accent: "from-emerald-400/20 via-teal-400/10 to-transparent",
  },
  amber: {
    icon: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    accent: "from-amber-400/20 via-orange-400/10 to-transparent",
  },
  rose: {
    icon: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
    accent: "from-rose-400/20 via-red-400/10 to-transparent",
  },
  slate: {
    icon: "bg-slate-200 text-slate-700 dark:bg-slate-800/50 dark:text-slate-300",
    accent: "from-slate-400/15 via-slate-300/10 to-transparent",
  },
};

export default function StatCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "cyan",
}) {
  const theme = toneClasses[tone] ?? toneClasses.cyan;

  return (
    <article className="glass-panel relative overflow-hidden rounded-[1.75rem] p-5">
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent}`} />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-950 dark:text-white">{value}</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
        </div>

        {Icon ? (
          <div className={`rounded-2xl p-3 ${theme.icon}`}>
            <Icon className="text-xl" />
          </div>
        ) : null}
      </div>
    </article>
  );
}

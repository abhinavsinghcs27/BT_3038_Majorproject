import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowRight,
  FiBookmark,
  FiCheckCircle,
  FiCpu,
  FiHeart,
  FiShield,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import RiskIndicator from "../component/RiskIndicator";
import toast from "react-hot-toast";

const impactTheme = {
  High: "border-rose-200 bg-rose-50 text-rose-800",
  Elevated: "border-orange-200 bg-orange-50 text-orange-800",
  Moderate: "border-amber-200 bg-amber-50 text-amber-800",
  Protective: "border-emerald-200 bg-emerald-50 text-emerald-800",
};

/* ── Health Score logic ── */

function calculateHealthScore(riskScore, confidence) {
  // Health Score = inverse of risk, weighted by confidence
  const inverseRisk = 100 - riskScore;
  const confidenceBoost = (confidence - 70) * 0.15; // small boost for high confidence
  return Math.round(Math.min(100, Math.max(0, inverseRisk + confidenceBoost)));
}

function getScoreTheme(score) {
  if (score >= 80) {
    return {
      color: "#10b981",
      gradient: "from-emerald-400 to-teal-500",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      text: "text-emerald-700",
      label: "Excellent",
      narrative:
        "Your overall health indicators are strong. Continue maintaining your current lifestyle and preventive habits.",
    };
  }
  if (score >= 50) {
    return {
      color: "#f59e0b",
      gradient: "from-amber-400 to-orange-500",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      label: "Moderate",
      narrative:
        "There are some areas that could benefit from attention. Focus on the highlighted risk drivers to improve your score.",
    };
  }
  return {
    color: "#ef4444",
    gradient: "from-red-400 to-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
    label: "Needs attention",
    narrative:
      "Multiple health indicators need immediate attention. Work closely with your healthcare provider on the recommendations below.",
  };
}

/* ── Animated circular gauge ── */

function HealthScoreGauge({ score, theme }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    // Animate the score counting up
    let frame;
    const duration = 1200;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center">
      <svg width="180" height="180" className="-rotate-90">
        {/* Background track */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="12"
          strokeLinecap="round"
        />
        {/* Animated score arc */}
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke={theme.color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.33, 1, 0.68, 1)" }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-slate-950">{animatedScore}</span>
        <span className="text-sm text-slate-500">/ 100</span>
      </div>
    </div>
  );
}

/* ── Results page ── */

export default function Results() {
  const navigate = useNavigate();
  const { currentPrediction, saveCurrentPrediction } = useApp();

  if (!currentPrediction) {
    return (
      <div className="page-enter flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
        <div className="rounded-full bg-slate-100 p-5">
          <FiCpu className="text-3xl text-slate-400" />
        </div>
        <h2 className="text-xl font-semibold text-slate-950">No prediction available</h2>
        <p className="max-w-md text-sm text-slate-600">
          Run a prediction from the health data you've entered to see your
          AI-generated risk assessment here.
        </p>
        <button
          type="button"
          onClick={() => navigate("/dashboard/prediction")}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Go to predictions
          <FiArrowRight />
        </button>
      </div>
    );
  }

  const isSaved = Boolean(currentPrediction.savedAt);
  const healthScore = calculateHealthScore(currentPrediction.riskScore, currentPrediction.confidence);
  const scoreTheme = getScoreTheme(healthScore);

  const handleSave = () => {
    saveCurrentPrediction();
    toast.success("Saved to history");
  };

  return (
    <div className="page-enter space-y-8">
      {/* Headline card */}
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-cyan-600 dark:text-cyan-400">AI Assessment Complete</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {currentPrediction.headline}
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">{currentPrediction.summary}</p>

          <div className="mt-5">
            <RiskIndicator
              level={currentPrediction.riskLevel}
              score={currentPrediction.riskScore}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-medium">Confidence</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
              {currentPrediction.confidence}%
            </p>
          </div>
          <p className="max-w-[220px] text-center text-xs text-slate-500 lg:text-right">
            {currentPrediction.confidenceNarrative}
          </p>
        </div>
      </div>

      {/* ── Health Score Card ── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10">
          {/* Circular gauge */}
          <div className="flex-none">
            <HealthScoreGauge score={healthScore} theme={scoreTheme} />
          </div>

          {/* Score details */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <FiHeart className={`text-xl ${scoreTheme.text}`} />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Health Score</h3>
            </div>

            <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${scoreTheme.bg} ${scoreTheme.border} border ${scoreTheme.text}`}
              >
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: scoreTheme.color }} />
                {scoreTheme.label}
              </span>
            </div>

            <p className="mt-4 max-w-lg text-sm text-slate-600 dark:text-slate-400">{scoreTheme.narrative}</p>

            {/* Mini progress bar */}
            <div className="mt-6 max-w-md">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Needs attention</span>
                <span>Excellent</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-2 rounded-full bg-gradient-to-r ${scoreTheme.gradient}`}
                  style={{
                    width: `${healthScore}%`,
                    transition: "width 1.2s cubic-bezier(0.33, 1, 0.68, 1)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Care priority + review window */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-3 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <FiShield className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Care priority</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {currentPrediction.carePriority}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
              <FiAlertTriangle className="text-lg" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Recommended review</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
                {currentPrediction.reviewWindow}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk drivers */}
      {currentPrediction.drivers?.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Risk Drivers</h3>
          <p className="mt-1 text-sm text-slate-500">
            Key factors the AI model identified as influencing the assessment.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {currentPrediction.drivers.map((driver) => (
              <div
                key={driver.label}
                className={`rounded-xl border p-4 ${
                  impactTheme[driver.impact] ?? "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{driver.label}</p>
                  <span className="rounded-full bg-white/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider dark:bg-black/20">
                    {driver.impact}
                  </span>
                </div>
                <p className="mt-1 text-lg font-bold">{driver.value}</p>
                <p className="mt-2 text-xs opacity-80">{driver.reason}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {currentPrediction.recommendations?.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Care Recommendations</h3>
          <p className="mt-1 text-sm text-slate-500">
            Actionable next steps generated from the prediction analysis.
          </p>

          <div className="mt-5 space-y-3">
            {currentPrediction.recommendations.map((rec, index) => (
              <div
                key={rec}
                className="flex gap-4 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 dark:border-slate-700/50 dark:bg-slate-800/50"
              >
                <div className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                  {index + 1}
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300">{rec}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Save / navigate actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex flex-wrap items-center gap-3">
          {isSaved ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-2.5 text-sm font-medium text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400">
              <FiCheckCircle />
              Saved to history
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              <FiBookmark />
              Save to history
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/dashboard/history")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            View history
            <FiArrowRight />
          </button>
        </div>
      </section>
    </div>
  );
}





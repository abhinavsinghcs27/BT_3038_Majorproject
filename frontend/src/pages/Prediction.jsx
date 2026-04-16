import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiActivity,
  FiAlertTriangle,
  FiArrowRight,
  FiCheckCircle,
  FiCpu,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import Loader from "../component/Loader";
import toast from "react-hot-toast";

export default function Prediction() {
  const navigate = useNavigate();
  const { healthProfile, profileCompletion, runPrediction, currentPrediction } = useApp();
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const canRun = profileCompletion.isReady;

  const handleRun = () => {
    setError("");
    setIsRunning(true);

    // Small delay for the loader UX to feel intentional
    setTimeout(() => {
      try {
        runPrediction();
        toast.success("Prediction complete");
        setIsExiting(true);
        setTimeout(() => {
          navigate("/dashboard/results");
        }, 280);
      } catch (err) {
        toast.error(err.message);
        setError(err.message);
        setIsRunning(false);
      }
    }, 1500);
  };

  const readinessItems = [
    { label: "Age", filled: Boolean(healthProfile.age) },
    { label: "Gender", filled: Boolean(healthProfile.gender) },
    { label: "Weight", filled: Boolean(healthProfile.weight) },
    { label: "Height", filled: Boolean(healthProfile.height) },
    { label: "Systolic BP", filled: Boolean(healthProfile.systolic) },
    { label: "Diastolic BP", filled: Boolean(healthProfile.diastolic) },
    { label: "Heart rate", filled: Boolean(healthProfile.heartRate) },
    { label: "Glucose", filled: Boolean(healthProfile.glucose) },
    { label: "Sleep hours", filled: Boolean(healthProfile.sleepHours) },
    { label: "Activity level", filled: Boolean(healthProfile.activityLevel) },
  ];

  if (isRunning) {
    return (
      <div className={`page-enter flex min-h-[60vh] items-center justify-center ${isExiting ? "page-exit" : ""}`}>
        <Loader label="Synthesizing health data..." />
      </div>
    );
  }

  return (
    <div className={`page-enter space-y-8 ${isExiting ? "page-exit" : ""}`}>
      {/* Hero */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
          Risk Analysis Pipeline
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          The engine evaluates biometric vitals, lifestyle patterns, and clinical context to generate a comprehensive risk assessment.
        </p>
      </div>

      {/* Readiness checklist */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Data Readiness</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">All required fields must be completed to run the model.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">{profileCompletion.percentage}%</span>
          </div>
        </div>

        <div className="mb-6 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full transition-all duration-500 ${
              canRun ? "bg-cyan-500 dark:bg-cyan-400" : "bg-slate-400 dark:bg-slate-500"
            }`}
            style={{ width: `${profileCompletion.percentage}%` }}
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {readinessItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition ${
                item.filled
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-400"
                  : "border-slate-200 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              }`}
            >
              {item.filled ? (
                <FiCheckCircle className="text-emerald-600 dark:text-emerald-500" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
              )}
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* Action panel */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
        {error && (
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
            <FiAlertTriangle />
            {error}
          </div>
        )}

        {canRun ? (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-cyan-100 p-4 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
              <FiActivity className="text-3xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Ready to analyze</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                All required health data is available. Launch the prediction engine to generate your insights.
              </p>
            </div>
            <button
              type="button"
              onClick={handleRun}
              className="mt-2 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-cyan-600 dark:hover:bg-cyan-500"
            >
              Run AI prediction
              <FiArrowRight />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <div className="rounded-full bg-slate-100 p-4 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <FiAlertTriangle className="text-3xl" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Incomplete profile</h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                Please fill in the missing fields before running the AI prediction.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/dashboard/health-input")}
              className="mt-2 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
            >
              Update vitals
            </button>
          </div>
        )}
      </section>

      {/* Previous prediction info */}
      {currentPrediction && (
        <section className="rounded-[1.75rem] border border-cyan-100 bg-cyan-50 px-5 py-4 text-sm text-cyan-900">
          <p>
            <span className="font-semibold">Last prediction:</span>{" "}
            {currentPrediction.riskLevel} risk (score {currentPrediction.riskScore}/100) •{" "}
            {new Date(currentPrediction.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <p className="mt-1 text-cyan-700">
            Running a new prediction will replace the current assessment.
          </p>
        </section>
      )}
    </div>
  );
}

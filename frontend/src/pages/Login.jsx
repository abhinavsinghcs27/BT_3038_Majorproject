import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiActivity, FiArrowRight, FiShield, FiTrendingUp } from "react-icons/fi";
import heroImage from "../assets/hero.png";
import { useApp } from "../context/AppContext";

const highlights = [
  {
    title: "Predictive health scoring",
    description: "Turn vitals, reports, and lifestyle patterns into one explainable AI risk view.",
    icon: FiActivity,
  },
  {
    title: "Clinical-grade summaries",
    description: "Translate model output into clear next actions for monitoring and follow-up care.",
    icon: FiShield,
  },
  {
    title: "Trend intelligence",
    description: "Track confidence shifts and historical risk changes from a premium dashboard.",
    icon: FiTrendingUp,
  },
];

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login, user } = useApp();
  const [form, setForm] = useState({ email: "demo@healthai.com", password: "Health123!" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Note: Auto-redirect removed to allow for "Already logged in" UI reflection.
  // The user can still be navigated if they click the button in the reflected state.

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(form);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-[400px] page-enter">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-cyan-600">
            <FiActivity className="text-2xl" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pulse AI
          </h2>
        </div>

        {isAuthenticated ? (
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
              <span className="text-xl font-bold">{user?.name?.[0]}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Already logged in</h3>
            <p className="mt-2 text-sm text-slate-500">Welcome back, {user?.name || "there"}. Your workspace is ready.</p>
            
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Open Dashboard
              <FiArrowRight />
            </button>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
                <FiArrowRight />
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">New to Pulse AI?</span>{" "}
              <Link to="/signup" className="font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400">
                Create Account
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

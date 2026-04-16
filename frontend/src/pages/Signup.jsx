import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheckCircle, FiUserPlus } from "react-icons/fi";
import { useApp } from "../context/AppContext";

const platformBenefits = [
  "Protected dashboard navigation and session-aware routing",
  "Structured health intake with biometric, lifestyle, and symptom capture",
  "AI prediction, explainable results, and searchable assessment history",
];

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, signup, user } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-redirect removed to allow for session reflection UI.
  // navigate("/dashboard") can be triggered manually or via specific side effects if desired.

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="w-full max-w-[480px] page-enter">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg dark:bg-cyan-600">
            <FiUserPlus className="text-2xl" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Join Pulse AI
          </h2>
        </div>

        {isAuthenticated ? (
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 text-center shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
              <span className="text-xl font-bold">{user?.name?.[0]}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active session detected</h3>
            <p className="mt-2 text-sm text-slate-500">You are currently signed in as {user?.name || "an active user"}.</p>
            
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
            >
              Back to Dashboard
              <FiCheckCircle />
            </button>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
            <form className="grid gap-6 sm:grid-cols-2" onSubmit={handleSubmit}>
              <div className="sm:col-span-2">
                <label className="mb-2 block text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="Patient name"
                  required
                />
              </div>

              <div className="sm:col-span-2">
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
                  Age
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="34"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  required
                >
                  <option value="">Select</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                </select>
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

              <div>
                <label className="mb-2 block text-[13px] font-semibold text-slate-500 dark:text-slate-400">
                  Confirm
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-500/10 dark:border-slate-800 dark:bg-slate-950 dark:text-white"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="sm:col-span-2 rounded-xl bg-rose-50 px-4 py-3 text-xs font-medium text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 sm:col-span-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
              >
                {isSubmitting ? "Creating workspace..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 text-center text-sm">
              <span className="text-slate-500">Already with us?</span>{" "}
              <Link to="/" className="font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400">
                Sign In
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

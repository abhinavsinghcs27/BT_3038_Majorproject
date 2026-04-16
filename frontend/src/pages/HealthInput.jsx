import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCheckCircle,
  FiClipboard,
  FiHeart,
  FiSave,
  FiUploadCloud,
} from "react-icons/fi";
import { useApp } from "../context/AppContext";
import toast from "react-hot-toast";
import {
  CONDITION_OPTIONS,
  SYMPTOM_OPTIONS,
  ACTIVITY_OPTIONS,
} from "../services/mockAi";
import ReportUpload from "../component/ReportUpload";

function InputField({ label, name, type = "text", value, onChange, placeholder, unit, min, max }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:ring-cyan-900/40"
        />
        {unit && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 dark:text-slate-500">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}

function ToggleChip({ label, isActive, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-medium transition ${
        isActive
          ? "border-cyan-300 bg-cyan-50 text-cyan-800 shadow-sm dark:border-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:border-slate-600 dark:hover:bg-slate-800"
      }`}
    >
      {isActive && <FiCheckCircle className="text-cyan-600" />}
      {label}
    </button>
  );
}

function SectionHeading({ title }) {
  return (
    <div className="mb-6 border-b border-slate-100 pb-3 dark:border-slate-800">
      <h3 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h3>
    </div>
  );
}

export default function HealthInput() {
  const navigate = useNavigate();
  const { healthProfile, saveHealthProfile, profileCompletion } = useApp();
  const [form, setForm] = useState({ ...healthProfile });
  const [saved, setSaved] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const toggleArrayItem = (field, item) => {
    setForm((current) => {
      const list = current[field] ?? [];
      const next = list.includes(item)
        ? list.filter((entry) => entry !== item)
        : [...list, item];
      return { ...current, [field]: next };
    });
    setSaved(false);
  };

  const handleReportChange = (reportMeta) => {
    setForm((current) => ({ ...current, report: reportMeta }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveHealthProfile(form);
    toast.success("Health data saved");
    setIsExiting(true);
    setTimeout(() => {
      navigate("/dashboard/prediction");
    }, 280);
  };

  const handleSaveAndPredict = (event) => {
    event.preventDefault();
    saveHealthProfile(form);
    toast.success("Health data saved");
    setIsExiting(true);
    setTimeout(() => {
      navigate("/dashboard/prediction");
    }, 280);
  };

  return (
    <div className={`page-enter space-y-8 ${isExiting ? "page-exit" : ""}`}>
      {/* Success banner */}
      {saved && (
        <div className="flex items-center gap-3 rounded-[1.75rem] border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
          <FiCheckCircle className="text-xl" />
          <div>
            <p className="text-sm font-semibold">Health profile saved successfully</p>
            <p className="mt-0.5 text-sm text-emerald-700">
              Data readiness is now at {profileCompletion.percentage}%.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ── Biometrics ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <SectionHeading title="Biometric Vitals" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InputField label="Age" name="age" type="number" value={form.age} onChange={handleChange} placeholder="36" min="1" max="120" unit="yrs" />
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Gender</span>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              >
                <option value="">Select gender</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
              </select>
            </label>
            <InputField label="Weight" name="weight" type="number" value={form.weight} onChange={handleChange} placeholder="69" unit="kg" min="1" />
            <InputField label="Height" name="height" type="number" value={form.height} onChange={handleChange} placeholder="168" unit="cm" min="1" />
            <InputField label="Systolic BP" name="systolic" type="number" value={form.systolic} onChange={handleChange} placeholder="120" unit="mmHg" min="0" />
            <InputField label="Diastolic BP" name="diastolic" type="number" value={form.diastolic} onChange={handleChange} placeholder="80" unit="mmHg" min="0" />
            <InputField label="Heart rate" name="heartRate" type="number" value={form.heartRate} onChange={handleChange} placeholder="72" unit="bpm" min="0" />
            <InputField label="Blood glucose" name="glucose" type="number" value={form.glucose} onChange={handleChange} placeholder="95" unit="mg/dL" min="0" />
            <InputField label="Oxygen saturation" name="oxygen" type="number" value={form.oxygen} onChange={handleChange} placeholder="98" unit="%" min="0" max="100" />
            <InputField label="Average sleep" name="sleepHours" type="number" value={form.sleepHours} onChange={handleChange} placeholder="7.5" unit="hrs" min="0" max="24" />
          </div>
        </section>

        {/* ── Activity level ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <SectionHeading title="Lifestyle & Activity" />

          <div className="space-y-6">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Activity level</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {ACTIVITY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setForm((current) => ({ ...current, activityLevel: option.value }));
                      setSaved(false);
                    }}
                    className={`rounded-[1.5rem] border p-4 text-left transition ${
                      form.activityLevel === option.value
                        ? "border-cyan-300 bg-cyan-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <p className={`text-sm font-semibold capitalize ${form.activityLevel === option.value ? "text-cyan-800" : "text-slate-900"}`}>
                      {option.label}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Known conditions</p>
              <div className="flex flex-wrap gap-2">
                {CONDITION_OPTIONS.map((condition) => (
                  <ToggleChip
                    key={condition}
                    label={condition}
                    isActive={form.conditions?.includes(condition)}
                    onClick={() => toggleArrayItem("conditions", condition)}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Current symptoms</p>
              <div className="flex flex-wrap gap-2">
                {SYMPTOM_OPTIONS.map((symptom) => (
                  <ToggleChip
                    key={symptom}
                    label={symptom}
                    isActive={form.symptoms?.includes(symptom)}
                    onClick={() => toggleArrayItem("symptoms", symptom)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Notes & report ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <SectionHeading title="Clinical Notes & Documents" />

          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Medications</span>
              <input
                type="text"
                name="medications"
                value={form.medications}
                onChange={handleChange}
                placeholder="e.g. Amlodipine 5mg daily"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Additional notes</span>
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Any additional context for the AI model..."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </label>

            <ReportUpload currentReport={form.report} onChange={handleReportChange} />
          </div>
        </section>

        {/* ── Readiness bar + actions ── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Data readiness</span>
            <span className="font-semibold text-slate-900">{profileCompletion.percentage}%</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-slate-200">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 transition-all duration-500"
              style={{ width: `${profileCompletion.percentage}%` }}
            />
          </div>
          {profileCompletion.missingFields.length > 0 && (
            <p className="mt-3 text-xs text-slate-500">
              Missing: {profileCompletion.missingFields.join(", ")}
            </p>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <FiSave />
              Save profile
            </button>
            <button
              type="button"
              onClick={handleSaveAndPredict}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300 bg-cyan-50 px-6 py-3.5 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
            >
              Save & run prediction
            </button>
          </div>
        </section>
      </form>
    </div>
  );
}

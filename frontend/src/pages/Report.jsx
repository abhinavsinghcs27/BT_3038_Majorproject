import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiActivity, FiFileText, FiDownload, FiCheckCircle, FiAlertTriangle, FiClock } from "react-icons/fi";
import { useApp } from "../context/AppContext";
import RiskIndicator from "../component/RiskIndicator";
function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h3 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-lg font-semibold text-slate-900 dark:border-slate-800 dark:text-white">
      <Icon className="text-cyan-600 dark:text-cyan-400" />
      {title}
    </h3>
  );
}

function DataRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-50 py-3 last:border-0 dark:border-slate-800/50">
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-medium text-slate-900 dark:text-white">{value || "—"}</span>
    </div>
  );
}

export default function Report() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { history, healthProfile } = useApp();

  const prediction = history.find((entry) => entry.id === id);

  if (!prediction) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <FiAlertTriangle className="mb-4 text-4xl text-amber-500 dark:text-amber-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Report Not Found</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">The requested intelligence report could not be located.</p>
        <button
          onClick={() => navigate("/dashboard/history")}
          className="mt-6 rounded-2xl bg-cyan-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600"
        >
          Return to History
        </button>
      </div>
    );
  }

  // Use the snapshot if available, otherwise fallback to current healthProfile (mostly for backwards compatibility locally)
  const profile = prediction.profileSnapshot || healthProfile;

  return (
    <div className="page-enter space-y-8 pb-10">
      <button
        onClick={() => navigate("/dashboard/history")}
        className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-cyan-700 dark:text-slate-400 dark:hover:text-cyan-400"
      >
        <FiArrowLeft className="transition-transform group-hover:-translate-x-1" />
        Back to History
      </button>

      {/* Report Header */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
        <div className="bg-slate-950 px-8 py-8 text-white sm:px-10 lg:px-12 dark:bg-slate-900">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold">
                Clinical Intelligence Report
              </div>
              <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{prediction.headline || "Health Risk Assessment"}</h1>
              <p className="mt-3 text-sm text-slate-300">
                Generated internally by Pulse AI • {formatDate(prediction.createdAt)}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 text-center">
               <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Confidence Score</p>
               <span className="text-4xl font-bold text-cyan-400">{prediction.confidence}%</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 border-t border-slate-200 bg-white p-8 md:grid-cols-3 sm:px-10 lg:px-12 dark:border-slate-800 dark:bg-slate-900/50">
           <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
             <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Risk Level</p>
             <div className="mt-2 flex items-center gap-3">
               <RiskIndicator level={prediction.riskLevel} score={prediction.riskScore} compact />
               <span className="font-semibold text-slate-900 dark:text-white uppercase">{prediction.riskLevel}</span>
             </div>
           </div>
           <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
             <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Care Priority</p>
             <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{prediction.carePriority}</p>
           </div>
           <div className="rounded-xl bg-slate-50 p-5 dark:bg-slate-800/50">
             <p className="text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Review Window</p>
             <p className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">{prediction.reviewWindow}</p>
           </div>
        </div>
      </section>

      {/* Detailed Analysis Grid */}
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        
        {/* Left Column: Recommendations & Drivers */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <SectionTitle icon={FiCheckCircle} title="Clinical Recommendations" />
            <div className="mt-6 space-y-4">
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {prediction.summary}
              </p>
              {prediction.recommendations?.length > 0 && (
                <ul className="mt-4 space-y-3">
                  {prediction.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-cyan-50 font-bold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{rec}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {prediction.drivers?.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/50">
              <SectionTitle icon={FiActivity} title="Top Risk Drivers" />
              <div className="mt-6 space-y-4">
                {prediction.drivers.map((driver, i) => (
                  <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/50 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-slate-900 dark:text-white">{driver.label}</p>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-300">
                        {driver.value}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{driver.reason}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Patient Data */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <SectionTitle icon={FiUser} title="Patient Vitals Snapshot" />
            <div className="mt-6">
              <DataRow label="Age" value={profile.age ? `${profile.age} years` : null} />
              <DataRow label="Gender" value={profile.gender} />
              <DataRow label="Weight" value={profile.weight ? `${profile.weight} kg` : null} />
              <DataRow label="Height" value={profile.height ? `${profile.height} cm` : null} />
              <DataRow label="Blood Pressure" value={profile.systolic && profile.diastolic ? `${profile.systolic}/${profile.diastolic} mmHg` : null} />
              <DataRow label="Heart Rate" value={profile.heartRate ? `${profile.heartRate} bpm` : null} />
              <DataRow label="Glucose" value={profile.glucose ? `${profile.glucose} mg/dL` : null} />
              <DataRow label="Oxygen" value={profile.oxygen ? `${profile.oxygen}%` : null} />
              <DataRow label="Activity Level" value={profile.activityLevel} />
              <DataRow label="Avg Sleep" value={profile.sleepHours ? `${profile.sleepHours} hrs` : null} />
            </div>
            
            {(profile.conditions?.length > 0 || profile.symptoms?.length > 0) && (
              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6 dark:border-slate-800/50">
                {profile.conditions?.length > 0 && (
                  <div>
                     <p className="mb-2 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Conditions</p>
                     <div className="flex flex-wrap gap-2">
                       {profile.conditions.map(c => (
                         <span key={c} className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">{c}</span>
                       ))}
                     </div>
                  </div>
                )}
                {profile.symptoms?.length > 0 && (
                  <div>
                     <p className="mb-2 text-xs font-medium uppercase text-slate-500 dark:text-slate-400">Symptoms</p>
                     <div className="flex flex-wrap gap-2">
                       {profile.symptoms.map(s => (
                         <span key={s} className="rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">{s}</span>
                       ))}
                     </div>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 dark:border-slate-800 dark:bg-slate-900/50">
            <SectionTitle icon={FiFileText} title="Attached Documents" />
            <div className="mt-6">
              {profile.report ? (
                 <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800/50 dark:bg-slate-900/50">
                   <div className="flex items-center gap-3">
                     <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                       <FiFileText className="text-lg" />
                     </div>
                     <div>
                       <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">{profile.report.name}</p>
                       <p className="text-xs text-slate-500 dark:text-slate-400">
                         {(profile.report.size / 1024).toFixed(1)} KB
                       </p>
                     </div>
                   </div>
                   <button title="Download Mock File" className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition dark:hover:bg-slate-800 dark:hover:text-slate-300">
                     <FiDownload />
                   </button>
                 </div>
              ) : (
                 <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center dark:border-slate-800 dark:bg-slate-900/50">
                   <FiFileText className="mb-2 text-3xl text-slate-300 dark:text-slate-600" />
                   <p className="text-sm text-slate-500 dark:text-slate-400">No medical records attached</p>
                 </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

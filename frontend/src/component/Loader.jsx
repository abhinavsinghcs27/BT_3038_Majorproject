export default function Loader({ label = "Running AI assessment..." }) {
  return (
    <div className="glass-panel flex flex-col items-center justify-center gap-4 rounded-[1.75rem] px-6 py-10 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-16 w-16 animate-ping rounded-full bg-cyan-200/60" />
        <div className="relative h-12 w-12 animate-spin rounded-full border-4 border-cyan-200 border-t-cyan-700" />
      </div>
      <div>
        <p className="text-base font-semibold text-slate-900">{label}</p>
        <p className="mt-1 text-sm text-slate-500">
          Synthesizing vitals, symptoms, and report context into a unified risk profile.
        </p>
      </div>
    </div>
  );
}

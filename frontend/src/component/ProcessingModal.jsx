import { useState, useEffect } from "react";
import { FiCpu, FiCheckCircle } from "react-icons/fi";

const PROCESSING_STEPS = [
  "Encrypting patient data...",
  "Extracting vital biomarkers...",
  "Querying predictive ML models...",
  "Synthesizing historical trends...",
  "Generating clinical insights...",
];

export default function ProcessingModal({ isOpen, onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;

    setCurrentStep(0);
    setProgress(0);

    const stepDuration = 800; // ms per step
    const totalDuration = stepDuration * PROCESSING_STEPS.length;

    // Progress bar animation
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);

    // Step text animation
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < PROCESSING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    // Completion timeout
    const completeTimeout = setTimeout(() => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      onComplete();
    }, totalDuration + 500); // 500ms delay at 100%

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(completeTimeout);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md scale-100 transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800">
        <div className="flex flex-col items-center text-center">
          {/* Animated Icon */}
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/20"></div>
            <div className="absolute inset-2 animate-pulse rounded-full bg-emerald-500/30"></div>
            <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-emerald-500 text-white shadow-lg">
              {progress >= 100 ? (
                <FiCheckCircle className="h-7 w-7" />
              ) : (
                <FiCpu className="h-7 w-7 animate-[spin_3s_linear_infinite]" />
              )}
            </div>
          </div>

          <h3 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Pulse Engine Active
          </h3>
          
          <div className="mb-8 h-6">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
              {PROCESSING_STEPS[currentStep]}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right">
             <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
               {Math.floor(progress)}%
             </span>
          </div>
        </div>
      </div>
    </div>
  );
}

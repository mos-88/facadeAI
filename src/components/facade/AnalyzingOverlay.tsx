import React, { useState, useEffect } from 'react';
import { Scan, Brain, BarChart3, CheckCircle2 } from 'lucide-react';

const steps = [
  { icon: Scan, label: 'Scanning facade boundaries...', duration: 2000 },
  { icon: Brain, label: 'Detecting windows and doors...', duration: 3000 },
  { icon: BarChart3, label: 'Calculating measurements...', duration: 2000 },
  { icon: CheckCircle2, label: 'Generating report...', duration: 1000 },
];

const AnalyzingOverlay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    let elapsed = 0;
    
    steps.forEach((step, index) => {
      if (index > 0) {
        elapsed += steps[index - 1].duration;
        timers.push(setTimeout(() => setCurrentStep(index), elapsed));
      }
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 border border-slate-200 dark:border-slate-700">
        {/* Animated scanner */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 opacity-20 animate-pulse" />
          <div className="absolute inset-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 opacity-30 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <Scan className="w-10 h-10 text-blue-500 animate-spin" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-center text-slate-800 dark:text-slate-100 mb-2">
          Analyzing Facade
        </h3>
        <p className="text-sm text-center text-slate-500 mb-6">
          Our AI is processing your image...
        </p>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-500 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30'
                    : isComplete
                    ? 'bg-emerald-50 dark:bg-emerald-900/10'
                    : 'opacity-40'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : isComplete
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                }`}>
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <step.icon className={`w-3.5 h-3.5 ${isActive ? 'animate-pulse' : ''}`} />
                  )}
                </div>
                <span className={`text-sm font-medium ${
                  isActive
                    ? 'text-blue-700 dark:text-blue-300'
                    : isComplete
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-400'
                }`}>
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyzingOverlay;

import React from 'react';
import { Upload, Ruler, Brain, FileSpreadsheet, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    title: 'Upload Photo',
    description: 'Take or upload a photo of any building facade. Supports JPG, PNG, and WebP formats.',
    color: 'blue',
  },
  {
    icon: Ruler,
    title: 'Set Scale',
    description: 'Enter one known measurement (facade width or height) to calibrate real-world dimensions.',
    color: 'amber',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our AI detects and segments windows, doors, and facade boundaries with high accuracy.',
    color: 'purple',
  },
  {
    icon: FileSpreadsheet,
    title: 'Get Results',
    description: 'Receive a detailed measurement table with surface areas, counts, and net facade area.',
    color: 'emerald',
  },
];

const colorMap: Record<string, { bg: string; icon: string; border: string }> = {
  blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', icon: 'text-blue-500', border: 'border-blue-200 dark:border-blue-800/30' },
  amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', icon: 'text-amber-500', border: 'border-amber-200 dark:border-amber-800/30' },
  purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', icon: 'text-purple-500', border: 'border-purple-200 dark:border-purple-800/30' },
  emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: 'text-emerald-500', border: 'border-emerald-200 dark:border-emerald-800/30' },
};

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
            How It Works
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            From photo to measurements in four simple steps. No manual measuring, no complex software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const colors = colorMap[step.color];
            return (
              <div key={index} className="relative group">
                {/* Connector arrow (hidden on last item and mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-slate-300 dark:text-slate-600" />
                  </div>
                )}
                
                <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6 h-full transition-all group-hover:shadow-lg group-hover:scale-[1.02]`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center`}>
                      <step.icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Step {index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

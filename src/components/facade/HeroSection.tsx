import React from 'react';
import { Building2, Scan, BarChart3, Zap, ArrowDown } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium">
              <Zap className="w-4 h-4" />
              AI-Powered Facade Analysis
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Instant Facade
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Measurements
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 max-w-xl leading-relaxed">
              Upload a photo of any building facade and get precise measurements in seconds. 
              Our AI detects windows, doors, and calculates surface areas automatically — 
              saving hours of manual measurement work.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:scale-[1.02]"
              >
                <Scan className="w-5 h-5" />
                Analyze a Facade
                <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={onGetStarted}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Try Demo Images
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-4">
              {[
                { value: '<5s', label: 'Analysis Time' },
                { value: '±2%', label: 'Accuracy' },
                { value: '100+', label: 'Elements Detected' },
              ].map((stat, i) => (
                <div key={i} className="text-center sm:text-left">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right visual */}
          <div className="relative hidden lg:block">
            <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
              {/* Mock analysis preview */}
              <div className="aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/50 to-slate-800/50" />
                
                {/* Simulated building facade */}
                <svg viewBox="0 0 400 300" className="w-full h-full">
                  {/* Building body */}
                  <rect x="60" y="40" width="280" height="240" fill="#374151" stroke="#4B5563" strokeWidth="2" strokeDasharray="8 4" />
                  
                  {/* Windows Row 1 */}
                  <rect x="90" y="70" width="50" height="60" rx="2" fill="none" stroke="#3B82F6" strokeWidth="2.5" className="animate-pulse" />
                  <rect x="175" y="70" width="50" height="60" rx="2" fill="none" stroke="#3B82F6" strokeWidth="2.5" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <rect x="260" y="70" width="50" height="60" rx="2" fill="none" stroke="#3B82F6" strokeWidth="2.5" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                  
                  {/* Windows Row 2 */}
                  <rect x="90" y="155" width="50" height="60" rx="2" fill="none" stroke="#3B82F6" strokeWidth="2.5" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                  <rect x="175" y="155" width="50" height="60" rx="2" fill="none" stroke="#3B82F6" strokeWidth="2.5" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                  <rect x="260" y="155" width="50" height="60" rx="2" fill="none" stroke="#3B82F6" strokeWidth="2.5" className="animate-pulse" style={{ animationDelay: '1s' }} />
                  
                  {/* Door */}
                  <rect x="170" y="220" width="60" height="60" rx="2" fill="none" stroke="#10B981" strokeWidth="2.5" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
                  
                  {/* Labels */}
                  <text x="115" y="65" fill="#3B82F6" fontSize="9" textAnchor="middle" fontWeight="600">1.2m²</text>
                  <text x="200" y="65" fill="#3B82F6" fontSize="9" textAnchor="middle" fontWeight="600">1.2m²</text>
                  <text x="285" y="65" fill="#3B82F6" fontSize="9" textAnchor="middle" fontWeight="600">1.2m²</text>
                  <text x="200" y="215" fill="#10B981" fontSize="9" textAnchor="middle" fontWeight="600">2.1m²</text>
                  
                  {/* Facade outline */}
                  <rect x="58" y="38" width="284" height="244" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6 3" />
                  <text x="200" y="30" fill="#94A3B8" fontSize="10" textAnchor="middle">Facade: 84.2m²</text>
                </svg>
              </div>
              
              {/* Mini results bar */}
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-blue-400 font-bold text-lg">6</div>
                  <div className="text-slate-400 text-xs">Windows</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-emerald-400 font-bold text-lg">1</div>
                  <div className="text-slate-400 text-xs">Door</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-3 text-center">
                  <div className="text-cyan-400 font-bold text-lg">74.9</div>
                  <div className="text-slate-400 text-xs">Net m²</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features strip */}
      <div className="relative border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Scan, title: 'Auto Detection', desc: 'AI identifies windows, doors & facade boundaries' },
              { icon: Building2, title: 'Scale Calibration', desc: 'Enter one known measurement for accurate m²' },
              { icon: BarChart3, title: 'Instant Report', desc: 'Complete measurement table in seconds' },
              { icon: Zap, title: 'Fast & Reliable', desc: 'Process any facade photo in under 5 seconds' },
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-4 group">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <div className="font-semibold text-white text-sm">{feature.title}</div>
                  <div className="text-slate-400 text-xs mt-0.5">{feature.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

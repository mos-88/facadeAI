import React from 'react';
import { 
  Scan, Layers, BarChart3, Download, SlidersHorizontal, 
  Zap, Shield, Eye, Maximize2, RefreshCw, Palette, FileText 
} from 'lucide-react';

const features = [
  {
    icon: Scan,
    title: 'Smart Detection',
    description: 'AI-powered detection of windows, doors, and facade boundaries with high accuracy.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Layers,
    title: 'Layer Control',
    description: 'Toggle visibility of detected elements. Show/hide windows, doors, and facade outlines.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: BarChart3,
    title: 'Detailed Measurements',
    description: 'Individual and total surface areas for every detected element in square meters.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Download,
    title: 'CSV Export',
    description: 'Download complete measurement reports as CSV files for use in spreadsheets.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: SlidersHorizontal,
    title: 'Confidence Control',
    description: 'Adjust detection sensitivity to filter out uncertain detections or include more results.',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    icon: Maximize2,
    title: 'Scale Calibration',
    description: 'Enter one known measurement to accurately convert pixel distances to real-world meters.',
    gradient: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Eye,
    title: 'Visual Overlays',
    description: 'Color-coded bounding boxes overlaid on your photo with hover-to-inspect functionality.',
    gradient: 'from-sky-500 to-blue-500',
  },
  {
    icon: Zap,
    title: 'Instant Processing',
    description: 'Get results in seconds, not hours. Process any facade photo with a single click.',
    gradient: 'from-yellow-500 to-amber-500',
  },
  {
    icon: RefreshCw,
    title: 'Re-analyze',
    description: 'Adjust scale values and re-run analysis instantly without re-uploading the image.',
    gradient: 'from-teal-500 to-emerald-500',
  },
  {
    icon: Palette,
    title: 'Color-Coded Results',
    description: 'Windows in blue, doors in green, facade in gray — instantly understand your analysis.',
    gradient: 'from-fuchsia-500 to-purple-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Images are processed securely and never stored. Your construction data stays private.',
    gradient: 'from-slate-500 to-gray-500',
  },
  {
    icon: FileText,
    title: 'Net Surface Calc',
    description: 'Automatically calculates net facade area by subtracting all openings from total surface.',
    gradient: 'from-cyan-500 to-sky-500',
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            <Zap className="w-3.5 h-3.5" />
            Powerful Features
          </div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">
            Everything You Need for Facade Analysis
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Professional-grade measurement tools powered by AI, designed for construction teams.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 p-5 hover:shadow-lg hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

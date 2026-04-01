import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface ConfidenceSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const ConfidenceSlider: React.FC<ConfidenceSliderProps> = ({ value, onChange }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
          <SlidersHorizontal className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Confidence Threshold</h3>
          <p className="text-xs text-slate-500">Filter detections by confidence level</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Low</span>
          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{Math.round(value * 100)}%</span>
          <span className="text-xs text-slate-400">High</span>
        </div>
        
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(value * 100)}
          onChange={(e) => onChange(parseInt(e.target.value) / 100)}
          className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        
        <div className="flex justify-between text-xs text-slate-400">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceSlider;

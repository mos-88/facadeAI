import React from 'react';
import { Ruler, ArrowLeftRight, ArrowUpDown, Info } from 'lucide-react';
import { ScaleType } from '@/types/facade';

interface ScaleInputProps {
  scaleValue: number;
  scaleType: ScaleType;
  onScaleValueChange: (value: number) => void;
  onScaleTypeChange: (type: ScaleType) => void;
}

const ScaleInput: React.FC<ScaleInputProps> = ({
  scaleValue,
  scaleType,
  onScaleValueChange,
  onScaleTypeChange,
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <Ruler className="w-4 h-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">Scale Reference</h3>
          <p className="text-xs text-slate-500">Enter one known measurement</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Scale type toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => onScaleTypeChange('width')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              scaleType === 'width'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            Facade Width
          </button>
          <button
            onClick={() => onScaleTypeChange('height')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              scaleType === 'height'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            <ArrowUpDown className="w-4 h-4" />
            Facade Height
          </button>
        </div>

        {/* Value input */}
        <div className="relative">
          <input
            type="number"
            value={scaleValue}
            onChange={(e) => onScaleValueChange(parseFloat(e.target.value) || 0)}
            min={0.1}
            step={0.1}
            className="w-full px-4 py-3 pr-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="12.0"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-sm font-medium text-slate-600 dark:text-slate-300">
            meters
          </div>
        </div>

        {/* Info tip */}
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
          <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
            Measure the total {scaleType === 'width' ? 'width' : 'height'} of the visible facade in the photo. 
            This reference is used to calculate all other measurements proportionally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScaleInput;

import React, { useRef, useEffect, useState } from 'react';
import { Eye, EyeOff, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { AnalysisResult, DetectedElement } from '@/types/facade';

interface AnalysisCanvasProps {
  image: string;
  result: AnalysisResult;
  imageWidth: number;
  imageHeight: number;
  showWindows: boolean;
  showDoors: boolean;
  showFacade: boolean;
  confidenceThreshold: number;
  onToggleWindows: () => void;
  onToggleDoors: () => void;
  onToggleFacade: () => void;
  onHoverElement: (element: DetectedElement | null) => void;
}

const AnalysisCanvas: React.FC<AnalysisCanvasProps> = ({
  image,
  result,
  imageWidth,
  imageHeight,
  showWindows,
  showDoors,
  showFacade,
  confidenceThreshold,
  onToggleWindows,
  onToggleDoors,
  onToggleFacade,
  onHoverElement,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const aspectRatio = imageHeight / imageWidth;
        let displayWidth = containerWidth;
        let displayHeight = containerWidth * aspectRatio;
        
        // If height exceeds max, scale down width proportionally
        const maxH = 600;
        if (displayHeight > maxH) {
          displayHeight = maxH;
          displayWidth = maxH / aspectRatio;
        }
        
        setDisplaySize({ width: displayWidth, height: displayHeight });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [imageWidth, imageHeight]);


  const scaleX = displaySize.width / imageWidth;
  const scaleY = displaySize.height / imageHeight;
  const scale = Math.min(scaleX, scaleY);

  const renderBox = (
    bbox: number[],
    color: string,
    label: string,
    confidence: number,
    element?: DetectedElement
  ) => {
    if (confidence < confidenceThreshold) return null;
    
    const x = bbox[0] * scale * zoom;
    const y = bbox[1] * scale * zoom;
    const w = (bbox[2] - bbox[0]) * scale * zoom;
    const h = (bbox[3] - bbox[1]) * scale * zoom;

    return (
      <div
        key={label}
        className="absolute transition-all duration-200 cursor-pointer group/box"
        style={{
          left: x,
          top: y,
          width: w,
          height: h,
          border: `2px solid ${color}`,
          backgroundColor: `${color}15`,
        }}
        onMouseEnter={() => element && onHoverElement(element)}
        onMouseLeave={() => onHoverElement(null)}
      >
        {/* Label */}
        <div
          className="absolute -top-6 left-0 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap opacity-80 group-hover/box:opacity-100 transition-opacity"
          style={{ backgroundColor: color, color: 'white' }}
        >
          {label} ({Math.round(confidence * 100)}%)
        </div>
        
        {/* Area label */}
        {element && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/box:opacity-100 transition-opacity">
            <span
              className="px-2 py-1 rounded text-xs font-bold"
              style={{ backgroundColor: `${color}dd`, color: 'white' }}
            >
              {element.measurements.area}m²
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Layer controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Detection Layers</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
          <span className="text-xs text-slate-500 font-medium min-w-[40px] text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(z => Math.min(2, z + 0.25))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
          </button>
        </div>
      </div>

      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={onToggleFacade}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showFacade
              ? 'bg-slate-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          {showFacade ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          Facade
        </button>
        <button
          onClick={onToggleWindows}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showWindows
              ? 'bg-blue-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          {showWindows ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          Windows ({result.windows.filter(w => w.confidence >= confidenceThreshold).length})
        </button>
        <button
          onClick={onToggleDoors}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            showDoors
              ? 'bg-emerald-500 text-white'
              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
          }`}
        >
          {showDoors ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          Doors ({result.doors.filter(d => d.confidence >= confidenceThreshold).length})
        </button>
      </div>

      {/* Canvas area */}
      <div
        ref={containerRef}
        className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-900"
        style={{ maxHeight: 600 }}
      >
        <div className="relative overflow-auto" style={{ maxHeight: 600 }}>
          <div className="relative inline-block" style={{ 
            width: displaySize.width * zoom, 
            height: displaySize.height * zoom 
          }}>
            <img
              src={image}
              alt="Analyzed facade"
              className="w-full h-full object-contain"
              style={{ 
                width: displaySize.width * zoom, 
                height: displaySize.height * zoom 
              }}
            />
            
            {/* Overlay boxes */}
            {showFacade && result.facade && renderBox(
              result.facade.bbox,
              '#94A3B8',
              'Facade',
              result.facade.confidence
            )}
            
            {showWindows && result.windows.map((w) => renderBox(
              w.bbox,
              '#3B82F6',
              w.label,
              w.confidence,
              w
            ))}
            
            {showDoors && result.doors.map((d) => renderBox(
              d.bbox,
              '#10B981',
              d.label,
              d.confidence,
              d
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisCanvas;

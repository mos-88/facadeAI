import React, { useState } from 'react';
import { BarChart3, Building2, LayoutGrid, DoorOpen, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { AnalysisResult, DetectedElement } from '@/types/facade';

interface ResultsTableProps {
  result: AnalysisResult;
  confidenceThreshold: number;
  hoveredElement: DetectedElement | null;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ result, confidenceThreshold, hoveredElement }) => {
  const [showWindowDetails, setShowWindowDetails] = useState(true);
  const [showDoorDetails, setShowDoorDetails] = useState(true);

  const filteredWindows = result.windows.filter(w => w.confidence >= confidenceThreshold);
  const filteredDoors = result.doors.filter(d => d.confidence >= confidenceThreshold);
  
  const totalWindowArea = filteredWindows.reduce((sum, w) => sum + w.measurements.area, 0);
  const totalDoorArea = filteredDoors.reduce((sum, d) => sum + d.measurements.area, 0);
  const netArea = Math.round((result.summary.totalFacadeArea - totalWindowArea - totalDoorArea) * 100) / 100;

  const handleExportCSV = () => {
    let csv = 'Element,Width (m),Height (m),Area (m²),Confidence\n';
    csv += `Facade,${result.facade.measurements.width},${result.facade.measurements.height},${result.facade.measurements.area},${Math.round(result.facade.confidence * 100)}%\n`;
    filteredWindows.forEach(w => {
      csv += `${w.label},${w.measurements.width},${w.measurements.height},${w.measurements.area},${Math.round(w.confidence * 100)}%\n`;
    });
    filteredDoors.forEach(d => {
      csv += `${d.label},${d.measurements.width},${d.measurements.height},${d.measurements.area},${Math.round(d.confidence * 100)}%\n`;
    });
    csv += `\nSummary\n`;
    csv += `Total Facade Area,,,"${result.summary.totalFacadeArea}"\n`;
    csv += `Total Window Area,,,"${Math.round(totalWindowArea * 100) / 100}"\n`;
    csv += `Total Door Area,,,"${Math.round(totalDoorArea * 100) / 100}"\n`;
    csv += `Net Facade Area,,,"${netArea}"\n`;

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facade-analysis-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-800/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Facade</span>
          </div>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-100">{result.summary.totalFacadeArea}<span className="text-sm font-normal text-slate-400 ml-1">m²</span></div>
          <div className="text-xs text-slate-400 mt-1">{result.summary.facadeWidth}m × {result.summary.facadeHeight}m</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 rounded-xl p-4 border border-blue-200 dark:border-blue-800/30">
          <div className="flex items-center gap-2 mb-2">
            <LayoutGrid className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium text-blue-500 uppercase tracking-wider">Windows</span>
          </div>
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{filteredWindows.length}</div>
          <div className="text-xs text-blue-400 mt-1">{Math.round(totalWindowArea * 100) / 100} m² total</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800/30">
          <div className="flex items-center gap-2 mb-2">
            <DoorOpen className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-500 uppercase tracking-wider">Doors</span>
          </div>
          <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{filteredDoors.length}</div>
          <div className="text-xs text-emerald-400 mt-1">{Math.round(totalDoorArea * 100) / 100} m² total</div>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-900/10 rounded-xl p-4 border border-cyan-200 dark:border-cyan-800/30">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-medium text-cyan-500 uppercase tracking-wider">Net Surface</span>
          </div>
          <div className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{netArea}<span className="text-sm font-normal text-cyan-400 ml-1">m²</span></div>
          <div className="text-xs text-cyan-400 mt-1">{Math.round((netArea / result.summary.totalFacadeArea) * 100)}% of facade</div>
        </div>
      </div>

      {/* Area breakdown bar */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
        <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Area Breakdown</div>
        <div className="h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700">
          <div
            className="bg-cyan-500 transition-all duration-500"
            style={{ width: `${(netArea / result.summary.totalFacadeArea) * 100}%` }}
            title={`Net facade: ${netArea}m²`}
          />
          <div
            className="bg-blue-500 transition-all duration-500"
            style={{ width: `${(totalWindowArea / result.summary.totalFacadeArea) * 100}%` }}
            title={`Windows: ${Math.round(totalWindowArea * 100) / 100}m²`}
          />
          <div
            className="bg-emerald-500 transition-all duration-500"
            style={{ width: `${(totalDoorArea / result.summary.totalFacadeArea) * 100}%` }}
            title={`Doors: ${Math.round(totalDoorArea * 100) / 100}m²`}
          />
        </div>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Net ({Math.round((netArea / result.summary.totalFacadeArea) * 100)}%)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Windows ({Math.round((totalWindowArea / result.summary.totalFacadeArea) * 100)}%)</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Doors ({Math.round((totalDoorArea / result.summary.totalFacadeArea) * 100)}%)</span>
        </div>
      </div>

      {/* Detailed Windows Table */}
      {filteredWindows.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowWindowDetails(!showWindowDetails)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Window Details</span>
              <span className="text-xs text-slate-400">({filteredWindows.length} detected)</span>
            </div>
            {showWindowDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {showWindowDetails && (
            <div className="border-t border-slate-100 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Element</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Width</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Height</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Area</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWindows.map((w) => (
                    <tr
                      key={w.id}
                      className={`border-t border-slate-50 dark:border-slate-700/50 transition-colors ${
                        hoveredElement?.id === w.id && hoveredElement?.label === w.label
                          ? 'bg-blue-50 dark:bg-blue-900/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          {w.label}
                        </span>
                      </td>
                      <td className="text-right px-4 py-2.5 text-slate-600 dark:text-slate-300">{w.measurements.width}m</td>
                      <td className="text-right px-4 py-2.5 text-slate-600 dark:text-slate-300">{w.measurements.height}m</td>
                      <td className="text-right px-4 py-2.5 font-semibold text-blue-600 dark:text-blue-400">{w.measurements.area}m²</td>
                      <td className="text-right px-4 py-2.5 text-slate-400">{Math.round(w.confidence * 100)}%</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                    <td className="px-4 py-2.5 font-bold text-blue-700 dark:text-blue-300">Total Windows</td>
                    <td className="text-right px-4 py-2.5" />
                    <td className="text-right px-4 py-2.5" />
                    <td className="text-right px-4 py-2.5 font-bold text-blue-700 dark:text-blue-300">{Math.round(totalWindowArea * 100) / 100}m²</td>
                    <td className="text-right px-4 py-2.5" />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Detailed Doors Table */}
      {filteredDoors.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <button
            onClick={() => setShowDoorDetails(!showDoorDetails)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <DoorOpen className="w-4 h-4 text-emerald-500" />
              <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">Door Details</span>
              <span className="text-xs text-slate-400">({filteredDoors.length} detected)</span>
            </div>
            {showDoorDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          
          {showDoorDetails && (
            <div className="border-t border-slate-100 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50">
                    <th className="text-left px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Element</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Width</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Height</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Area</th>
                    <th className="text-right px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Conf.</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoors.map((d) => (
                    <tr
                      key={d.id}
                      className={`border-t border-slate-50 dark:border-slate-700/50 transition-colors ${
                        hoveredElement?.id === d.id && hoveredElement?.label === d.label
                          ? 'bg-emerald-50 dark:bg-emerald-900/20'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'
                      }`}
                    >
                      <td className="px-4 py-2.5 font-medium text-slate-700 dark:text-slate-200">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          {d.label}
                        </span>
                      </td>
                      <td className="text-right px-4 py-2.5 text-slate-600 dark:text-slate-300">{d.measurements.width}m</td>
                      <td className="text-right px-4 py-2.5 text-slate-600 dark:text-slate-300">{d.measurements.height}m</td>
                      <td className="text-right px-4 py-2.5 font-semibold text-emerald-600 dark:text-emerald-400">{d.measurements.area}m²</td>
                      <td className="text-right px-4 py-2.5 text-slate-400">{Math.round(d.confidence * 100)}%</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
                    <td className="px-4 py-2.5 font-bold text-emerald-700 dark:text-emerald-300">Total Doors</td>
                    <td className="text-right px-4 py-2.5" />
                    <td className="text-right px-4 py-2.5" />
                    <td className="text-right px-4 py-2.5 font-bold text-emerald-700 dark:text-emerald-300">{Math.round(totalDoorArea * 100) / 100}m²</td>
                    <td className="text-right px-4 py-2.5" />
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Export button */}
      <button
        onClick={handleExportCSV}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors"
      >
        <Download className="w-4 h-4" />
        Export Measurements as CSV
      </button>
    </div>
  );
};

export default ResultsTable;

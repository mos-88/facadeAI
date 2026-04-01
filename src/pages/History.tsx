import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { AnalysisResult } from '@/types/facade';
import {
  Building2, Scan, Trash2, Pencil, Check, X, Clock, LayoutGrid,
  DoorOpen, BarChart3, ArrowLeft, Columns2, ChevronDown, ChevronUp,
  Search, SortAsc, SortDesc, Menu
} from 'lucide-react';

interface SavedAnalysis {
  id: string;
  name: string;
  thumbnail: string | null;
  image_url: string | null;
  image_width: number;
  image_height: number;
  scale_value: number;
  scale_type: string;
  result: AnalysisResult;
  summary: any;
  created_at: string;
  updated_at: string;
}

const History: React.FC = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDesc, setSortDesc] = useState(true);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchAnalyses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('facade_analyses')
      .select('*')
      .order('created_at', { ascending: !sortDesc });
    if (!error && data) setAnalyses(data as SavedAnalysis[]);
    setLoading(false);
  }, [sortDesc]);

  useEffect(() => { fetchAnalyses(); }, [fetchAnalyses]);

  const handleDelete = async (id: string) => {
    await supabase.from('facade_analyses').delete().eq('id', id);
    setAnalyses(prev => prev.filter(a => a.id !== id));
    setCompareIds(prev => prev.filter(cid => cid !== id));
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    await supabase.from('facade_analyses').update({ name: editName.trim(), updated_at: new Date().toISOString() }).eq('id', id);
    setAnalyses(prev => prev.map(a => a.id === id ? { ...a, name: editName.trim() } : a));
    setEditingId(null);
  };

  const handleReopen = (analysis: SavedAnalysis) => {
    // Store in sessionStorage so AppLayout can pick it up
    sessionStorage.setItem('reopenAnalysis', JSON.stringify(analysis));
    navigate('/');
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const filtered = analyses.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const compareItems = analyses.filter(a => compareIds.includes(a.id));

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-white">FacadeAI</span>
              <span className="hidden sm:inline-block ml-1 px-2 py-0.5 text-[10px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full uppercase tracking-wider">Demo</span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button onClick={() => navigate('/')} className="text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Back to Analyzer
              </button>
              <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all">
                <Scan className="w-4 h-4" /> New Analysis
              </button>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button onClick={() => navigate('/')} className="w-full text-left px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Analyzer</button>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-500" /> Analysis History
            </h1>
            <p className="text-slate-500 mt-1">{analyses.length} saved {analyses.length === 1 ? 'analysis' : 'analyses'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { setCompareMode(!compareMode); setCompareIds([]); }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${compareMode ? 'bg-purple-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              <Columns2 className="w-4 h-4" /> {compareMode ? 'Exit Compare' : 'Compare'}
            </button>
          </div>
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search analyses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200" />
          </div>
          <button onClick={() => setSortDesc(!sortDesc)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            {sortDesc ? <SortDesc className="w-4 h-4" /> : <SortAsc className="w-4 h-4" />}
            {sortDesc ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Compare View */}
        {compareMode && compareIds.length === 2 && (
          <div className="mb-8 bg-white dark:bg-slate-800 rounded-2xl border border-purple-200 dark:border-purple-800/30 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <Columns2 className="w-5 h-5 text-purple-500" /> Side-by-Side Comparison
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {compareItems.map(item => (
                <div key={item.id} className="space-y-3">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-200 truncate">{item.name}</h4>
                  {item.thumbnail && <img src={item.thumbnail} alt={item.name} className="w-full h-48 object-cover rounded-xl border border-slate-200 dark:border-slate-700" />}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                      <div className="text-xs text-slate-400 uppercase tracking-wider">Facade</div>
                      <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{item.summary?.totalFacadeArea ?? '-'}m²</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="text-xs text-blue-500 uppercase tracking-wider">Windows</div>
                      <div className="text-lg font-bold text-blue-700 dark:text-blue-300">{item.summary?.windowCount ?? 0} ({item.summary?.totalWindowArea ?? 0}m²)</div>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                      <div className="text-xs text-emerald-500 uppercase tracking-wider">Doors</div>
                      <div className="text-lg font-bold text-emerald-700 dark:text-emerald-300">{item.summary?.doorCount ?? 0} ({item.summary?.totalDoorArea ?? 0}m²)</div>
                    </div>
                    <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3">
                      <div className="text-xs text-cyan-500 uppercase tracking-wider">Net Surface</div>
                      <div className="text-lg font-bold text-cyan-700 dark:text-cyan-300">{item.summary?.netFacadeArea ?? '-'}m²</div>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">{formatDate(item.created_at)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {compareMode && compareIds.length < 2 && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800/30 rounded-xl text-sm text-purple-700 dark:text-purple-300">
            Select {2 - compareIds.length} more {compareIds.length === 1 ? 'analysis' : 'analyses'} to compare side-by-side.
          </div>
        )}

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Scan className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-600 dark:text-slate-300 mb-1">{searchQuery ? 'No matching analyses' : 'No analyses yet'}</h3>
            <p className="text-sm text-slate-400 mb-4">{searchQuery ? 'Try a different search term' : 'Run your first facade analysis to see it here'}</p>
            {!searchQuery && <button onClick={() => navigate('/')} className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl">Start Analyzing</button>}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => {
              const isExpanded = expandedId === item.id;
              const isCompareSelected = compareIds.includes(item.id);
              return (
                <div key={item.id} className={`bg-white dark:bg-slate-800 rounded-xl border transition-all ${isCompareSelected ? 'border-purple-400 dark:border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800/30' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}>
                  <div className="flex items-center gap-4 p-4">
                    {/* Compare checkbox */}
                    {compareMode && (
                      <button onClick={() => toggleCompare(item.id)}
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${isCompareSelected ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                        {isCompareSelected && <Check className="w-4 h-4" />}
                      </button>
                    )}

                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Building2 className="w-6 h-6 text-slate-400" /></div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input type="text" value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRename(item.id)}
                            className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-blue-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-slate-200" autoFocus />
                          <button onClick={() => handleRename(item.id)} className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</h3>
                      )}
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span>{formatDate(item.created_at)}</span>
                        <span className="flex items-center gap-1"><LayoutGrid className="w-3 h-3 text-blue-400" />{item.summary?.windowCount ?? 0} win</span>
                        <span className="flex items-center gap-1"><DoorOpen className="w-3 h-3 text-emerald-400" />{item.summary?.doorCount ?? 0} doors</span>
                        <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 text-cyan-400" />{item.summary?.netFacadeArea ?? '-'}m²</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button onClick={() => handleReopen(item)} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">Open</button>
                      <button onClick={() => { setEditingId(item.id); setEditName(item.name); }} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <button onClick={() => setExpandedId(isExpanded ? null : item.id)} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                        <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3"><div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Facade</div><div className="text-xl font-bold text-slate-800 dark:text-slate-100">{item.summary?.totalFacadeArea ?? '-'}<span className="text-sm font-normal text-slate-400 ml-1">m²</span></div></div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3"><div className="text-xs text-blue-500 uppercase tracking-wider mb-1">Windows</div><div className="text-xl font-bold text-blue-700 dark:text-blue-300">{item.summary?.windowCount ?? 0}<span className="text-sm font-normal text-blue-400 ml-1">({item.summary?.totalWindowArea ?? 0}m²)</span></div></div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3"><div className="text-xs text-emerald-500 uppercase tracking-wider mb-1">Doors</div><div className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{item.summary?.doorCount ?? 0}<span className="text-sm font-normal text-emerald-400 ml-1">({item.summary?.totalDoorArea ?? 0}m²)</span></div></div>
                        <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-3"><div className="text-xs text-cyan-500 uppercase tracking-wider mb-1">Net Surface</div><div className="text-xl font-bold text-cyan-700 dark:text-cyan-300">{item.summary?.netFacadeArea ?? '-'}<span className="text-sm font-normal text-cyan-400 ml-1">m²</span></div></div>
                      </div>
                      {item.thumbnail && <img src={item.thumbnail} alt={item.name} className="w-full max-h-64 object-contain rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-900" />}
                      <div className="mt-3 text-xs text-slate-400">Scale: {item.scale_value}m ({item.scale_type}) &middot; Image: {item.image_width}&times;{item.image_height}px</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

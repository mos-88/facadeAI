import React, { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AnalysisResult, ScaleType, DetectedElement } from '@/types/facade';
import { resizeImage } from '@/utils/imageUtils';
import Navbar from '@/components/facade/Navbar';
import HeroSection from '@/components/facade/HeroSection';
import UploadZone from '@/components/facade/UploadZone';
import ScaleInput from '@/components/facade/ScaleInput';
import ConfidenceSlider from '@/components/facade/ConfidenceSlider';
import AnalysisCanvas from '@/components/facade/AnalysisCanvas';
import ResultsTable from '@/components/facade/ResultsTable';
import SampleGallery from '@/components/facade/SampleGallery';
import AnalyzingOverlay from '@/components/facade/AnalyzingOverlay';
import HowItWorks from '@/components/facade/HowItWorks';
import FeaturesSection from '@/components/facade/FeaturesSection';
import Footer from '@/components/facade/Footer';
import { Scan, AlertCircle, ArrowLeft, RotateCcw, Building2, Save } from 'lucide-react';

const AppLayout: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [scaleValue, setScaleValue] = useState(12);
  const [scaleType, setScaleType] = useState<ScaleType>('width');
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showWindows, setShowWindows] = useState(true);
  const [showDoors, setShowDoors] = useState(true);
  const [showFacade, setShowFacade] = useState(true);
  const [hoveredElement, setHoveredElement] = useState<DetectedElement | null>(null);
  const [saved, setSaved] = useState(false);

  const analyzeRef = useRef<HTMLDivElement>(null);

  // Check for reopened analysis from History page
  useEffect(() => {
    const stored = sessionStorage.getItem('reopenAnalysis');
    if (stored) {
      try {
        const analysis = JSON.parse(stored);
        if (analysis.thumbnail) setImage(analysis.thumbnail);
        else if (analysis.image_url) setImage(analysis.image_url);
        setImageWidth(analysis.image_width || 800);
        setImageHeight(analysis.image_height || 600);
        setScaleValue(analysis.scale_value || 12);
        setScaleType(analysis.scale_type || 'width');
        if (analysis.result) setResult(analysis.result);
        setSaved(true);
        sessionStorage.removeItem('reopenAnalysis');
        setTimeout(() => analyzeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
      } catch { /* ignore */ }
    }
  }, []);

  const scrollToAnalyze = useCallback(() => {
    analyzeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleImageUpload = useCallback((dataUrl: string, _file: File, width: number, height: number) => {
    setImage(dataUrl);
    setImageWidth(width);
    setImageHeight(height);
    setResult(null);
    setError(null);
    setSaved(false);
  }, []);

  const handleClearImage = useCallback(() => {
    setImage(null);
    setImageWidth(0);
    setImageHeight(0);
    setResult(null);
    setError(null);
    setSaved(false);
  }, []);

  const handleSelectSample = useCallback(async (url: string, sampleScale: number, sampleScaleType: 'width' | 'height') => {
    setError(null);
    setResult(null);
    setSaved(false);
    setScaleValue(sampleScale);
    setScaleType(sampleScaleType);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new window.Image();
        img.onload = () => { setImage(dataUrl); setImageWidth(img.naturalWidth); setImageHeight(img.naturalHeight); };
        img.onerror = () => { setImage(url); setImageWidth(800); setImageHeight(600); };
        img.src = dataUrl;
      };
      reader.readAsDataURL(blob);
    } catch {
      setImage(url);
      setImageWidth(800);
      setImageHeight(600);
    }
    scrollToAnalyze();
  }, [scrollToAnalyze]);

  const handleAnalyze = useCallback(async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      let imageBase64 = image;
      let sendWidth = imageWidth;
      let sendHeight = imageHeight;
      if (!image.startsWith('data:')) {
        try {
          const response = await fetch(image);
          const blob = await response.blob();
          imageBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.readAsDataURL(blob);
          });
        } catch {
          throw new Error('Failed to process image. Please try uploading the image directly.');
        }
      }
      try {
        const resized = await resizeImage(imageBase64, 1200, 1200, 0.85);
        imageBase64 = resized.dataUrl;
        sendWidth = resized.width;
        sendHeight = resized.height;
      } catch { console.warn('Image resize failed, using original'); }

      const { data, error: fnError } = await supabase.functions.invoke('analyze-facade', {
        body: { imageBase64, scaleValue, scaleType, imageWidth: sendWidth, imageHeight: sendHeight },
      });
      if (fnError) throw new Error(fnError.message || 'Analysis failed');
      if (data?.error) throw new Error(data.error);

      const scaleBackX = imageWidth / sendWidth;
      const scaleBackY = imageHeight / sendHeight;
      const scaleBackBbox = (bbox: number[]) => [bbox[0] * scaleBackX, bbox[1] * scaleBackY, bbox[2] * scaleBackX, bbox[3] * scaleBackY];
      const scaledResult: AnalysisResult = {
        ...data,
        facade: { ...data.facade, bbox: scaleBackBbox(data.facade.bbox) },
        windows: data.windows.map((w: any) => ({ ...w, bbox: scaleBackBbox(w.bbox) })),
        doors: data.doors.map((d: any) => ({ ...d, bbox: scaleBackBbox(d.bbox) })),
      };
      setResult(scaledResult);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsAnalyzing(false);
    }
  }, [image, scaleValue, scaleType, imageWidth, imageHeight]);

  const handleSaveToHistory = useCallback(async () => {
    if (!result || !image) return;
    // Create a small thumbnail
    let thumbnail = image;
    try {
      const resized = await resizeImage(image, 400, 400, 0.6);
      thumbnail = resized.dataUrl;
    } catch { /* use original */ }

    const { error: dbError } = await supabase.from('facade_analyses').insert({
      name: `Facade Analysis - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
      thumbnail,
      image_url: null,
      image_width: imageWidth,
      image_height: imageHeight,
      scale_value: scaleValue,
      scale_type: scaleType,
      result,
      summary: result.summary,
    });
    if (!dbError) setSaved(true);
  }, [result, image, imageWidth, imageHeight, scaleValue, scaleType]);

  const handleReanalyze = useCallback(() => { setResult(null); setError(null); setSaved(false); }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar onAnalyzeClick={scrollToAnalyze} />
      <HeroSection onGetStarted={scrollToAnalyze} />
      <HowItWorks />

      <section ref={analyzeRef} id="analyze" className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
              <Scan className="w-3.5 h-3.5" /> Analysis Tool
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-3">Analyze Your Facade</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Upload a photo, set the scale reference, and let our AI do the rest.</p>
          </div>

          {!result ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <UploadZone image={image} onImageUpload={handleImageUpload} onClear={handleClearImage} />
                <div id="samples"><SampleGallery onSelectSample={handleSelectSample} /></div>
              </div>
              <div className="space-y-4">
                <ScaleInput scaleValue={scaleValue} scaleType={scaleType} onScaleValueChange={setScaleValue} onScaleTypeChange={setScaleType} />
                <ConfidenceSlider value={confidenceThreshold} onChange={setConfidenceThreshold} />
                <button onClick={handleAnalyze} disabled={!image || isAnalyzing || scaleValue <= 0}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl text-white font-semibold text-lg transition-all duration-300 ${!image || isAnalyzing || scaleValue <= 0 ? 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.02]'}`}>
                  <Scan className="w-5 h-5" /> {isAnalyzing ? 'Analyzing...' : 'Analyze Facade'}
                </button>
                {!image && <p className="text-center text-xs text-slate-400">Upload a photo or select a sample to begin</p>}
                {error && (
                  <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">Analysis Failed</p>
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>
                      <button onClick={() => setError(null)} className="text-xs text-red-600 dark:text-red-400 underline mt-2 hover:no-underline">Dismiss</button>
                    </div>
                  </div>
                )}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700">
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2 flex items-center gap-2"><Building2 className="w-4 h-4 text-slate-400" /> Tips for Best Results</h4>
                  <ul className="space-y-1.5 text-xs text-slate-500">
                    <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />Take photos straight-on, perpendicular to the facade</li>
                    <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />Ensure the entire facade is visible in the frame</li>
                    <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />Good lighting improves detection accuracy</li>
                    <li className="flex items-start gap-2"><span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />Measure the facade width/height accurately for best results</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <button onClick={handleReanalyze} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back to Upload
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={handleSaveToHistory} disabled={saved}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${saved ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 cursor-default' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20'}`}>
                    <Save className="w-4 h-4" /> {saved ? 'Saved to History' : 'Save to History'}
                  </button>
                  <button onClick={handleAnalyze} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors">
                    <RotateCcw className="w-4 h-4" /> Re-analyze
                  </button>
                </div>
              </div>
              <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><Scan className="w-4 h-4 text-blue-500" /> Detection Overlay</h3>
                    <AnalysisCanvas image={image!} result={result} imageWidth={imageWidth} imageHeight={imageHeight} showWindows={showWindows} showDoors={showDoors} showFacade={showFacade} confidenceThreshold={confidenceThreshold} onToggleWindows={() => setShowWindows(!showWindows)} onToggleDoors={() => setShowDoors(!showDoors)} onToggleFacade={() => setShowFacade(!showFacade)} onHoverElement={setHoveredElement} />
                  </div>
                  <div className="mt-4"><ConfidenceSlider value={confidenceThreshold} onChange={setConfidenceThreshold} /></div>
                </div>
                <div className="lg:col-span-2">
                  <ResultsTable result={result} confidenceThreshold={confidenceThreshold} hoveredElement={hoveredElement} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <FeaturesSection />
      <Footer />
      {isAnalyzing && <AnalyzingOverlay />}
    </div>
  );
};

export default AppLayout;

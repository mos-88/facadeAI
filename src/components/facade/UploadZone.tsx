import React, { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, X, Camera } from 'lucide-react';

interface UploadZoneProps {
  image: string | null;
  onImageUpload: (dataUrl: string, file: File, width: number, height: number) => void;
  onClear: () => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ image, onImageUpload, onClear }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new window.Image();
      img.onload = () => {
        onImageUpload(dataUrl, file, img.naturalWidth, img.naturalHeight);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  if (image) {
    return (
      <div className="relative group">
        <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
          <img
            src={image}
            alt="Uploaded facade"
            className="w-full max-h-[400px] object-contain"
          />
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <ImageIcon className="w-4 h-4" />
          <span>Image loaded successfully. Configure scale and click Analyze.</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => fileInputRef.current?.click()}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.01]' 
          : 'border-slate-300 dark:border-slate-600 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
      `}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
          ${isDragging 
            ? 'bg-blue-100 dark:bg-blue-900/40' 
            : 'bg-slate-100 dark:bg-slate-800'
          }
        `}>
          {isDragging ? (
            <Camera className="w-8 h-8 text-blue-500 animate-bounce" />
          ) : (
            <Upload className="w-8 h-8 text-slate-400" />
          )}
        </div>
        
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-1">
          {isDragging ? 'Drop your image here' : 'Upload Facade Photo'}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-sm">
          Drag & drop a building facade photo, or click to browse. 
          Supports JPG, PNG, WebP up to 10MB.
        </p>
        
        <div className="mt-6 flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors">
            Choose File
          </div>
          <span className="text-xs text-slate-400">or drag & drop</span>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;

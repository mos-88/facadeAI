import React from 'react';
import { Building, Building2, Home, Hotel, Landmark, Store } from 'lucide-react';

interface SampleImage {
  id: string;
  title: string;
  description: string;
  url: string;
  scaleValue: number;
  scaleType: 'width' | 'height';
  icon: React.ElementType;
  category: string;
}

const sampleImages: SampleImage[] = [
  {
    id: 'residential-1',
    title: 'Residential House',
    description: 'Two-story suburban home with multiple windows',
    url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80',
    scaleValue: 12,
    scaleType: 'width',
    icon: Home,
    category: 'Residential',
  },
  {
    id: 'commercial-1',
    title: 'Office Building',
    description: 'Modern commercial facade with glass panels',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    scaleValue: 25,
    scaleType: 'width',
    icon: Building2,
    category: 'Commercial',
  },
  {
    id: 'historic-1',
    title: 'Historic Building',
    description: 'Classic European architecture with ornate windows',
    url: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800&q=80',
    scaleValue: 18,
    scaleType: 'width',
    icon: Landmark,
    category: 'Historic',
  },
  {
    id: 'apartment-1',
    title: 'Apartment Block',
    description: 'Multi-unit residential building with uniform windows',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    scaleValue: 30,
    scaleType: 'width',
    icon: Building,
    category: 'Residential',
  },
  {
    id: 'modern-1',
    title: 'Modern Villa',
    description: 'Contemporary design with large glass facades',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    scaleValue: 15,
    scaleType: 'width',
    icon: Hotel,
    category: 'Modern',
  },
  {
    id: 'storefront-1',
    title: 'Retail Storefront',
    description: 'Street-level commercial facade with display windows',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    scaleValue: 8,
    scaleType: 'width',
    icon: Store,
    category: 'Commercial',
  },
];

interface SampleGalleryProps {
  onSelectSample: (url: string, scaleValue: number, scaleType: 'width' | 'height') => void;
}

const SampleGallery: React.FC<SampleGalleryProps> = ({ onSelectSample }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-200">Sample Facades</h3>
          <p className="text-sm text-slate-500">Click any image to test the analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {sampleImages.map((sample) => (
          <button
            key={sample.id}
            onClick={() => onSelectSample(sample.url, sample.scaleValue, sample.scaleType)}
            className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:scale-[1.02] text-left"
          >
            <div className="aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={sample.url}
                alt={sample.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="flex items-center gap-1.5 mb-0.5">
                <sample.icon className="w-3.5 h-3.5 text-white/80" />
                <span className="text-xs text-white/70 font-medium">{sample.category}</span>
              </div>
              <div className="text-sm font-semibold text-white">{sample.title}</div>
              <div className="text-xs text-white/60 mt-0.5">{sample.scaleValue}m {sample.scaleType}</div>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-slate-800/90 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-lg">
                Click to Analyze
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SampleGallery;

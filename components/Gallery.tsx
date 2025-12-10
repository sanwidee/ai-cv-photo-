import React from 'react';
import { GeneratedImage } from '../types';
import { Loader2, Edit3, RotateCcw, CheckCircle } from 'lucide-react';

interface GalleryProps {
  images: GeneratedImage[];
  isGenerating: boolean;
  onSelect: (image: GeneratedImage) => void;
  onRegenerate: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ images, isGenerating, onSelect, onRegenerate }) => {
  return (
    <div className="w-full h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Your Headshots</h2>
            <p className="text-slate-500">Pick the best one to refine. Click to edit.</p>
          </div>
          <button 
            onClick={onRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 text-sm bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg border border-slate-300 font-semibold shadow-sm transition-colors disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={16}/> : <RotateCcw size={16}/>}
            Try Again
          </button>
       </div>

       {isGenerating && images.length === 0 ? (
         <div className="flex-1 flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin relative z-10" />
            </div>
            <p className="text-slate-900 font-bold text-lg mt-6">Generating Professional Profile...</p>
            <p className="text-slate-500 text-sm mt-2">Applying suit, adjusting lighting, fixing background.</p>
         </div>
       ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {images.map((img, idx) => (
              <div 
                key={img.id} 
                className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 shadow-md bg-white cursor-pointer hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                onClick={() => onSelect(img)}
              >
                <img 
                  src={`data:${img.mimeType};base64,${img.base64}`} 
                  alt={`Headshot variant ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2.5 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                    <Edit3 size={18} />
                    Refine This
                  </div>
                </div>
                
                {/* Badge */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-slate-700 text-xs font-bold px-2 py-1 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    Variant #{idx + 1}
                </div>
              </div>
            ))}
            
            {isGenerating && (
                 <div className="aspect-square rounded-2xl border-2 border-slate-100 bg-slate-50 flex flex-col items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-2" />
                    <span className="text-xs text-slate-400 font-medium">Processing...</span>
                 </div>
            )}
         </div>
       )}
    </div>
  );
};

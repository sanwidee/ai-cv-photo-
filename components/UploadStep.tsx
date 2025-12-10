import React, { useCallback } from 'react';
import { UploadCloud, Image as ImageIcon, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface UploadStepProps {
  onImageUpload: (base64: string, mimeType: string) => void;
  showLandingPage: boolean;
  onStart: () => void;
  onBackToLanding: () => void;
}

export const UploadStep: React.FC<UploadStepProps> = ({ 
  onImageUpload, 
  showLandingPage, 
  onStart, 
  onBackToLanding 
}) => {

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Result is data:mime;base64,data...
        const mimeType = result.split(';')[0].split(':')[1];
        const base64 = result.split(',')[1];
        onImageUpload(base64, mimeType);
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  // Landing Page View
  if (showLandingPage) {
    return (
      <div className="flex flex-col items-center animate-fade-in py-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            #1 AI Headshot Generator
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
            Turn your casual photo into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Professional CV Ready</span> headshot.
          </h2>
          <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
            Stop spending hundreds on photographers. Use Pintarnya CV Photo to transform your selfies into corporate-grade profile pictures in seconds using Gemini AI.
          </p>
          <button 
            onClick={onStart}
            className="group bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-blue-600/30 flex items-center gap-3 mx-auto"
          >
            Create My Headshot
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Before / After Comparison */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-16 relative px-4">
             {/* Arrow Indicator (Desktop) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full z-20 shadow-xl flex items-center justify-center border border-slate-100 hidden md:flex text-blue-600">
                <ArrowRight size={28} strokeWidth={3} />
             </div>

            {/* Before Card */}
            <div className="group relative bg-white p-4 pb-6 rounded-3xl shadow-lg border border-slate-200 transform transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5">
                    {/* Placeholder for "Before" - Casual Asian Male in Blue Shirt/Casual wear */}
                    <img 
                        src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?q=80&w=600&auto=format&fit=crop" 
                        alt="Casual Selfie Before Transformation" 
                        className="w-full h-full object-cover filter brightness-95"
                    />
                    <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold border border-white/10">
                        Before
                    </div>
                </div>
                <div className="px-2">
                    <div className="flex items-start gap-3 text-slate-500 mb-2">
                        <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <p className="font-medium text-slate-700">Casual blue shirt</p>
                    </div>
                    <div className="flex items-start gap-3 text-slate-500">
                        <XCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
                        <p className="font-medium text-slate-700">Bad lighting & background</p>
                    </div>
                </div>
            </div>

            {/* After Card */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-white p-4 pb-6 rounded-3xl shadow-xl border-2 border-blue-200 transform transition-all duration-300 hover:-translate-y-1">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 shadow-inner">
                     {/* Placeholder for "After" - Professional Asian Male in Grey Suit (Visual Match) */}
                     <img 
                        src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" 
                        alt="Professional Headshot After Transformation" 
                        className="w-full h-full object-cover"
                    />
                     <div className="absolute top-4 left-4 bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg border border-blue-400/30">
                        After
                    </div>
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm text-blue-800 text-xs font-bold px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        AI Generated
                    </div>
                </div>
                <div className="px-2">
                    <div className="flex items-start gap-3 text-slate-700 mb-2">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                        <p className="font-bold text-slate-900">Professional grey suit</p>
                    </div>
                    <div className="flex items-start gap-3 text-slate-700">
                        <CheckCircle2 className="text-green-500 shrink-0 mt-0.5" size={20} />
                        <p className="font-bold text-slate-900">Studio lighting & retouching</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Social Proof / Trust */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Simple text placeholders for logos */}
            <span className="font-bold text-2xl tracking-tighter">LinkedIn</span>
            <span className="font-bold text-2xl tracking-tighter">Indeed</span>
            <span className="font-bold text-2xl tracking-tighter">Glassdoor</span>
            <span className="font-bold text-2xl tracking-tighter">Upwork</span>
        </div>
      </div>
    );
  }

  // Upload View
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto animate-fade-in pt-10">
      <button 
        onClick={onBackToLanding}
        className="self-start mb-6 text-slate-400 hover:text-slate-600 flex items-center gap-2 text-sm font-medium"
      >
        ← Back to Home
      </button>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-4">Start with a Selfie</h2>
        <p className="text-slate-500 text-lg">
          Upload a clear photo of yourself. We'll transform it into a professional studio headshot.
        </p>
      </div>

      <label className="group relative w-full aspect-[4/3] max-w-lg flex flex-col items-center justify-center border-3 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-blue-50 hover:border-blue-400 transition-all duration-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UploadCloud size={40} />
          </div>
          <p className="mb-2 text-xl font-semibold text-slate-700">
            Click to upload or drag and drop
          </p>
          <p className="text-sm text-slate-500">
            JPG, PNG (Max 5MB)
          </p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-sm text-slate-500">
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-slate-100">
          <ImageIcon className="text-green-500" />
          <span>Good lighting works best</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-slate-100">
          <ImageIcon className="text-green-500" />
          <span>Face clearly visible</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-white rounded-lg shadow-sm border border-slate-100">
          <ImageIcon className="text-green-500" />
          <span>No glasses/hats preferred</span>
        </div>
      </div>
    </div>
  );
};
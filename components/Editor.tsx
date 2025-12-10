import React, { useState } from 'react';
import { GeneratedImage } from '../types';
import { editHeadshot } from '../services/geminiService';
import { ArrowLeft, Send, Sparkles, Loader2, Download, History, ChevronRight, User } from 'lucide-react';

interface EditorProps {
  initialImage: GeneratedImage;
  uploadedImage: { base64: string; mimeType: string } | null;
  onBack: () => void;
}

export const Editor: React.FC<EditorProps> = ({ initialImage, uploadedImage, onBack }) => {
  // Construct a pseudo-GeneratedImage for the original upload to fit the history structure
  const originalUpload: GeneratedImage = {
    id: 'original-upload',
    base64: uploadedImage?.base64 || '',
    mimeType: uploadedImage?.mimeType || 'image/png',
    promptUsed: 'Original Selfie'
  };

  // History starts with the original upload AND the selected generation
  const [history, setHistory] = useState<GeneratedImage[]>([originalUpload, initialImage]);
  
  // The image currently being viewed and acted upon.
  const [currentImage, setCurrentImage] = useState<GeneratedImage>(initialImage);
  
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!prompt.trim() || isProcessing) return;
    
    setIsProcessing(true);
    setError(null);

    try {
      // Edit based on the currently selected image
      const newImage = await editHeadshot(currentImage, prompt);
      
      setHistory(prev => [...prev, newImage]);
      setCurrentImage(newImage); // Auto-switch to the new version
      setPrompt('');
    } catch (err: any) {
      setError("Failed to update image. Try a different instruction.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectVersion = (img: GeneratedImage) => {
      setCurrentImage(img);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleEdit();
    }
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = `data:${currentImage.mimeType};base64,${currentImage.base64}`;
    link.download = `prolink-headshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="flex flex-col lg:flex-row h-full gap-8 animate-fade-in">
        {/* Left: Image View */}
        <div className="flex-1 flex flex-col">
             <button onClick={onBack} className="self-start text-slate-500 hover:text-blue-600 flex items-center gap-2 mb-6 text-sm font-semibold transition-colors">
                <ArrowLeft size={16} /> Back to Results
             </button>
            
            <div className="relative flex-1 bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center shadow-inner min-h-[400px]">
                <img 
                    src={`data:${currentImage.mimeType};base64,${currentImage.base64}`} 
                    alt="Current Edit"
                    className="max-h-full max-w-full object-contain shadow-xl rounded-lg"
                />
                
                {isProcessing && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900">
                        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                        <span className="font-bold animate-pulse">Refining your look...</span>
                    </div>
                )}
            </div>
            
            <div className="flex justify-between items-center mt-6">
                 <div className="text-sm text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                    Viewing Version {history.findIndex(h => h.id === currentImage.id) + 1} of {history.length}
                 </div>

                 <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
                 >
                    <Download size={18} /> Download HD
                 </button>
            </div>
        </div>

        {/* Right: Controls & History */}
        <div className="w-full lg:w-96 flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[600px] lg:h-auto">
            <div className="mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-2 text-slate-900">
                    <Sparkles className="text-blue-600" size={20} />
                    AI Retouching
                </h3>
                <p className="text-sm text-slate-500">
                   Select a version below to view or edit.
                </p>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 custom-scrollbar">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-4">
                    <History size={12} /> Version History
                 </div>
                 
                 {history.map((img, idx) => {
                    const isActive = img.id === currentImage.id;
                    const isOriginalUpload = img.id === 'original-upload';
                    const isFirstGeneration = !isOriginalUpload && idx === 1;
                    
                    return (
                        <button 
                            key={img.id}
                            onClick={() => handleSelectVersion(img)}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 group flex items-start gap-3
                                ${isActive 
                                    ? 'bg-blue-50 border-blue-500 shadow-sm ring-1 ring-blue-200' 
                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                                }
                            `}
                        >
                             <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                                ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}
                             `}>
                                {isOriginalUpload ? <User size={12} /> : 
                                 isFirstGeneration ? <Sparkles size={12} /> : 
                                 (idx)}
                             </div>
                             
                             <div className="flex-1 min-w-0">
                                 <div className={`text-xs font-bold mb-0.5 ${isActive ? 'text-blue-800' : 'text-slate-700'}`}>
                                    {isOriginalUpload ? 'Original Upload' : 
                                     isFirstGeneration ? 'First Generation' : 
                                     'Edit Request'}
                                 </div>
                                 <div className="text-xs text-slate-500 truncate leading-relaxed">
                                     {isOriginalUpload ? 'Your source photo' : 
                                      isFirstGeneration ? 'Base AI result' : 
                                      `"${img.promptUsed}"`}
                                 </div>
                             </div>
                             
                             {isActive && <ChevronRight size={14} className="text-blue-500 mt-1" />}
                        </button>
                    );
                 })}

                 {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-lg text-sm mt-2">
                        {error}
                    </div>
                 )}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="relative">
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={
                            currentImage.id === 'original-upload' 
                            ? "Describe the headshot you want to generate..." 
                            : "Fix the hair, change tie color..."
                        }
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 pr-12 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-24 text-sm"
                    />
                    <button 
                        onClick={handleEdit}
                        disabled={isProcessing || !prompt.trim()}
                        className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isProcessing ? <Loader2 className="animate-spin" size={20}/> : <Send size={20} />}
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
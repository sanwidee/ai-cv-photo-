import React from 'react';
import { Book, FolderOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  step: number;
  onLogoClick: () => void;
  onProjectsClick?: () => void;
  showProjectsButton?: boolean;
}

const steps = [
  { label: 'Upload', id: 0 },
  { label: 'Style', id: 1 },
  { label: 'Generate', id: 2 },
  { label: 'Refine', id: 3 },
];

export const Layout: React.FC<LayoutProps> = ({ children, step, onLogoClick, onProjectsClick, showProjectsButton }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center font-sans">
      {/* Header */}
      <header className="w-full max-w-6xl p-6 flex justify-between items-center border-b border-slate-200 bg-white shadow-sm sticky top-0 z-10">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none"
          aria-label="Back to Home"
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Book size={20} strokeWidth={2.5} />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight text-left">
            Pintarnya<span className="text-blue-600"> CV Photo</span>
          </h1>
        </button>


        <div className="flex items-center gap-8">
          {showProjectsButton && onProjectsClick && (
            <button
              onClick={onProjectsClick}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <FolderOpen size={18} />
              Saved Projects
            </button>
          )}

          {/* Step Indicator */}
          <div className="hidden md:flex gap-4">
            {steps.map((s, idx) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              return (
                <div key={s.id} className="flex items-center gap-2">
                  <div
                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2
                    ${isActive ? 'border-blue-600 bg-blue-600 text-white scale-105' : ''}
                    ${isCompleted ? 'border-blue-600 bg-white text-blue-600' : ''}
                    ${!isActive && !isCompleted ? 'border-slate-300 bg-slate-100 text-slate-400' : ''}
                  `}
                  >
                    {s.id + 1}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-blue-700' : 'text-slate-500'}`}>
                    {s.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <div className={`w-8 h-[2px] ${isCompleted ? 'bg-blue-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex-1 p-4 md:p-8 flex flex-col">
        {children}
      </main>

      <footer className="w-full p-6 text-center text-slate-500 text-sm border-t border-slate-200 bg-white mt-auto">
        Powered by Gemini Nano Banana (Flash Image) &bull; Create professional LinkedIn profiles in seconds
      </footer>
    </div>
  );
};
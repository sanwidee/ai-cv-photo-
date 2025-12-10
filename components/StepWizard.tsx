import React, { useRef } from 'react';
import { HeadshotFeatures } from '../types';
import { ArrowRight, Building2, Zap, Coffee, Check, HelpCircle, Camera, Upload } from 'lucide-react';

interface WizardProps {
  features: HeadshotFeatures;
  updateFeatures: (key: keyof HeadshotFeatures, value: any) => void;
  onNext: () => void;
  uploadedImagePreview: { base64: string; mimeType: string } | null;
}

// --- Configuration Data ---

type OptionItem = {
  id: string;
  label: string;
  description?: string;
  imageSrc: string; // Placeholder or Unsplash URL
};

type VibeConfig = {
  attire: OptionItem[];
  background: OptionItem[];
  lighting: OptionItem[];
};

const VIBE_OPTIONS: Record<string, VibeConfig> = {
  'Corporate': {
    attire: [
      { id: 'C01', label: 'Classic Suit & Tie', imageSrc: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80' },
      { id: 'C02', label: 'Blazer + Shirt (No Tie)', imageSrc: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=300&q=80' },
      { id: 'C03', label: 'Business Formal Dress', imageSrc: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
      { id: 'C04', label: 'Smart Shirt + Trousers', imageSrc: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?auto=format&fit=crop&w=300&q=80' },
    ],
    background: [
      { id: 'CBG01', label: 'High-rise Office', description: 'Blurred city view', imageSrc: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80' },
      { id: 'CBG02', label: 'Clean Corporate Wall', description: 'Neutral grey/white', imageSrc: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80' },
      { id: 'CBG03', label: 'Boardroom', description: 'Soft blur meeting room', imageSrc: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&w=300&q=80' },
      { id: 'CBG04', label: 'Corporate Lobby', description: 'Subtle depth of field', imageSrc: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80' },
    ],
    lighting: [
      { id: 'L01', label: 'Soft Studio', description: 'Even, flattering', imageSrc: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=300&q=80' },
      { id: 'L02', label: 'Natural Window', description: 'Daylight, soft shadows', imageSrc: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80' },
      { id: 'L03', label: 'Neutral Front', description: 'Minimizes shadows', imageSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  'Startup': {
    attire: [
      { id: 'S01', label: 'Smart Casual Shirt', imageSrc: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80' },
      { id: 'S02', label: 'T-Shirt + Blazer', imageSrc: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=300&q=80' },
      { id: 'S03', label: 'Polo Shirt', imageSrc: 'https://images.unsplash.com/photo-1628157588553-5eeea00af15c?auto=format&fit=crop&w=300&q=80' },
      { id: 'S04', label: 'Hoodie + T-Shirt', imageSrc: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80' },
    ],
    background: [
      { id: 'SBG01', label: 'Modern Open Office', description: 'Desks, blurred', imageSrc: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=300&q=80' },
      { id: 'SBG02', label: 'Co-working Space', description: 'Plants, warm elements', imageSrc: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=300&q=80' },
      { id: 'SBG03', label: 'Tech Gradient', description: 'Minimal abstract', imageSrc: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&q=80' },
      { id: 'SBG04', label: 'Textured Wall', description: 'Brick, subtle', imageSrc: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=300&q=80' },
    ],
    lighting: [
      { id: 'L01', label: 'Soft Studio', description: 'Even, flattering', imageSrc: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=300&q=80' },
      { id: 'L02', label: 'Natural Window', description: 'Daylight, soft shadows', imageSrc: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80' },
      { id: 'L04', label: 'Slight Rim Light', description: 'Techy depth', imageSrc: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    ]
  },
  'Creative': {
    attire: [
      { id: 'CR01', label: 'Stylish Casual', description: 'Shirt / Blouse + Jeans', imageSrc: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80' },
      { id: 'CR02', label: 'Statement Outfit', description: 'Patterns / Colors', imageSrc: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
      { id: 'CR03', label: 'Monochrome', description: 'Black Turtleneck', imageSrc: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
      { id: 'CR04', label: 'Artsy Layered', description: 'Jacket, Accessories', imageSrc: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=300&q=80' },
    ],
    background: [
      { id: 'CRBG01', label: 'Studio Color', description: 'Muted pastel', imageSrc: 'https://images.unsplash.com/photo-1507646227500-4d389b0012be?auto=format&fit=crop&w=300&q=80' },
      { id: 'CRBG02', label: 'Artistic Workspace', description: 'Easel, gear', imageSrc: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=300&q=80' },
      { id: 'CRBG03', label: 'Urban Street', description: 'Soft blur', imageSrc: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=80' },
      { id: 'CRBG04', label: 'Minimal Dark', description: 'Spotlight effect', imageSrc: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=300&q=80' },
    ],
    lighting: [
      { id: 'L01', label: 'Soft Studio', description: 'Even, flattering', imageSrc: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?auto=format&fit=crop&w=300&q=80' },
      { id: 'L02', label: 'Natural Window', description: 'Daylight', imageSrc: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80' },
      { id: 'L05', label: 'Creative Directional', description: 'Mild contrast', imageSrc: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80' },
    ]
  }
};

const ANGLE_OPTIONS: OptionItem[] = [
  { id: 'A01', label: 'Eye Level', description: 'Classic & Neutral', imageSrc: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 'A02', label: 'Low Angle', description: 'Heroic & Powerful', imageSrc: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=300&q=80' },
  { id: 'A03', label: 'High Angle', description: 'Flattering & Soft', imageSrc: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 'A04', label: 'Wide Angle', description: 'Environmental Context', imageSrc: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?auto=format&fit=crop&w=300&q=80' },
];

const VibeCard: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  desc: string; 
  selected: boolean; 
  onClick: () => void 
}> = ({ icon, title, desc, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      flex flex-col items-center p-5 rounded-xl border-2 transition-all duration-200 text-left w-full h-full relative overflow-hidden
      ${selected 
        ? 'border-blue-600 bg-blue-50 shadow-md ring-1 ring-blue-600' 
        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm'
      }
    `}
  >
    <div className={`mb-3 p-2.5 rounded-full z-10 ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
      {icon}
    </div>
    <h3 className="text-base font-bold text-slate-900 mb-1 z-10">{title}</h3>
    <p className="text-xs text-slate-500 text-center z-10">{desc}</p>
  </button>
);

const ImageOptionCard: React.FC<{
  item: OptionItem;
  selected: boolean;
  onClick: () => void;
}> = ({ item, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      group relative rounded-xl overflow-hidden border-2 transition-all duration-200 text-left w-full aspect-[4/3]
      ${selected 
        ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' 
        : 'border-transparent hover:border-blue-300 hover:shadow-md'
      }
    `}
  >
    <img 
      src={item.imageSrc} 
      alt={item.label} 
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    {/* Overlay */}
    <div className={`absolute inset-0 transition-opacity duration-300 ${selected ? 'bg-blue-900/40' : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:bg-black/40'}`} />
    
    {/* Checkmark */}
    {selected && (
      <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow-sm animate-scale-in">
        <Check size={14} strokeWidth={3} />
      </div>
    )}

    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
      <div className="text-xs font-bold opacity-80 mb-0.5">{item.id}</div>
      <div className="text-sm font-bold leading-tight shadow-sm">{item.label}</div>
      {item.description && (
        <div className="text-[10px] text-slate-200 mt-1 line-clamp-1">{item.description}</div>
      )}
    </div>
  </button>
);

export const StepWizard: React.FC<WizardProps> = ({ features, updateFeatures, onNext, uploadedImagePreview }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset downstream features if vibe changes
  const handleVibeChange = (newVibe: string) => {
    if (newVibe !== features.vibe) {
      updateFeatures('vibe', newVibe);
      updateFeatures('attire', '');
      updateFeatures('background', '');
      updateFeatures('lighting', '');
      // Angle is preserved as it's often preference
    }
  };

  const handleCustomBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const mimeType = result.split(';')[0].split(':')[1];
        const base64 = result.split(',')[1];
        
        // Update both the background label and the custom data
        updateFeatures('background', 'Custom Upload');
        updateFeatures('customBackground', { base64, mimeType });
      };
      reader.readAsDataURL(file);
    }
  };

  const currentConfig = features.vibe ? VIBE_OPTIONS[features.vibe] : null;

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full max-w-7xl mx-auto w-full animate-fade-in pb-12">
        {/* Left: Preview (Desktop) */}
        {uploadedImagePreview && (
            <div className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 h-fit">
                <div className="text-sm font-bold text-slate-500 mb-2">Original Photo</div>
                <div className="rounded-xl overflow-hidden border-2 border-slate-200 shadow-sm bg-slate-100 aspect-[3/4]">
                    <img 
                        src={`data:${uploadedImagePreview.mimeType};base64,${uploadedImagePreview.base64}`} 
                        alt="Original Upload" 
                        className="w-full h-full object-cover opacity-80"
                    />
                </div>
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                   <span className="font-semibold text-slate-500">Note:</span> We reference your face from this photo. The outfit and background will be completely replaced.
                </p>
            </div>
        )}

        {/* Right: Controls */}
        <div className="flex-1 flex flex-col space-y-10">
            <div>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Define Your Look</h2>
                <p className="text-slate-500 text-lg">Choose a professional vibe and studio settings.</p>
            </div>

            {/* 1. VIBE SELECTION */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">1</div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Professional Vibe</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <VibeCard 
                        icon={<Building2 size={20} />} 
                        title="Corporate" 
                        desc="Executive, Law, Finance. Trustworthy & Serious." 
                        selected={features.vibe === 'Corporate'} 
                        onClick={() => handleVibeChange('Corporate')} 
                    />
                    <VibeCard 
                        icon={<Zap size={20} />} 
                        title="Startup / Tech" 
                        desc="Modern, approachable, smart casual." 
                        selected={features.vibe === 'Startup'} 
                        onClick={() => handleVibeChange('Startup')} 
                    />
                    <VibeCard 
                        icon={<Coffee size={20} />} 
                        title="Creative" 
                        desc="Design, Arts, Media. Stylish & Unique." 
                        selected={features.vibe === 'Creative'} 
                        onClick={() => handleVibeChange('Creative')} 
                    />
                </div>
            </section>

            {/* 2. DYNAMIC SELECTIONS */}
            {currentConfig ? (
              <div className="space-y-10 animate-fade-in-up">
                
                {/* Attire */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">2</div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Attire</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentConfig.attire.map((item) => (
                      <ImageOptionCard 
                        key={item.id}
                        item={item}
                        selected={features.attire === item.label}
                        onClick={() => updateFeatures('attire', item.label)}
                      />
                    ))}
                  </div>
                </section>

                {/* Background */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">3</div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Background</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* CUSTOM UPLOAD BUTTON */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                          group flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 w-full aspect-[4/3] bg-slate-50
                          ${features.background === 'Custom Upload'
                            ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' 
                            : 'border-slate-300 hover:border-blue-400 hover:bg-blue-50'
                          }
                        `}
                    >
                       <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleCustomBackgroundUpload}
                       />
                       
                       {features.background === 'Custom Upload' && features.customBackground ? (
                         <div className="relative w-full h-full overflow-hidden rounded-xl">
                            <img 
                              src={`data:${features.customBackground.mimeType};base64,${features.customBackground.base64}`} 
                              className="w-full h-full object-cover" 
                              alt="Custom Background"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="bg-white/90 text-blue-800 text-xs font-bold px-2 py-1 rounded shadow">Change</div>
                            </div>
                            <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow-sm">
                              <Check size={14} strokeWidth={3} />
                            </div>
                         </div>
                       ) : (
                         <>
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                              <Upload size={20} />
                            </div>
                            <div className="text-sm font-bold text-slate-700">Upload Own</div>
                            <div className="text-[10px] text-slate-400">Use your own bg</div>
                         </>
                       )}
                    </button>

                    {currentConfig.background.map((item) => (
                      <ImageOptionCard 
                        key={item.id}
                        item={item}
                        selected={features.background === item.label}
                        onClick={() => updateFeatures('background', item.label)}
                      />
                    ))}
                  </div>
                </section>

                {/* Lighting */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">4</div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Select Lighting</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {currentConfig.lighting.map((item) => (
                      <ImageOptionCard 
                        key={item.id}
                        item={item}
                        selected={features.lighting === item.label}
                        onClick={() => updateFeatures('lighting', item.label)}
                      />
                    ))}
                  </div>
                </section>

                {/* Camera Angle (New Section) */}
                <section>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">5</div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Camera Angle</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {ANGLE_OPTIONS.map((item) => (
                      <ImageOptionCard 
                        key={item.id}
                        item={item}
                        selected={features.angle === item.label}
                        onClick={() => updateFeatures('angle', item.label)}
                      />
                    ))}
                  </div>
                </section>

                {/* CTA */}
                <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                     <HelpCircle size={16} />
                     <p>Selected features will be blended naturally by AI.</p>
                  </div>
                  <button 
                    onClick={onNext}
                    disabled={!features.attire || !features.background || !features.lighting || !features.angle}
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1"
                  >
                    Generate Photos <Camera size={20} />
                  </button>
                </div>

              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-center text-slate-400">
                 Select a <strong>Professional Vibe</strong> above to see available styles.
              </div>
            )}
        </div>
    </div>
  );
};
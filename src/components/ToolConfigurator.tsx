import React from 'react';
import { useImageStore } from '../store/imageStore';
import { getTranslation } from '../constants/translations';
import { 
  Check, 
  Lock,
  Unlock
} from 'lucide-react';
import { PASSPORT_PRESETS } from '../utils/passport';

// Social Media presets dimensions
const SOCIAL_PRESETS = [
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Portrait', width: 1080, height: 1350 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
  { name: 'TikTok Video', width: 1080, height: 1920 },
  { name: 'YouTube Thumbnail', width: 1280, height: 720 },
  { name: 'Facebook Cover', width: 820, height: 312 },
  { name: 'LinkedIn Post', width: 1200, height: 627 },
  { name: 'X/Twitter Post', width: 1600, height: 900 },
];

interface ToolConfiguratorProps {
  onProcess: () => void;
  isProcessing: boolean;
}

export const ToolConfigurator: React.FC<ToolConfiguratorProps> = ({ onProcess, isProcessing }) => {
  const { 
    activeTool, 
    resizeOptions, 
    convertOptions, 
    compressOptions, 
    passportOptions, 
    bgRemoverOptions,
    theme, 
    settings,
    setResizeOptions,
    setConvertOptions,
    setCompressOptions,
    setPassportOptions,
    setBgRemoverOptions
  } = useImageStore();

  const t = getTranslation(settings.language);

  // Background Changers list
  const bgColorsList = [
    { name: 'Transparent', value: 'transparent', bgClass: 'bg-transparent border border-gray-500/30' },
    { name: 'Red', value: 'red', bgClass: 'bg-[#df2a2a]' },
    { name: 'Blue', value: 'blue', bgClass: 'bg-[#2a6adf]' },
    { name: 'White', value: 'white', bgClass: 'bg-white border border-gray-300' },
    { name: 'Gray', value: 'gray', bgClass: 'bg-gray-500' },
  ];

  const templatesList = [
    { id: 'studio-white', label: 'Studio White', bgStyle: 'radial-gradient(circle, #ffffff 0%, #e2e8f0 100%)' },
    { id: 'studio-gray', label: 'Studio Gray', bgStyle: 'radial-gradient(circle, #94a3b8 0%, #334155 100%)' },
    { id: 'office', label: 'Office BG', bgStyle: 'linear-gradient(to bottom, #1e293b, #0f172a)' }, // Blurred template indicator
    { id: 'corporate', label: 'Corporate BG', bgStyle: 'linear-gradient(to bottom, #1e1b4b, #0f0e17)' }
  ];

  return (
    <div className="flex flex-col h-full">
      <h3 className={`font-outfit font-bold text-sm uppercase tracking-wider mb-6 ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {t.dashboard.settingsTitle}
      </h3>

      <div className="flex-1 space-y-6 overflow-y-auto pr-1.5 scrollbar-thin">
        {/* ================= RESIZE OPTIONS ================= */}
        {activeTool === 'resize' && (
          <div className="space-y-5">
            {/* Mode selection buttons */}
            <div className="grid grid-cols-3 gap-1 p-1 bg-black/10 rounded-xl">
              {(['custom', 'percentage', 'preset'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setResizeOptions({ mode: m })}
                  className={`py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-all ${
                    resizeOptions.mode === m
                      ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-sm'
                      : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {m === 'custom' ? 'Custom' : m === 'percentage' ? 'Scale' : 'Preset'}
                </button>
              ))}
            </div>

            {/* Custom Mode */}
            {resizeOptions.mode === 'custom' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Width (px)</label>
                    <input
                      type="number"
                      value={resizeOptions.width}
                      onChange={(e) => setResizeOptions({ width: Number(e.target.value) })}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        theme === 'dark'
                          ? 'bg-[#12131a]/40 border-white/5 text-white'
                          : 'bg-white border-black/10 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Height (px)</label>
                    <input
                      type="number"
                      value={resizeOptions.height}
                      onChange={(e) => setResizeOptions({ height: Number(e.target.value) })}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold border focus:outline-none focus:ring-1 focus:ring-purple-500 ${
                        theme === 'dark'
                          ? 'bg-[#12131a]/40 border-white/5 text-white'
                          : 'bg-white border-black/10 text-gray-900'
                      }`}
                    />
                  </div>
                </div>

                <button
                  onClick={() => setResizeOptions({ lockAspectRatio: !resizeOptions.lockAspectRatio })}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                    resizeOptions.lockAspectRatio
                      ? 'text-purple-400 bg-purple-500/10'
                      : 'text-gray-500 bg-black/5 hover:bg-black/10 dark:text-gray-400 dark:bg-white/5 dark:hover:bg-white/10'
                  }`}
                >
                  {resizeOptions.lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>{resizeOptions.lockAspectRatio ? 'Locked Ratio' : 'Free Ratio'}</span>
                </button>
              </div>
            )}

            {/* Percentage Mode */}
            {resizeOptions.mode === 'percentage' && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold text-gray-400">
                  <span>Dimension Scale</span>
                  <span className="font-mono text-purple-400">{resizeOptions.percentage}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={resizeOptions.percentage}
                  onChange={(e) => setResizeOptions({ percentage: Number(e.target.value) })}
                  className="w-full h-1.5 bg-purple-950/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>10%</span>
                  <span>100% (Original)</span>
                  <span>200%</span>
                </div>
              </div>
            )}

            {/* Preset Mode */}
            {resizeOptions.mode === 'preset' && (
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-gray-400">Social Media Presets</label>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {SOCIAL_PRESETS.map((p) => {
                    const isSelected = resizeOptions.preset === p.name;
                    return (
                      <button
                        key={p.name}
                        onClick={() => setResizeOptions({ 
                          width: p.width, 
                          height: p.height, 
                          preset: p.name,
                          lockAspectRatio: false
                        })}
                        className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-purple-500 bg-purple-500/10'
                            : theme === 'dark'
                              ? 'border-white/5 hover:border-white/10 bg-white/5 hover:bg-white/10'
                              : 'border-black/5 hover:border-black/10 bg-black/5 hover:bg-black/10'
                        }`}
                      >
                        <span className="text-xs font-bold truncate w-full">{p.name}</span>
                        <span className="text-[10px] font-mono text-gray-500 mt-1">{p.width} × {p.height}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= CONVERT OPTIONS ================= */}
        {activeTool === 'convert' && (
          <div className="space-y-4">
            <label className="block text-xs font-semibold text-gray-400">Output Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['png', 'jpg', 'webp'] as const).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setConvertOptions({ format: fmt })}
                  className={`py-3.5 text-sm font-extrabold rounded-xl uppercase cursor-pointer border transition-all ${
                    convertOptions.format === fmt
                      ? 'border-purple-500 bg-purple-500/15 text-purple-400'
                      : theme === 'dark'
                        ? 'border-white/5 bg-[#12131a]/40 text-gray-300 hover:bg-white/5'
                        : 'border-black/5 bg-white text-gray-700 hover:bg-black/5'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ================= COMPRESS OPTIONS ================= */}
        {activeTool === 'compress' && (
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-semibold text-gray-400">
              <span>Image Quality</span>
              <span className="font-mono text-purple-400">{compressOptions.quality}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={compressOptions.quality}
              onChange={(e) => setCompressOptions({ quality: Number(e.target.value) })}
              className="w-full h-1.5 bg-purple-950/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Max Compression</span>
              <span>80% (Recommended)</span>
              <span>High Quality</span>
            </div>
          </div>
        )}

        {/* ================= PASSPORT OPTIONS ================= */}
        {activeTool === 'passport' && (
          <div className="space-y-5">
            {/* Warning Note */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs">
              <strong>Use Case:</strong> {t.features.useCaseWarn}
              <p className="mt-1 opacity-80 text-[10px]">{t.features.useCaseSub}</p>
            </div>

            {/* Quality Mode Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Quality Mode</label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-black/10 rounded-xl">
                {(['fast', 'better'] as const).map((m) => {
                  const isSelected = passportOptions.qualityMode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPassportOptions({ qualityMode: m })}
                      className={`py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      {m === 'fast' ? 'Fast Mode' : 'Better Mode'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Photo Size</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(PASSPORT_PRESETS).map((sz) => {
                  const isSelected = passportOptions.size === sz;
                  const label = sz;
                  return (
                    <button
                      key={sz}
                      onClick={() => setPassportOptions({ size: sz as any })}
                      className={`py-3 text-xs font-extrabold rounded-xl cursor-pointer border transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/15 text-purple-400'
                          : theme === 'dark'
                            ? 'border-white/5 bg-[#12131a]/40 text-gray-300 hover:bg-white/5'
                            : 'border-black/5 bg-white text-gray-700 hover:bg-black/5'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Auto Face Center Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-black/10 rounded-xl border border-white/5">
              <div>
                <span className="block text-xs font-bold">Auto Center Face</span>
                <span className="block text-[10px] text-gray-400 mt-0.5">Auto-centered head crop (AI)</span>
              </div>
              <button
                onClick={() => setPassportOptions({ autoCenter: !passportOptions.autoCenter })}
                className={`w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors ${
                  passportOptions.autoCenter ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                  passportOptions.autoCenter ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Crop Margin slider if AutoCenter is on */}
            {passportOptions.autoCenter && (
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold text-gray-400">
                  <span>Passport Zoom</span>
                  <span className="font-mono text-purple-400">-{passportOptions.cropMargin}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={passportOptions.cropMargin}
                  onChange={(e) => setPassportOptions({ cropMargin: Number(e.target.value) })}
                  className="w-full h-1.5 bg-purple-950/20 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Near</span>
                  <span>Medium</span>
                  <span>Far</span>
                </div>
              </div>
            )}

            {/* Solid color background */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Passport Background</label>
              <div className="flex items-center gap-2.5">
                {[
                  { name: 'Red', value: '#df2a2a' },
                  { name: 'Blue', value: '#2a6adf' },
                  { name: 'White', value: '#ffffff' },
                  { name: 'Transparent', value: 'transparent' }
                ].map((bg) => {
                  const isSelected = passportOptions.backgroundColor === bg.value;
                  return (
                    <button
                      key={bg.value}
                      onClick={() => setPassportOptions({ backgroundColor: bg.value })}
                      style={{ backgroundColor: bg.value === 'transparent' ? undefined : bg.value }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all border relative ${
                        bg.value === 'transparent' ? 'bg-transparent border-dashed border-gray-500/50' : 'border-white/10'
                      } ${isSelected ? 'scale-110 ring-2 ring-purple-500 ring-offset-2 dark:ring-offset-[#12131a]' : 'hover:scale-105'}`}
                    >
                      {bg.value === 'transparent' && <span className="text-[9px] font-bold text-gray-400">Trsp</span>}
                      {isSelected && bg.value !== 'transparent' && (
                        <Check className={`w-4 h-4 ${bg.value === '#ffffff' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 text-[10px] leading-relaxed">
                {t.features.bgTip}
              </div>
            </div>
          </div>
        )}

        {/* ================= BG REMOVER OPTIONS ================= */}
        {activeTool === 'bg-remover' && (
          <div className="space-y-6">
            {/* Warning Note */}
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-500 text-xs">
              <strong>Use Case:</strong> {t.features.useCaseWarn}
              <p className="mt-1 opacity-80 text-[10px]">{t.features.useCaseSub}</p>
            </div>

            {/* Quality Mode Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Quality Mode</label>
              <div className="grid grid-cols-2 gap-1 p-1 bg-black/10 rounded-xl">
                {(['fast', 'better'] as const).map((m) => {
                  const isSelected = bgRemoverOptions.qualityMode === m;
                  return (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setBgRemoverOptions({ qualityMode: m })}
                      className={`py-1.5 text-xs font-semibold rounded-lg capitalize cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white'
                          : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                      }`}
                    >
                      {m === 'fast' ? 'Fast Mode' : 'Better Mode'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Solid background colors */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-3.5">Remove / Replace Background</label>
              <div className="flex flex-wrap gap-2.5">
                {bgColorsList.map((bg) => {
                  const isSelected = bgRemoverOptions.backgroundColor === bg.value;
                  return (
                    <button
                      key={bg.value}
                      onClick={() => setBgRemoverOptions({ backgroundColor: bg.value as any })}
                      className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-purple-600 text-white border-transparent'
                          : theme === 'dark'
                            ? 'bg-white/5 border border-white/5 text-gray-300 hover:bg-white/10'
                            : 'bg-black/5 border border-black/5 text-gray-700 hover:bg-black/10'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full ${bg.bgClass}`} />
                      <span>{bg.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template structures */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-3">Professional Template (Bokeh AI)</label>
              <div className="grid grid-cols-2 gap-2">
                {templatesList.map((t) => {
                  const isSelected = bgRemoverOptions.backgroundColor === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setBgRemoverOptions({ backgroundColor: t.id as any })}
                      className={`p-2 rounded-xl text-left border cursor-pointer transition-all flex flex-col gap-2 relative overflow-hidden ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : theme === 'dark'
                            ? 'border-white/5 bg-[#12131a]/40 hover:bg-white/5'
                            : 'border-black/5 bg-white hover:bg-black/5'
                      }`}
                    >
                      <div 
                        className="w-full h-12 rounded-lg opacity-85" 
                        style={{ background: t.bgStyle }}
                      />
                      <span className="text-[10px] font-extrabold truncate w-full">{t.label}</span>
                      
                      {isSelected && (
                        <div className="absolute top-1 right-1 p-0.5 bg-purple-600 text-white rounded-full">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BIG PRIMARY APPLY BUTTON */}
      <div className="pt-6 border-t dark:border-white/5 border-gray-200 mt-6">
        <button
          onClick={onProcess}
          disabled={isProcessing}
          className={`w-full flex items-center justify-center gap-2 py-3.5 text-sm font-bold rounded-xl cursor-pointer shadow-lg transition-all duration-300 transform active:scale-98 ${
            isProcessing
              ? 'opacity-50 cursor-not-allowed bg-purple-900 text-gray-300'
              : 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/15'
          }`}
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>{t.dashboard.processing}</span>
            </>
          ) : (
            <>
              <span>Process Image</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
export default ToolConfigurator;

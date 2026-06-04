import React, { useEffect } from 'react';
import { useImageStore } from '../store/imageStore';
import { getTranslation } from '../constants/translations';
import { Sun, Moon, Save, Archive, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export const SettingsPage: React.FC = () => {
  const { theme, settings, setTheme, setSettings, setActiveTab } = useImageStore();
  const t = getTranslation(settings.language);

  // Sync metadata for Settings page
  useEffect(() => {
    const titleText = settings.language === 'id'
      ? 'Pengaturan - PhotoToolkit'
      : 'Settings - PhotoToolkit';
    const descText = settings.language === 'id'
      ? 'Atur preferensi bahasa, tema visual (gelap/terang), dan preferensi ekspor gambar PhotoToolkit.'
      : 'Configure language, visual theme (dark/light), and image export preferences for PhotoToolkit.';

    document.title = titleText;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', descText);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', titleText);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', descText);

    const twTitle = document.querySelector('meta[property="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', titleText);

    const twDesc = document.querySelector('meta[property="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', descText);
  }, [settings.language]);

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan!');
    setActiveTab('dashboard');
  };

  return (
    <div className="flex-1 flex flex-col w-full justify-between min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-2xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
      <div className={`p-6 md:p-8 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-[#0f1015] border-white/5 shadow-2xl' : 'bg-white border-gray-200 shadow-md'
      }`}>
        <h2 className={`font-outfit text-2xl md:text-3xl font-bold mb-8 flex items-center gap-2.5 ${
          theme === 'dark' ? 'text-white' : 'text-gray-900'
        }`}>
          <span>{t.settingsPage.title}</span>
        </h2>

        <div className="space-y-6">
          {/* Theme Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-xl bg-black/10 border border-white/5 gap-3">
            <div>
              <span className="block text-sm font-bold">{t.settingsPage.theme}</span>
              <span className="block text-xs text-gray-400 mt-0.5">Atur tampilan antarmuka visual aplikasi</span>
            </div>
            
            <div className="flex gap-1.5 p-1 bg-black/20 rounded-lg">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  theme === 'light'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{t.settingsPage.light}</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  theme === 'dark'
                    ? 'bg-[#12131a] text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t.settingsPage.dark}</span>
              </button>
            </div>
          </div>

          {/* Language Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-xl bg-black/10 border border-white/5 gap-3">
            <div>
              <span className="block text-sm font-bold">{t.settingsPage.lang}</span>
              <span className="block text-xs text-gray-400 mt-0.5">Pilih bahasa petunjuk pengoperasian</span>
            </div>

            <div className="flex gap-1.5 p-1 bg-black/20 rounded-lg">
              <button
                onClick={() => setSettings({ language: 'id' })}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  settings.language === 'id'
                    ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Indonesian (ID)
              </button>
              <button
                onClick={() => setSettings({ language: 'en' })}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  settings.language === 'en'
                    ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Export Preference Option */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4.5 rounded-xl bg-black/10 border border-white/5 gap-3">
            <div>
              <span className="block text-sm font-bold">{t.settingsPage.exportPref}</span>
              <span className="block text-xs text-gray-400 mt-0.5">Format ekspor saat memproses banyak gambar</span>
            </div>

            <div className="flex gap-1.5 p-1 bg-black/20 rounded-lg">
              <button
                onClick={() => setSettings({ exportPreference: 'individual' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  settings.exportPreference === 'individual'
                    ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>{t.settingsPage.exportPrefInd}</span>
              </button>
              <button
                onClick={() => setSettings({ exportPreference: 'zip' })}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md cursor-pointer transition-all ${
                  settings.exportPreference === 'zip'
                    ? theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-white text-black shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{t.settingsPage.exportPrefZip}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-bold rounded-xl cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ${
              theme === 'dark' 
                ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-600/10' 
                : 'bg-black text-white hover:bg-gray-900 shadow-black/10'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>Simpan & Kembali</span>
          </button>
        </div>
      </div>
      </div>

      {/* Compact Footer */}
      <footer className={`py-3.5 border-t transition-colors text-xs w-full flex-none ${
        theme === 'dark' 
          ? 'bg-[#06070a] border-white/5 text-gray-400' 
          : 'bg-white border-gray-200 text-gray-500'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <span>© {new Date().getFullYear()} <strong>{t.title}</strong>.</span>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
            <span>Created by <a href="https://github.com/Jsooonx" target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${theme === 'dark' ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}>Jsooonx</a></span>
          </div>
          <p className="opacity-85">100% Client-Side Privacy Protection</p>
        </div>
      </footer>
    </div>
  );
};
export default SettingsPage;

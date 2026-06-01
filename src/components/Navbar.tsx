import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { getTranslation } from '../constants/translations';
import { Camera, Sun, Moon, Languages, Menu, X, Sliders, RefreshCw, FileImage, User, Sparkles, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const toolIcons: Record<string, React.ReactNode> = {
  resize: <Sliders className="w-5 h-5 text-purple-400" />,
  convert: <RefreshCw className="w-5 h-5 text-cyan-400" />,
  compress: <FileImage className="w-5 h-5 text-emerald-400" />,
  passport: <User className="w-5 h-5 text-amber-400" />,
  'bg-remover': <Sparkles className="w-5 h-5 text-pink-400" />,
};

const toolKeys = ['resize', 'convert', 'compress', 'passport', 'bg-remover'] as const;

const navKeyMap: Record<string, keyof ReturnType<typeof getTranslation>['navbar']> = {
  resize: 'resize',
  convert: 'convert',
  compress: 'compress',
  passport: 'passport',
  'bg-remover': 'bgRemover',
};

const navLinkVariants: any = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' },
  }),
  exit: (i: number) => ({
    opacity: 0,
    x: -20,
    transition: { delay: (toolKeys.length - i) * 0.04, duration: 0.2, ease: 'easeIn' },
  }),
};

const overlayVariants: any = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const panelVariants: any = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.06, delayChildren: 0.1 } },
  exit: { x: '100%', transition: { type: 'spring', stiffness: 300, damping: 30, staggerChildren: 0.04, staggerDirection: -1 } },
};

interface NavbarProps {
  isScrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const { activeTab, activeTool, theme, settings, setTheme, setSettings } = useImageStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = getTranslation(settings.language);

  const showGlassHeader = activeTab !== 'landing' || isScrolled;

  const toggleLanguage = () => {
    setSettings({ language: settings.language === 'id' ? 'en' : 'id' });
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeColor = !showGlassHeader ? 'text-white' : theme === 'dark' ? 'text-white' : 'text-gray-900';
  const inactiveColor = !showGlassHeader ? 'text-white/80 hover:text-white' : theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black';
  const pillActive = !showGlassHeader ? 'bg-white/10' : theme === 'dark' ? 'bg-white/10' : 'bg-black/5';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b ${
      showGlassHeader
        ? theme === 'dark'
          ? 'glass-nav bg-[#0a0b0f]/80 border-white/5 shadow-lg'
          : 'glass-nav-light bg-white/85 border-black/5 shadow-sm'
        : 'bg-transparent border-transparent shadow-none'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <div className={`p-1.5 rounded-lg flex items-center justify-center transition-colors ${
            !showGlassHeader
              ? 'bg-white/10 group-hover:bg-white/20'
              : theme === 'dark' ? 'bg-white/10 group-hover:bg-white/20' : 'bg-black/5 group-hover:bg-black/10'
          }`}>
            <Camera className="w-5 h-5 text-purple-500" />
          </div>
          <span className="font-outfit text-lg sm:text-xl font-extrabold tracking-tight">
            <span className="text-purple-500">Photo</span>
            <span className={`transition-colors ${activeColor}`}>Toolkit</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link to="/"
            className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer ${activeTab === 'landing' ? `${pillActive} ${activeColor}` : inactiveColor}`}>
            {t.navbar.landing}
          </Link>
          {toolKeys.map((key) => {
            const mappedTool = key === 'bg-remover' ? 'bgRemover' : key;
            return (
              <Link key={key} to={`/${key}`}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors cursor-pointer ${
                  activeTab === 'dashboard' && activeTool === mappedTool ? `${pillActive} ${activeColor}` : inactiveColor
                }`}>
                {t.navbar[navKeyMap[key]]}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Language Switcher */}
          <button onClick={toggleLanguage} title={t.navbar.settings}
            className={`p-2 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
              !showGlassHeader ? 'hover:bg-white/10 text-white/80 hover:text-white' : theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-700'
            }`}>
            <Languages className="w-4 h-4" />
            <span className="hidden sm:inline">{settings.language.toUpperCase()}</span>
          </button>

          {/* Theme Toggle */}
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              !showGlassHeader ? 'hover:bg-white/10 text-white/80 hover:text-white' : theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-700'
            }`}>
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Settings (desktop only) */}
          {activeTab === 'dashboard' && (
            <Link to="/settings"
              className={`hidden md:block px-4 py-2 text-sm font-semibold rounded-full cursor-pointer transition-colors ${
                theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
              }`}>
              {t.navbar.settings}
            </Link>
          )}

          {/* Hamburger / Close */}
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-full transition-colors cursor-pointer ${
              !showGlassHeader ? 'hover:bg-white/10 text-white' : theme === 'dark' ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-black/5 text-gray-700'
            }`}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          >
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className={`absolute top-0 right-0 w-72 h-[calc(100vh-4rem)] overflow-y-auto ${
                theme === 'dark' ? 'bg-[#0f1017]' : 'bg-white'
              }`}
            >
              <div className="px-6 py-6 flex flex-col gap-2">
                {/* Landing link */}
                <motion.div
                  variants={navLinkVariants}
                  custom={0}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer block ${
                      activeTab === 'landing'
                        ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
                        : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/3'
                    }`}>
                    🏠&ensp;{t.navbar.landing}
                  </Link>
                </motion.div>

                {/* Tool links */}
                {toolKeys.map((key, i) => {
                  const mappedTool = key === 'bg-remover' ? 'bgRemover' : key;
                  const isToolActive = activeTab === 'dashboard' && activeTool === mappedTool;
                  return (
                    <motion.div
                      key={key}
                      variants={navLinkVariants}
                      custom={i + 1}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <Link
                        to={`/${key}`}
                        onClick={() => setMobileOpen(false)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 cursor-pointer ${
                          isToolActive
                            ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
                            : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/3'
                        }`}>
                        {toolIcons[key]}
                        {t.navbar[navKeyMap[key]]}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Settings link (mobile) */}
                <motion.div variants={navLinkVariants} custom={toolKeys.length + 1} initial="hidden" animate="visible" exit="exit"
                  className="pt-2 mt-2 border-t border-white/10 dark:border-white/5">
                  <Link
                    to="/settings"
                    onClick={() => setMobileOpen(false)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center gap-3 cursor-pointer ${
                      activeTab === 'settings'
                        ? theme === 'dark' ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
                        : theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-black hover:bg-black/3'
                    }`}>
                    <Settings className="w-5 h-5 text-gray-400" />
                    {t.navbar.settings}
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

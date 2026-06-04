import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useImageStore } from '../store/imageStore';
import { getTranslation } from '../constants/translations';
import { 
  ArrowUpRight, 
  Sliders, 
  RefreshCw, 
  FileImage, 
  User, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CloudLightning,
  Star,
  Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import assets
import heroBgHuman from '../assets/hero_bg_human.png';
import heroBefore from '../assets/hero_before.png';
import heroAfter from '../assets/hero_after.png';
import monochromePortrait from '../assets/monochrome_portrait.png';
import logoImg from '../assets/Phototoolkit-logo.png';

export const LandingPage: React.FC = () => {
  const { theme, settings } = useImageStore();
  const t = getTranslation(settings.language);
  const navigate = useNavigate();

  // Sync metadata for Home page
  useEffect(() => {
    const titleText = settings.language === 'id'
      ? 'PhotoToolkit - Editor & Konverter Gambar All-in-One Gratis'
      : 'PhotoToolkit - Free All-in-One Client-Side Image Editor';
    const descText = t.description;

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
  }, [settings.language, t.description]);

  // Accordion FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroSliderPos, setHeroSliderPos] = useState(50);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleStartEditing = (tool: any) => {
    navigate(`/${tool}`);
  };

  const featureList = [
    {
      id: 'resize',
      icon: <Sliders className="w-6 h-6 text-purple-400" />,
      title: t.features.resize,
      desc: t.features.resizeDesc,
    },
    {
      id: 'convert',
      icon: <RefreshCw className="w-6 h-6 text-cyan-400" />,
      title: t.features.convert,
      desc: t.features.convertDesc,
    },
    {
      id: 'compress',
      icon: <FileImage className="w-6 h-6 text-emerald-400" />,
      title: t.features.compress,
      desc: t.features.compressDesc,
    },
    {
      id: 'passport',
      icon: <User className="w-6 h-6 text-amber-400" />,
      title: t.features.passport,
      desc: t.features.passportDesc,
    },
    {
      id: 'bg-remover',
      icon: <Sparkles className="w-6 h-6 text-pink-400" />,
      title: t.features.bgRemover,
      desc: t.features.bgRemoverDesc,
    },
  ];

  const faqList = [
    { q: t.faq.q1, a: t.faq.a1 },
    { q: t.faq.q2, a: t.faq.a2 },
    { q: t.faq.q3, a: t.faq.a3 },
    { q: t.faq.q4, a: t.faq.a4 },
  ];

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. Hero Section (Styled from Reference Image) */}
      <section 
        className="relative min-h-screen lg:h-screen flex items-center justify-center overflow-hidden bg-cover bg-center pt-24 pb-16 lg:py-0"
        style={{ backgroundImage: `url(${heroBgHuman})` }}
      >
        {/* Dark overlay to match reference visual weight */}
        <div className={`absolute inset-0 z-0 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-black/85 via-black/60 to-black/80 lg:to-transparent' 
            : 'bg-gradient-to-r from-black/75 via-black/55 to-black/70 lg:to-transparent'
        }`} />

        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left">
          
          {/* Left Column: Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Tagline line with horizontal line accent */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-10 h-[1.5px] bg-white/40" />
              <span className="font-outfit text-xs md:text-sm tracking-wider uppercase font-semibold text-gray-300">
                {t.hero.badge}
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-outfit text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] text-white mb-6"
            >
              {t.hero.heading}
            </motion.h1>

            {/* Subheading description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl font-medium max-w-xl mb-10 leading-relaxed text-gray-300"
            >
              {t.description}
            </motion.p>

            {/* Capsule CTA Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-14"
            >
              <Link
                to="/resize"
                className="group flex items-center gap-2.5 px-6 py-3.5 text-base font-bold rounded-full shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-98 bg-white text-black hover:bg-gray-100 hover:shadow-white/5"
              >
                <span>{t.startNow}</span>
                <div className="p-1 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 bg-black text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>

            {/* Social Proof (Stars + count) */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col gap-1 items-start border-l-2 pl-4 border-purple-500/50"
            >
              <div className="flex gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-current" />
                ))}
              </div>
              <span className="text-xs md:text-sm font-semibold tracking-wide text-gray-400">
                {t.reviews}
              </span>
            </motion.div>
          </div>

          {/* Right Column: Interactive Before/After Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 w-full flex justify-center"
          >
            <div className="relative w-full max-w-[320px] sm:max-w-[340px] aspect-[3/4] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-md group select-none">
              
              {/* After: Clean Blue Background Cutout */}
              <img 
                src={heroAfter} 
                alt="After professional passport" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Before: Natural Background (Clipped) */}
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ width: `${heroSliderPos}%` }}
              >
                <img 
                  src={heroBefore} 
                  alt="Before casual portrait" 
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
              </div>

              {/* Slider bar line */}
              <div 
                className="absolute top-0 bottom-0 w-[2px] bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)] pointer-events-none z-10"
                style={{ left: `${heroSliderPos}%` }}
              >
                {/* Handle circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-2xl border border-purple-500 font-bold pointer-events-none text-sm">
                  ↔
                </div>
              </div>

              {/* Invisible slider input for dragging */}
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={heroSliderPos} 
                onChange={(e) => setHeroSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              />

              {/* Labels */}
              <div className="absolute bottom-4 left-4 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded bg-black/60 text-white z-30 pointer-events-none">
                {t.hero.beforeLabel}
              </div>
              <div className="absolute bottom-4 right-4 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded bg-purple-600/90 text-white z-30 pointer-events-none">
                {t.hero.afterLabel}
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Features Grid Section */}
      <section className={`py-24 px-6 md:px-12 relative transition-colors ${
        theme === 'dark' ? 'bg-[#0b0c10]' : 'bg-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`font-outfit text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-[#2c2b29]'
            }`}>
              {t.features.title}
            </h2>
            <p className={`text-sm md:text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {featureList.map((feat, index) => (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                onClick={() => handleStartEditing(feat.id)}
                className={`p-6 rounded-2xl cursor-pointer relative group transition-colors duration-300 overflow-hidden ${
                  theme === 'dark' 
                    ? 'glass-card border-white/5 hover:border-purple-500/30 bg-[#12131a]/40 hover:bg-[#151722]/60 shadow-md hover:shadow-purple-500/5 hover:shadow-lg' 
                    : 'glass-card-light border-black/5 hover:border-purple-500/20 bg-white hover:bg-white/80 shadow-sm hover:shadow-purple-500/5 hover:shadow-md'
                }`}
              >
                {/* Decorative hover gradient border overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-purple-500/0 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Animated glow blob behind icon on hover */}
                <div className={`absolute top-4 left-4 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-15 transition-all duration-500`}
                  style={{ background: `radial-gradient(circle, currentColor 0%, transparent 70%)` }}
                />
                
                <motion.div
                  whileHover={{ rotate: [0, -4, 4, 0], scale: 1.08 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center transition-colors duration-300 relative ${
                    theme === 'dark' 
                      ? 'bg-white/5 group-hover:bg-white/10' 
                      : 'bg-black/5 group-hover:bg-black/10'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md`}
                    style={{ background: 'inherit' }}
                  />
                  {feat.icon}
                </motion.div>

                <h3 className={`font-outfit text-lg font-bold mb-3 flex items-center gap-1.5 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  <span>{feat.title}</span>
                  <motion.span
                    initial={{ opacity: 0, x: -4, y: 4 }}
                    whileInView={{ opacity: 0 }}
                    whileHover={{ opacity: 1, x: 2, y: -2 }}
                    transition={{ duration: 0.3 }}
                    className="inline-flex"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.span>
                </h3>

                <p className={`text-xs sm:text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {feat.desc}
                </p>

                {/* Resize Visual Example */}
                {feat.id === 'resize' && (
                  <div className="mt-5 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between gap-2 transition-colors">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-20 h-12 rounded border-2 border-dashed border-purple-400/60 dark:border-purple-500/40 bg-purple-500/10 flex items-center justify-center text-[10px] text-purple-600 dark:text-purple-400 font-bold">
                        1920 x 1080
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Original Size</span>
                    </div>
                    
                    <span className="text-purple-500 text-sm font-bold">➔</span>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-14 h-10 rounded border-2 border-purple-500 bg-purple-500/20 flex items-center justify-center text-[10px] text-purple-700 dark:text-purple-300 font-bold">
                        800 x 600
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Resized</span>
                    </div>
                  </div>
                )}

                {/* Passport Visual Example */}
                {feat.id === 'passport' && (
                  <div className="mt-5 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between gap-2 transition-colors">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-16 rounded overflow-hidden border border-black/10 dark:border-white/10 bg-black/20">
                        <img src={heroBefore} alt="Before passport" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t.hero.originalMessy}</span>
                    </div>
                    
                    <span className="text-amber-500 text-sm font-bold">➔</span>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-16 rounded overflow-hidden border-2 border-amber-500 bg-[#3b82f6]">
                        <img src={heroAfter} alt="After passport" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t.hero.passportPhoto}</span>
                    </div>
                  </div>
                )}

                {/* BG Remover Visual Example */}
                {feat.id === 'bg-remover' && (
                  <div className="mt-5 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-between gap-2 transition-colors">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-16 rounded overflow-hidden border border-black/10 dark:border-white/10 bg-black/20">
                        <img src={heroBefore} alt="Before background remover" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t.hero.withBackground}</span>
                    </div>
                    
                    <span className="text-pink-500 text-sm font-bold">➔</span>
                    
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-12 h-16 rounded overflow-hidden border-2 border-pink-500 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] bg-[size:8px_8px] bg-gray-100 dark:bg-gray-900">
                        <img 
                          src={heroAfter} 
                          alt="After background remover" 
                          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-screen opacity-90" 
                        />
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">{t.hero.transparent}</span>
                    </div>
                  </div>
                )}

                {/* Compressor Text Metrics Example */}
                {feat.id === 'compress' && (
                  <div className="mt-5 p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex flex-col gap-2.5 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Before</span>
                        <span className="font-mono font-bold text-gray-600 dark:text-gray-300">4.8 MB</span>
                      </div>
                      
                      <span className="text-emerald-500 text-sm font-bold">➔</span>
                      
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">After</span>
                        <span className="font-mono font-bold text-emerald-500">960 KB</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg py-1.5 text-center text-xs font-bold">
                      Reduced by 80% (Visual Quality Intact)
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className={`py-24 px-6 md:px-12 transition-colors border-t border-b ${
        theme === 'dark' ? 'bg-[#08090d] border-white/5' : 'bg-[#fcfbf9] border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          {/* Left-aligned header to match reference style */}
          <div className="text-left max-w-3xl mb-16">
            <span className="text-xs font-bold tracking-widest text-[#a97b56] uppercase block mb-3">
              [ HOW IT WORKS ]
            </span>
            <h2 className={`font-outfit text-3xl md:text-5xl font-extrabold tracking-tight leading-tight ${
              theme === 'dark' ? 'text-white' : 'text-[#2c2b29]'
            }`}>
              {settings.language === 'id' ? 'Proses instan tanpa upload untuk edit gambar Anda' : 'Simple client-side process to edit your images instantly'}
            </h2>
          </div>

          {/* 4-Card Grid matching reference layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Monochrome portrait card */}
            <div className="relative rounded-[28px] overflow-hidden group shadow-xl h-[380px] flex-shrink-0">
              <img 
                src={monochromePortrait} 
                alt="Portrait" 
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/5" />
              <span className="absolute top-6 left-6 font-outfit text-white font-extrabold text-lg tracking-tight">PhotoToolkit®</span>
              <span className="absolute bottom-6 right-6 text-white/40 text-xs font-semibold">Since 2026</span>
            </div>

            {/* Card 2: Step 1 (Upload) */}
            <div className={`rounded-[28px] border p-6 flex flex-col justify-between h-[380px] transition-all hover:shadow-lg ${
              theme === 'dark' ? 'bg-[#0f1015]/60 border-white/5' : 'bg-white border-[#edebe6]'
            }`}>
              <div className="flex flex-col items-start">
                {/* Visual block: Avatar row + Stars */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex -space-x-2.5">
                    <div className="flex h-8 w-8 rounded-full border-2 border-white dark:border-[#0f1015] bg-gradient-to-tr from-purple-500 to-indigo-500 items-center justify-center shadow-sm">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex h-8 w-8 rounded-full border-2 border-white dark:border-[#0f1015] bg-gradient-to-tr from-cyan-500 to-blue-500 items-center justify-center shadow-sm">
                      <Camera className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="flex h-8 w-8 rounded-full border-2 border-white dark:border-[#0f1015] bg-gradient-to-tr from-emerald-500 to-teal-500 items-center justify-center shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div className="flex gap-0.5 ml-2 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  100% Privacy Secure
                </span>
              </div>
              <div>
                <h3 className={`font-outfit text-xl font-bold mb-2.5 ${theme === 'dark' ? 'text-white' : 'text-[#2c2b29]'}`}>
                  {t.howItWorks.step1}
                </h3>
                <p className={`text-xs leading-relaxed font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-[#706c64]'}`}>
                  {t.howItWorks.step1Desc}
                </p>
              </div>
            </div>

            {/* Card 3: Step 2 (Process) */}
            <div className={`group rounded-[28px] border p-6 flex flex-col justify-between h-[380px] transition-all hover:shadow-lg ${
              theme === 'dark' ? 'bg-[#0f1015]/60 border-white/5' : 'bg-white border-[#edebe6]'
            }`}>
              <div className="flex flex-col items-start w-full">
                <div className="text-4xl font-extrabold font-outfit text-[#a97b56] leading-none mb-1">0ms</div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-3">No Server Latency</span>
                
                {/* Signal bar chart with stagger glow on hover, fade out on leave */}
                <div className="flex items-end gap-1 h-12 w-full pt-2">
                  {[20, 25, 30, 28, 35, 40, 48, 42, 55, 62, 70, 65, 80, 88, 100].map((h, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 rounded-full bg-[#a97b56]/20 dark:bg-[#a97b56]/30 signal-bar-glow" 
                      style={{ height: `${h}%`, opacity: 0.2 + (i * 0.05), transitionDelay: `${i * 0.05}s` }} 
                    />
                  ))}
                </div>
              </div>
              <div>
                <h3 className={`font-outfit text-xl font-bold mb-2.5 ${theme === 'dark' ? 'text-white' : 'text-[#2c2b29]'}`}>
                  {t.howItWorks.step2}
                </h3>
                <p className={`text-xs leading-relaxed font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-[#706c64]'}`}>
                  {t.howItWorks.step2Desc}
                </p>
              </div>
            </div>

            {/* Card 4: Step 3 (Download) */}
            <div className={`rounded-[28px] border p-6 flex flex-col justify-between h-[380px] relative overflow-hidden transition-all hover:shadow-lg ${
              theme === 'dark' ? 'bg-[#0f1015]/60 border-white/5' : 'bg-white border-[#edebe6]'
            }`}>
              <div className="flex flex-col items-start">
                <div className="text-4xl font-extrabold font-outfit text-purple-500 leading-none mb-1">ZIP</div>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Instant Bulk Export</span>
              </div>
              
              {/* Curved lines vector decoration in bottom right */}
              <svg className={`absolute bottom-6 right-6 w-20 h-20 opacity-15 pointer-events-none ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M100,0 C44.77,0 0,44.77 0,100" />
                <path d="M100,20 C55.82,20 20,55.82 20,100" />
                <path d="M100,40 C66.86,40 40,66.86 40,100" />
              </svg>

              <div className="relative z-10">
                <h3 className={`font-outfit text-xl font-bold mb-2.5 ${theme === 'dark' ? 'text-white' : 'text-[#2c2b29]'}`}>
                  {t.howItWorks.step3}
                </h3>
                <p className={`text-xs leading-relaxed font-semibold ${theme === 'dark' ? 'text-gray-400' : 'text-[#706c64]'}`}>
                  {t.howItWorks.step3Desc}
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className={`py-24 px-6 md:px-12 transition-colors ${
        theme === 'dark' ? 'bg-[#0a0b0f]' : 'bg-white'
      }`}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-purple-500 uppercase block mb-3">
              FAQ
            </span>
            <h2 className={`font-outfit text-3xl md:text-5xl font-extrabold tracking-tight ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {settings.language === 'id' ? 'Semua yang perlu Anda ketahui' : 'Everything you need to know'}
            </h2>
          </div>

          <div className="flex flex-col border-t border-gray-200 dark:border-white/10">
            {faqList.map((faq, index) => (
              <div 
                key={index}
                className="border-b border-gray-200 dark:border-white/10"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full py-6 flex items-center justify-between text-left transition-colors cursor-pointer ${
                    theme === 'dark' ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'
                  }`}
                >
                  <span className="font-outfit text-base md:text-lg font-medium leading-snug">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-4 ${
                    theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <motion.div
                      animate={{ rotate: openFaq === index ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="w-4 h-4 relative flex items-center justify-center"
                    >
                      <span className="absolute w-3.5 h-[1.5px] bg-current rounded-full" />
                      <span className="absolute w-[1.5px] h-3.5 bg-current rounded-full" />
                    </motion.div>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className={`pb-6 text-sm sm:text-base leading-relaxed ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        <div className="pr-12 text-sm">{faq.a}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust Badges & Call to Action Footer Accent */}
      <section className={`py-16 px-6 md:px-12 text-center transition-colors border-t ${
        theme === 'dark' ? 'bg-[#06070a] border-white/5' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-gray-500 dark:text-gray-400 text-xs sm:text-sm font-semibold mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>100% Client-Side Privacy</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-500" />
              <span>Instant Webassembly Speed</span>
            </div>
            <div className="flex items-center gap-2">
              <CloudLightning className="w-5 h-5 text-purple-500" />
              <span>No Registration Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Redesigned Large Footer matching reference */}
      <footer className={`py-12 px-6 md:px-12 transition-colors text-sm w-full ${
        theme === 'dark' 
          ? 'bg-[#06070a] border-t border-white/5 text-gray-400' 
          : 'bg-[#fbfaf7] border-t border-[#edebe6] text-[#2c2b29]'
      }`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-left mb-10">
          
          {/* Column 1: Navigation */}
          <div className="flex flex-col items-start">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#a97b56] mb-4">
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5 font-semibold text-sm">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                {t.navbar.landing}
              </button>
              <button 
                onClick={() => handleStartEditing('resize')} 
                className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                {t.navbar.resize}
              </button>
              <button 
                onClick={() => handleStartEditing('convert')} 
                className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                {t.navbar.convert}
              </button>
              <button 
                onClick={() => handleStartEditing('compress')} 
                className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                {t.navbar.compress}
              </button>
            </div>
          </div>

          {/* Column 2: Pages/Features */}
          <div className="flex flex-col items-start">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#a97b56] mb-4">
              Pages
            </h4>
            <div className="flex flex-col gap-2.5 font-semibold text-sm">
              <button 
                onClick={() => handleStartEditing('passport')} 
                className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                {t.navbar.passport}
              </button>
              <button 
                onClick={() => handleStartEditing('bg-remover')} 
                className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                {t.navbar.bgRemover}
              </button>
              <button 
                onClick={() => { navigate('/settings'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                className={`transition-colors cursor-pointer text-left ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                {t.navbar.settings}
              </button>
            </div>
          </div>

          {/* Column 3: Socials */}
          <div className="flex flex-col items-start">
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-[#a97b56] mb-4">
              Socials
            </h4>
            <div className="flex flex-col gap-2.5 font-semibold text-sm">
              <a 
                href="https://github.com/Jsooonx" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`transition-colors flex items-center gap-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-[#2c2b29] hover:text-[#a97b56]'}`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 19 19">
                  <path fillRule="evenodd" d="M9.356 1.85C5.05 1.85 1.57 5.356 1.57 9.694a7.84 7.84 0 0 0 5.324 7.44c.387.079.528-.168.528-.376 0-.182-.013-.805-.013-1.454-2.165.467-2.616-.935-2.616-.935-.349-.91-.864-1.143-.864-1.143-.71-.48.051-.48.051-.48.787.051 1.2.805 1.2.805.695 1.194 1.817.857 2.268.649.064-.507.27-.857.49-1.052-1.728-.182-3.545-.857-3.545-3.87 0-.857.31-1.558.8-2.104-.078-.195-.349-1 .077-2.078 0 0 .657-.208 2.14.805a7.5 7.5 0 0 1 1.946-.26c.657 0 1.328.092 1.946.26 1.483-1.013 2.14-.805 2.14-.805.426 1.078.155 1.883.078 2.078.502.546.799 1.247.799 2.104 0 3.013-1.818 3.675-3.558 3.87.284.247.528.714.528 1.454 0 1.052-.012 1.896-.012 2.156 0 .208.142.455.528.377a7.84 7.84 0 0 0 5.324-7.441c.013-4.338-3.48-7.844-7.773-7.844" clipRule="evenodd"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>

          {/* Column 4: Brand Intro (Minimalist replacement for subscribe) */}
          <div className="flex flex-col items-start max-w-xs">
            <div className="flex items-center gap-2 mb-3">
              <img src={logoImg} className="w-6 h-6 object-contain" alt="PhotoToolkit Logo" />
              <span className={`font-outfit font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-[#2c2b29]'}`}>
                Photo<span className="text-purple-500">Toolkit</span>
              </span>
            </div>
            <p className={`text-xs leading-relaxed font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-[#706c64]'}`}>
              {t.description}
            </p>
          </div>

        </div>

        {/* Bottom row line */}
        <div className={`border-t pt-6 flex flex-col sm:flex-row justify-between items-center text-xs font-semibold gap-4 ${
          theme === 'dark' ? 'border-white/5 text-gray-500' : 'border-[#edebe6] text-[#706c64]'
        }`}>
          <div>Made by Jsooonx</div>
          <div>2026 © All right reserved</div>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;

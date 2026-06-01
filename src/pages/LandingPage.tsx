import React, { useState } from 'react';
import { useImageStore } from '../store/imageStore';
import { getTranslation } from '../constants/translations';
import { 
  ArrowUpRight, 
  ChevronDown, 
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

export const LandingPage: React.FC = () => {
  const { theme, settings, setActiveTab, setActiveTool } = useImageStore();
  const t = getTranslation(settings.language);

  // Accordion FAQ states
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [heroSliderPos, setHeroSliderPos] = useState(50);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleStartEditing = (tool: any) => {
    setActiveTab('dashboard');
    setActiveTool(tool);
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
              <button
                onClick={() => setActiveTab('dashboard')}
                className="group flex items-center gap-2.5 px-6 py-3.5 text-base font-bold rounded-full shadow-2xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-98 bg-white text-black hover:bg-gray-100 hover:shadow-white/5"
              >
                <span>{t.startNow}</span>
                <div className="p-1 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 bg-black text-white">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
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
            <h2 className={`font-outfit text-3xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
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
        theme === 'dark' ? 'bg-[#08090d] border-white/5' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className={`font-outfit text-3xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.howItWorks.title}
            </h2>
            <p className={`text-sm md:text-base ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Dashed connector line */}
            <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-[1.5px] border-t border-dashed border-purple-500/30 z-0" />

            {/* Step 1 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-outfit text-xl font-bold mb-6">
                1
              </div>
              <h3 className={`font-outfit text-lg font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t.howItWorks.step1}
              </h3>
              <p className={`text-xs sm:text-sm max-w-xs leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.howItWorks.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center font-outfit text-xl font-bold mb-6">
                2
              </div>
              <h3 className={`font-outfit text-lg font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t.howItWorks.step2}
              </h3>
              <p className={`text-xs sm:text-sm max-w-xs leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.howItWorks.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-outfit text-xl font-bold mb-6">
                3
              </div>
              <h3 className={`font-outfit text-lg font-bold mb-3 ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {t.howItWorks.step3}
              </h3>
              <p className={`text-xs sm:text-sm max-w-xs leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {t.howItWorks.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Section */}
      <section className={`py-24 px-6 md:px-12 transition-colors ${
        theme === 'dark' ? 'bg-[#0a0b0f]' : 'bg-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className={`font-outfit text-3xl md:text-5xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {t.faq.title}
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqList.map((faq, index) => (
              <div 
                key={index}
                className={`rounded-2xl border transition-all ${
                  theme === 'dark' 
                    ? 'border-white/5 bg-[#12131a]/30' 
                    : 'border-black/5 bg-white'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className={`w-full px-6 py-5 flex items-center justify-between text-left font-semibold transition-colors cursor-pointer ${
                    theme === 'dark' ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-500'
                  }`}
                >
                  <span className="font-outfit text-sm md:text-base">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 opacity-60" />
                  </motion.div>
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
                      <div className={`px-6 pb-6 text-xs sm:text-sm leading-relaxed border-t ${
                        theme === 'dark' ? 'text-gray-400 border-white/5' : 'text-gray-600 border-gray-100'
                      }`}>
                        <div className="pt-4">{faq.a}</div>
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

      {/* Redesigned Large Footer */}
      <footer className="bg-[#050505] text-gray-400 py-16 border-t border-white/5 transition-colors text-sm w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand/Description Column */}
          <div className="md:col-span-5 flex flex-col items-start text-left">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 cursor-pointer group mb-5"
            >
              <div className="p-1.5 rounded-lg flex items-center justify-center bg-white/10 group-hover:bg-white/20 transition-colors">
                <Camera className="w-5 h-5 text-purple-500" />
              </div>
              <span className="font-outfit text-xl font-extrabold tracking-tight text-white">
                <span>Photo</span>
                <span className="text-white">Toolkit</span>
              </span>
            </button>
            
            <p className="text-sm font-medium text-gray-400 max-w-sm mb-6 leading-relaxed">
              {t.description}
            </p>
            
            <div className="text-xs font-semibold text-gray-500">
              Created by <a href="https://github.com/Jsooonx" target="_blank" rel="noopener noreferrer" className="text-white hover:text-purple-400 underline transition-colors">Jsooonx</a>
            </div>
          </div>
          
          {/* Columns spacer */}
          <div className="hidden md:block md:col-span-1" />

          {/* Sections Column */}
          <div className="md:col-span-3 flex flex-col items-start text-left">
            <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-wider mb-5">
              Sections
            </h4>
            <div className="flex flex-col gap-3.5 text-sm font-medium">
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer">
                {t.navbar.landing}
              </button>
              <button onClick={() => handleStartEditing('resize')} className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer">
                {t.navbar.resize}
              </button>
              <button onClick={() => handleStartEditing('convert')} className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer">
                {t.navbar.convert}
              </button>
              <button onClick={() => handleStartEditing('compress')} className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer">
                {t.navbar.compress}
              </button>
              <button onClick={() => handleStartEditing('passport')} className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer">
                {t.navbar.passport}
              </button>
              <button onClick={() => handleStartEditing('bg-remover')} className="text-left text-gray-400 hover:text-white transition-colors cursor-pointer">
                {t.navbar.bgRemover}
              </button>
            </div>
          </div>

          {/* Socials Column */}
          <div className="md:col-span-2 flex flex-col items-start text-left">
            <h4 className="font-outfit text-xs font-bold text-white uppercase tracking-wider mb-5">
              Socials
            </h4>
            <div className="flex flex-col gap-3.5 text-sm font-medium">
              <a href="https://github.com/Jsooonx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                GitHub
              </a>
              <span className="text-gray-600 select-none">Twitter</span>
              <span className="text-gray-600 select-none">Instagram</span>
              <span className="text-gray-600 select-none">TikTok</span>
            </div>
          </div>

          {/* CTA Button Column */}
          <div className="md:col-span-1 flex items-start justify-end md:justify-start">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="group flex items-center gap-2 px-4.5 py-2.5 text-xs font-bold rounded-full bg-white text-black hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95 whitespace-nowrap cursor-pointer shadow-xl"
            >
              <span>Launch App</span>
              <div className="p-0.5 rounded-full flex items-center justify-center transition-transform group-hover:rotate-45 bg-black text-white">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
          
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} {t.title}. All rights reserved.</p>
          <p className="opacity-80">100% Client-Side Privacy Protection</p>
        </div>
      </footer>
    </div>
  );
};
export default LandingPage;

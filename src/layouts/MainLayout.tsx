import React from 'react';
import { useImageStore } from '../store/imageStore';
import { Navbar } from '../components/Navbar';
import { Toaster } from 'sonner';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { activeTab, theme } = useImageStore();

  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      setIsScrolled(scrollTop > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#0a0b0f] text-gray-100' : 'bg-gray-50 text-gray-800'
    }`}>
      {/* Dynamic Background Gradients */}
      <div className="absolute top-0 left-0 right-0 h-[600px] overflow-hidden pointer-events-none -z-10">
        <div className={`absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full blur-[160px] opacity-20 ${
          theme === 'dark' ? 'bg-[#a855f7]' : 'bg-[#c084fc]'
        } animate-pulse-slow`} />
        <div className={`absolute top-[-10%] right-[-10%] w-[55%] aspect-square rounded-full blur-[180px] opacity-20 ${
          theme === 'dark' ? 'bg-[#06b6d4]' : 'bg-[#22d3ee]'
        } animate-pulse-slow`} style={{ animationDelay: '-4s' }} />
      </div>

      {/* Navbar */}
      <Navbar isScrolled={isScrolled} />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col relative w-full transition-all duration-500 ${
        activeTab === 'landing' ? 'pt-0' : 'pt-16'
      }`}>
        {children}
      </main>



      {/* Toasts */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
};
export default MainLayout;

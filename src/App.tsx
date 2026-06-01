import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useImageStore } from './store/imageStore';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { setActiveTab, setActiveTool } = useImageStore();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setActiveTab('landing');
    } else if (path === '/settings') {
      setActiveTab('settings');
    } else if (path === '/resize') {
      setActiveTab('dashboard');
      setActiveTool('resize');
    } else if (path === '/convert') {
      setActiveTab('dashboard');
      setActiveTool('convert');
    } else if (path === '/compress') {
      setActiveTab('dashboard');
      setActiveTool('compress');
    } else if (path === '/passport') {
      setActiveTab('dashboard');
      setActiveTool('passport');
    } else if (path === '/bg-remover') {
      setActiveTab('dashboard');
      setActiveTool('bg-remover');
    }
  }, [location.pathname, setActiveTab, setActiveTool]);

  const pageVariants = {
    initial: { opacity: 0, y: 10, scale: 0.995 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 0.995 },
  };

  const pageTransition = { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
                className="flex-1 flex flex-col"
              >
                <LandingPage />
              </motion.div>
            }
          />
          <Route
            path="/settings"
            element={
              <motion.div
                initial="initial"
                animate="animate"
                exit="exit"
                variants={pageVariants}
                transition={pageTransition}
                className="flex-1 flex flex-col"
              >
                <SettingsPage />
              </motion.div>
            }
          />
          {[
            '/resize',
            '/convert',
            '/compress',
            '/passport',
            '/bg-remover',
          ].map((path) => (
            <Route
              key={path}
              path={path}
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                  className="flex-1 flex flex-col"
                >
                  <Dashboard />
                </motion.div>
              }
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;

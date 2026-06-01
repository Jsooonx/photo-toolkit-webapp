import { useImageStore } from './store/imageStore';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/Settings';
import { AnimatePresence, motion } from 'framer-motion';

function App() {
  const { activeTab } = useImageStore();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'landing':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            <LandingPage />
          </motion.div>
        );
      case 'dashboard':
        return (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            <Dashboard />
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="flex-1 flex flex-col"
          >
            <SettingsPage />
          </motion.div>
        );
      default:
        return <LandingPage />;
    }
  };

  return (
    <MainLayout>
      <AnimatePresence mode="wait">
        {renderActivePage()}
      </AnimatePresence>
    </MainLayout>
  );
}

export default App;

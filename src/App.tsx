import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AppLayout } from './components/AppLayout';
import { BillInputs } from './components/BillInputs';
import { FoodTable } from './components/FoodTable';
import { SetupModal } from './components/SetupModal';
import { useFoodData } from './hooks/useFoodData';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { foodData, updateFoodData } = useFoodData();
  const [showSetupModal, setShowSetupModal] = useState(!foodData?.setupComplete);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.theme = newTheme;
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newTheme;
    });
  };

  if (!foodData) {
    return (
      <AppLayout theme={theme} onThemeToggle={toggleTheme}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Welcome to FoodSplitter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Split restaurant bills effortlessly with friends
            </p>
            <button
              onClick={() => setShowSetupModal(true)}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout theme={theme} onThemeToggle={toggleTheme}>
      <div className="space-y-8">
        <BillInputs
          tip={foodData.tip}
          tax={foodData.tax}
          onTipChange={(value) => updateFoodData({ ...foodData, tip: value })}
          onTaxChange={(value) => updateFoodData({ ...foodData, tax: value })}
        />
        <FoodTable 
          foodData={foodData} 
          updateFoodData={updateFoodData}
        />
      </div>

      <SetupModal
        show={showSetupModal}
        onClose={() => {
          setShowSetupModal(false);
          updateFoodData({
            ...foodData,
            setupComplete: true
          });
        }}
        foodData={foodData}
        updateFoodData={updateFoodData}
      />

      <ToastContainer
        position="bottom-center"
        theme={theme}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </AppLayout>
  );
}
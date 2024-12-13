import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BillInputs } from './components/BillInputs';
import { SetupModal } from './components/SetupModal';
import { FoodTable } from './components/FoodTable';
import { LandingPage } from './components/LandingPage';
import { useTheme } from './hooks/useTheme';
import { useFoodData } from './hooks/useFoodData';
import { useAppState } from './hooks/useAppState';
import { AppLayout } from './components/AppLayout';
import type { FoodData } from './types';

const initialFoodData: FoodData = {
  id: 1,
  numberOfPeople: 0,
  peopleNames: [],
  items: [],
  tip: '',
  tax: '',
  singlePayer: null,
  setupComplete: false,
  setupStep: 0,
  showLandingPage: true,
  totalBillAmount: 0
};

function InfoModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-2xl w-full m-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-4">About Bill Splitter</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Easy Setup</h3>
            <p className="text-gray-600 dark:text-gray-300">Enter bill details and add people in just a few steps</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Smart Splitting</h3>
            <p className="text-gray-600 dark:text-gray-300">Specify who participated in each item for accurate splitting</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Single Payer Mode (Beta)</h3>
            <p className="text-gray-600 dark:text-gray-300">Handle scenarios where one person pays a larger share</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { theme } = useTheme();
  const { foodData, updateFoodData, resetFoodData } = useFoodData();

  // Sync with persisted state
  useEffect(() => {
    if (foodData) {
      setShowLandingPage(foodData.showLandingPage);
      setShowSetupModal(!foodData.setupComplete && !foodData.showLandingPage);
    }
  }, [foodData]);

  const { tip, tax, handleTipTaxChange, handleNewSplit } = useAppState({ 
    foodData, 
    updateFoodData, 
    resetFoodData, 
    setShowSetupModal,
    setShowLandingPage 
  });

  // Show landing page for new users or when explicitly requested
  if (showLandingPage) {
    return (
      <div className="min-h-screen">
        <AppLayout 
          theme={theme} 
          showNewSplit={false} 
          onNewSplit={handleNewSplit}
          onInfoClick={() => {}}
          showInfoButton={false}
        >
          <LandingPage onStartSplit={() => {
            setShowLandingPage(false);
            setShowSetupModal(true);
            updateFoodData({
              ...initialFoodData,
              showLandingPage: false
            });
          }} />
        </AppLayout>
        <ToastContainer
          position="bottom-center"
          theme={theme}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppLayout 
        theme={theme} 
        showNewSplit={true} 
        onNewSplit={handleNewSplit}
        onInfoClick={() => setShowInfoModal(true)}
        showInfoButton={true}
      >
        <main className="container mx-auto max-w-5xl">
          <BillInputs
            tip={tip}
            tax={tax}
            onTipChange={(value) => handleTipTaxChange(value, 'tip')}
            onTaxChange={(value) => handleTipTaxChange(value, 'tax')}
          />
          <FoodTable 
            foodData={foodData || initialFoodData} 
            updateFoodData={updateFoodData}
          />
        </main>
        <SetupModal
          show={showSetupModal}
          onClose={() => {
            setShowSetupModal(false);
            updateFoodData({
              ...(foodData || initialFoodData),
              setupComplete: true
            });
          }}
          foodData={foodData || initialFoodData}
          updateFoodData={updateFoodData}
        />
        <InfoModal 
          show={showInfoModal}
          onClose={() => setShowInfoModal(false)}
        />
      </AppLayout>
      <ToastContainer
        position="bottom-center"
        theme={theme}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
}
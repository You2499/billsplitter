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

export default function App() {
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const { theme } = useTheme();
  const { foodData, updateFoodData, resetFoodData } = useFoodData();
  
  // Sync with persisted state
  useEffect(() => {
    if (foodData) {
      setShowLandingPage(foodData.setupComplete ? foodData.showLandingPage : true);
      setShowSetupModal(!foodData.setupComplete);
    }
  }, [foodData]);

  const { tip, tax, handleTipTaxChange, handleNewSplit } = useAppState({ 
    foodData, 
    updateFoodData, 
    resetFoodData, 
    setShowSetupModal,
    setShowLandingPage 
  });

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

  // Show landing page for new users or when explicitly requested
  if (!foodData || showLandingPage) {
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
            const newFoodData = {
              ...initialFoodData,
              showLandingPage: false
            };
            updateFoodData(newFoodData);
            setShowLandingPage(false);
            setShowSetupModal(true);
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
        onInfoClick={() => {
          setShowLandingPage(true);
          updateFoodData({
            ...(foodData || initialFoodData),
            showLandingPage: true
          });
        }}
        showInfoButton={!showLandingPage}
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
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import type { FoodData } from '../types';

interface UseAppStateProps {
  foodData: FoodData | null;
  updateFoodData: (data: FoodData) => void;
  resetFoodData: () => void;
  setShowSetupModal: (show: boolean) => void;
  setShowLandingPage: (show: boolean) => void;
}

export function useAppState({ 
  foodData, 
  updateFoodData, 
  resetFoodData, 
  setShowSetupModal,
  setShowLandingPage 
}: UseAppStateProps) {
  const [tip, setTip] = useState('');
  const [tax, setTax] = useState('');

  useEffect(() => {
    if (foodData) {
      setTip(foodData.tip);
      setTax(foodData.tax);
    }
  }, [foodData]);

  const handleTipTaxChange = (value: string, type: 'tip' | 'tax') => {
    if (type === 'tip') setTip(value);
    else setTax(value);
    
    if (foodData) {
      updateFoodData({
        ...foodData,
        [type]: value
      });
    }
  };

  const handleNewSplit = () => {
    toast.info('Starting a new split...', {
      position: "bottom-center",
      autoClose: 2000
    });
    setTip('');
    setTax('');
    setShowLandingPage(false);
    setShowSetupModal(true);
    resetFoodData();
  };

  return {
    tip,
    tax,
    handleTipTaxChange,
    handleNewSplit
  };
}
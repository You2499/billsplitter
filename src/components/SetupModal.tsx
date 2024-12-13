import { useState, useEffect } from 'react';
import { DollarSign, Users, UserCheck, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';
import { SetupStep } from './SetupStep';
import { SinglePayerSetup } from './SinglePayerSetup';
import type { FoodData } from '../types';

interface SetupModalProps {
  show: boolean;
  onClose: () => void;
  foodData: FoodData;
  updateFoodData: (data: FoodData) => void;
}

export function SetupModal({ show, onClose, foodData, updateFoodData }: SetupModalProps) {
  const [step, setStep] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [singlePayerIndex, setSinglePayerIndex] = useState<number>(-1);
  const [singlePayerAmount, setSinglePayerAmount] = useState('');
  const [isSimplified, setIsSimplified] = useState(false);

  useEffect(() => {
    if (show) {
      setStep(foodData.setupStep || 0);
      setTotalBillAmount('');
      setNumberOfPeople('');
      setNames(foodData.peopleNames || []);
      setSinglePayerIndex(foodData.singlePayer?.index ?? -1);
      setSinglePayerAmount(foodData.singlePayer?.amount?.toString() || '');
      setIsSimplified(foodData.singlePayer?.simplified || false);
    }
  }, [show, foodData]);

  useEffect(() => {
    const num = parseInt(numberOfPeople);
    if (!isNaN(num) && num > 0) {
      const newNames = Array(num).fill('');
      setNames(newNames);
    }
  }, [numberOfPeople]);

  const handleNameChange = (index: number, value: string) => {
    const newNames = [...names];
    newNames[index] = value;
    setNames(newNames);
  };

  const handleNext = () => {
    if (step === 0) {
      const amount = parseFloat(totalBillAmount);
      if (!totalBillAmount || isNaN(amount) || amount <= 0) {
        toast.error('Please enter a valid Total Bill Amount');
        return;
      }
      setStep(1);
      updateFoodData({
        ...foodData,
        totalBillAmount: amount,
        setupStep: 1
      });
    } else if (step === 1) {
      const num = parseInt(numberOfPeople);
      if (!numberOfPeople || isNaN(num) || num <= 0) {
        toast.error('Please enter a valid number of people');
        return;
      }
      setStep(2);
      updateFoodData({
        ...foodData,
        numberOfPeople: num,
        peopleNames: names,
        setupStep: 2,
        items: []
      });
    } else if (step === 2) {
      if (names.some(name => !name.trim())) {
        toast.error('Please enter names for all people');
        return;
      }
      setStep(3);
      updateFoodData({
        ...foodData,
        peopleNames: names,
        setupStep: 3
      });
    }
  };

  const handleBack = () => {
    setStep(Math.max(0, step - 1));
  };

  const handleFinalize = () => {
    if (singlePayerIndex !== -1 && !isSimplified && (!singlePayerAmount || parseFloat(singlePayerAmount) <= 0)) {
      toast.error('Please enter a valid single payer amount');
      return;
    }

    updateFoodData({
      ...foodData,
      id: 1,
      numberOfPeople: parseInt(numberOfPeople),
      peopleNames: names,
      totalBillAmount: parseFloat(totalBillAmount),
      items: [],
      tip: '',
      tax: '',
      setupStep: 3,
      setupComplete: true,
      singlePayer: singlePayerIndex === -1 ? null : {
        index: singlePayerIndex,
        amount: parseFloat(singlePayerAmount) || 0,
        simplified: isSimplified
      }
    });
    
    toast.success('Setup completed successfully!');
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full shadow-xl m-4">
        <div className="flex items-center gap-4 mb-6">
          {step === 0 && <DollarSign className="w-8 h-8 text-blue-500" />}
          {step === 1 && <Users className="w-8 h-8 text-blue-500" />}
          {step === 2 && <UserCheck className="w-8 h-8 text-blue-500" />}
          {step === 3 && <CreditCard className="w-8 h-8 text-blue-500" />}
          <div>
            <h2 className="text-2xl font-bold">
              {step === 0 && 'Total Bill Amount'}
              {step === 1 && 'Number of People'}
              {step === 2 && 'Name Each Person'}
              {step === 3 && 'Single Payer Setup (Beta)'}
            </h2>
            {step === 3 && (
              <p className="text-sm text-yellow-500 mt-1">This feature is in beta. Please verify all calculations.</p>
            )}
          </div>
        </div>

        <div className="mb-8">
          <SetupStep
            step={step}
            totalBillAmount={totalBillAmount}
            numberOfPeople={numberOfPeople}
            names={names}
            onTotalBillAmountChange={setTotalBillAmount}
            onNumberOfPeopleChange={setNumberOfPeople}
            onNameChange={handleNameChange}
            onEnterPress={() => step === 3 ? handleFinalize() : handleNext()}
          />

          {step === 3 && (
            <SinglePayerSetup
              names={names}
              singlePayerIndex={singlePayerIndex}
              singlePayerAmount={singlePayerAmount}
              isSimplified={isSimplified}
              onSinglePayerIndexChange={setSinglePayerIndex}
              onSinglePayerAmountChange={setSinglePayerAmount}
              onSimplifiedChange={setIsSimplified}
            />
          )}
        </div>

        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={step === 3 ? handleFinalize : handleNext}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            {step === 3 ? 'Finalize Setup' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
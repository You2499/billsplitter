interface SetupStepProps {
  step: number;
  totalBillAmount: string;
  numberOfPeople: string;
  names: string[];
  onTotalBillAmountChange: (value: string) => void;
  onNumberOfPeopleChange: (value: string) => void;
  onNameChange: (index: number, value: string) => void;
  onEnterPress: () => void;
}

export function SetupStep({
  step,
  totalBillAmount,
  numberOfPeople,
  names,
  onTotalBillAmountChange,
  onNumberOfPeopleChange,
  onNameChange,
  onEnterPress
}: SetupStepProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onEnterPress();
    }
  };

  if (step === 0) {
    return (
      <div className="space-y-4">
        <input
          type="number"
          value={totalBillAmount}
          onChange={(e) => onTotalBillAmountChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          placeholder="Enter total bill amount"
          step="0.01"
          min="0"
          autoFocus
        />
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-4">
        <input
          type="number"
          value={numberOfPeople}
          onChange={(e) => onNumberOfPeopleChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
          placeholder="Enter number of people"
          min="1"
          autoFocus
        />
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
        {names.map((name, index) => (
          <div key={index} className="space-y-1">
            <label htmlFor={`person-${index}`} className="text-sm font-medium">
              Person {index + 1}
            </label>
            <input
              id={`person-${index}`}
              type="text"
              value={name}
              onChange={(e) => onNameChange(index, e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder={`Enter name for Person ${index + 1}`}
              autoFocus={index === 0}
              required
            />
          </div>
        ))}
      </div>
    );
  }

  return null;
}
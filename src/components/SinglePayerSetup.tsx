interface SinglePayerSetupProps {
  names: string[];
  singlePayerIndex: number;
  singlePayerAmount: string;
  isSimplified: boolean;
  onSinglePayerIndexChange: (index: number) => void;
  onSinglePayerAmountChange: (amount: string) => void;
  onSimplifiedChange: (simplified: boolean) => void;
}

export function SinglePayerSetup({
  names,
  singlePayerIndex,
  singlePayerAmount,
  isSimplified,
  onSinglePayerIndexChange,
  onSinglePayerAmountChange,
  onSimplifiedChange
}: SinglePayerSetupProps) {
  return (
    <div className="space-y-4">
      <select
        value={singlePayerIndex}
        onChange={(e) => onSinglePayerIndexChange(parseInt(e.target.value))}
        className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      >
        <option value={-1}>No Single Payer</option>
        {names.map((name, index) => (
          <option key={index} value={index}>
            {name || `Person ${index + 1}`}
          </option>
        ))}
      </select>

      {singlePayerIndex !== -1 && (
        <>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSimplified}
              onChange={(e) => onSimplifiedChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm">
              Simplified Calculation (Only Cover Food Costs)
            </span>
          </label>

          {!isSimplified && (
            <input
              type="number"
              value={singlePayerAmount}
              onChange={(e) => onSinglePayerAmountChange(e.target.value)}
              className="w-full p-3 border dark:border-gray-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter single payer amount"
              step="0.01"
              min="0"
            />
          )}
        </>
      )}
    </div>
  );
}
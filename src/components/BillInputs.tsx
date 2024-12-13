import { motion } from 'framer-motion';

interface BillInputsProps {
  tip: string;
  tax: string;
  onTipChange: (value: string) => void;
  onTaxChange: (value: string) => void;
}

export function BillInputs({ tip, tax, onTipChange, onTaxChange }: BillInputsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4"
    >
      <div className="space-y-2">
        <label htmlFor="tipInput" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Tip Amount
        </label>
        <input
          type="number"
          inputMode="decimal"
          id="tipInput"
          value={tip}
          onChange={(e) => onTipChange(e.target.value)}
          className="w-full px-4 h-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors text-sm"
          placeholder="Enter tip amount"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="taxInput" className="block text-sm font-medium text-gray-600 dark:text-gray-400">
          Tax Amount
        </label>
        <input
          type="number"
          inputMode="decimal"
          id="taxInput"
          value={tax}
          onChange={(e) => onTaxChange(e.target.value)}
          className="w-full px-4 h-12 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors text-sm"
          placeholder="Enter tax amount"
        />
      </div>
    </motion.div>
  );
}
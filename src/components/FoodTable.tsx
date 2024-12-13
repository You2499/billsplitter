import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { FoodData, FoodItem } from '../types';
import { ContributionsModal } from './ContributionsModal';

interface FoodTableProps {
  foodData: FoodData;
  updateFoodData: (data: FoodData) => void;
}

export function FoodTable({ foodData, updateFoodData }: FoodTableProps) {
  const addRow = () => {
    const newItem: FoodItem = {
      item: '',
      price: '',
      contributions: Array(foodData.numberOfPeople).fill('0')
    };

    updateFoodData({
      ...foodData,
      items: [...(foodData.items || []), newItem]
    });
  };

  const updateItem = (index: number, field: keyof FoodItem, value: string | string[]) => {
    const newItems = [...(foodData.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    updateFoodData({
      ...foodData,
      items: newItems
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 space-y-6"
    >
      <div className="overflow-x-auto rounded-lg bg-white dark:bg-gray-800 shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-700">
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Item</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Price</th>
              {foodData.peopleNames.map((name, index) => (
                <th
                  key={index}
                  className={`py-3 px-4 text-left text-xs font-medium ${
                    foodData.singlePayer?.index === index 
                      ? 'text-blue-500 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {name || `Person ${index + 1}`}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {foodData.items.map((item, rowIndex) => (
              <tr key={rowIndex}>
                <td className="py-2 px-4">
                  <input
                    type="text"
                    value={item.item}
                    onChange={(e) => updateItem(rowIndex, 'item', e.target.value)}
                    className="w-full bg-transparent text-sm"
                    placeholder="Item name"
                  />
                </td>
                <td className="py-2 px-4">
                  <input
                    type="number"
                    inputMode="decimal"
                    value={item.price}
                    onChange={(e) => updateItem(rowIndex, 'price', e.target.value)}
                    className="w-full bg-transparent text-sm"
                    placeholder="0.00"
                  />
                </td>
                {item.contributions.map((contribution, colIndex) => (
                  <td key={colIndex} className="py-2 px-4">
                    {foodData.singlePayer?.index === colIndex ? (
                      <span className="text-xs text-blue-500 dark:text-blue-400">Single Payer</span>
                    ) : (
                      <select
                        value={contribution}
                        onChange={(e) => {
                          const newContributions = [...item.contributions];
                          newContributions[colIndex] = e.target.value;
                          updateItem(rowIndex, 'contributions', newContributions);
                        }}
                        className="w-full bg-transparent text-sm cursor-pointer pr-8"
                      >
                        <option value="0">No</option>
                        <option value="1">Yes</option>
                      </select>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={addRow}
          className="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </motion.button>
        <ContributionsModal foodData={foodData} />
      </div>
    </motion.div>
  );
}
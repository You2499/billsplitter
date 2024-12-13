import { useState } from 'react';
import { Copy, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { calculateContributions } from '../utils/calculateContributions';
import type { FoodData } from '../types';

interface ContributionsModalProps {
  foodData: FoodData;
}

export function ContributionsModal({ foodData }: ContributionsModalProps) {
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = () => {
    const contributions = calculateContributions(foodData);
    let text = '';

    contributions.forEach((personContributions, index) => {
      const name = foodData.peopleNames[index] || `Person ${index + 1}`;
      const total = personContributions.reduce((acc, c) => acc + c.eachShare, 0);
      
      text += `${name}'s Contribution\n`;
      personContributions.forEach((contribution) => {
        text += `${contribution.item} - $${contribution.eachShare.toFixed(2)}\n`;
      });
      text += `Total: $${total.toFixed(2)}\n\n`;
    });

    navigator.clipboard.writeText(text.trim())
      .then(() => {
        toast.success('Contributions copied to clipboard!', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      })
      .catch(() => {
        toast.error('Failed to copy contributions. Please try again.', {
          position: "bottom-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-medium shadow-lg shadow-blue-500/25 hover:bg-blue-600 transition-colors"
      >
        View Contributions
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Contributions</h2>
              <div className="flex gap-4">
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(90vh-8rem)] overflow-y-auto">
              {calculateContributions(foodData).map((personContributions, index) => {
                const name = foodData.peopleNames[index] || `Person ${index + 1}`;
                const total = personContributions.reduce((acc, c) => acc + c.eachShare, 0);

                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-semibold text-lg mb-3">{name}'s Contributions</h3>
                    <div className="space-y-2">
                      {personContributions.map((contribution, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-300">{contribution.item}</span>
                          <span className="font-medium">${contribution.eachShare.toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t border-gray-200 dark:border-gray-600 mt-3 pt-3 font-semibold flex justify-between">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
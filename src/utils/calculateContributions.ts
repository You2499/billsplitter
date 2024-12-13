import type { FoodData, FoodItem, Contribution } from '../types';

export function calculateItemShare(item: FoodItem, contributors: number): number {
  const price = parseFloat(item.price) || 0;
  return price / contributors;
}

export function calculateContributions(foodData: FoodData): Contribution[][] {
  const { numberOfPeople, items, tip, tax, singlePayer } = foodData;
  const tipAmount = parseFloat(tip) || 0;
  const taxAmount = parseFloat(tax) || 0;
  const totalTipTax = tipAmount + taxAmount;
  const tipTaxPerPerson = totalTipTax / numberOfPeople;
  
  // Initialize contributions array for each person
  const contributions: Contribution[][] = Array.from(
    { length: numberOfPeople },
    () => []
  );

  // Calculate total bill amount from items
  let totalBill = items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);

  // Calculate individual food contributions first
  items.forEach((item) => {
    const contributors = item.contributions
      .map((c, i) => (c === '1' ? i : -1))
      .filter((i) => i !== -1);

    if (contributors.length > 0) {
      const pricePerPerson = calculateItemShare(item, contributors.length);
      contributors.forEach((personIndex) => {
        contributions[personIndex].push({
          item: item.item,
          eachShare: pricePerPerson,
        });
      });
    }
  });

  // Handle single payer logic
  if (singlePayer && singlePayer.index !== null) {
    const singlePayerIndex = singlePayer.index;
    const { amount, simplified } = singlePayer;

    if (simplified) {
      // In simplified mode, single payer covers food costs only
      const singlePayerContribution = amount;
      contributions[singlePayerIndex].push({
        item: 'Single Payer Food Contribution',
        eachShare: singlePayerContribution,
      });

      // Adjust others' contributions proportionally
      const remainingPeople = Array.from(
        { length: numberOfPeople },
        (_, i) => i
      ).filter((i) => i !== singlePayerIndex);

      remainingPeople.forEach((personIndex) => {
        const personTotal = contributions[personIndex].reduce(
          (sum, c) => sum + c.eachShare,
          0
        );
        const adjustment = -personTotal * (amount / totalBill);
        
        contributions[personIndex].push({
          item: 'Single Payer Adjustment',
          eachShare: adjustment,
        });
      });
    } else {
      // Regular mode - single payer contributes specified amount of total bill
      const singlePayerShare = amount;
      const remainingBill = totalBill - singlePayerShare;
      
      // Calculate adjustment factor for other participants
      const adjustmentFactor = remainingBill / totalBill;
      
      // Adjust everyone's contributions except single payer
      for (let i = 0; i < numberOfPeople; i++) {
        if (i !== singlePayerIndex) {
          const originalTotal = contributions[i].reduce(
            (sum, c) => sum + c.eachShare,
            0
          );
          const adjustment = originalTotal * (1 - adjustmentFactor);
          
          contributions[i].push({
            item: 'Single Payer Adjustment',
            eachShare: -adjustment,
          });
        }
      }

      // Add single payer's contribution
      contributions[singlePayerIndex].push({
        item: 'Single Payer Contribution',
        eachShare: singlePayerShare,
      });
    }
  }

  // Add tip and tax contributions for everyone
  for (let i = 0; i < numberOfPeople; i++) {
    contributions[i].push({
      item: 'Tip & Tax',
      eachShare: tipTaxPerPerson,
    });
  }

  return contributions;
}
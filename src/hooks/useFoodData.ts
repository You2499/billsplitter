import { useState, useEffect } from 'react';
import type { FoodData } from '../types';

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

export function useFoodData() {
  const [foodData, setFoodData] = useState<FoodData>(initialFoodData);

  useEffect(() => {
    const request = window.indexedDB.open('FoodSplitterDB', 1);

    request.onerror = () => {
      console.error('Failed to open IndexedDB');
      setFoodData(initialFoodData);
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['foodData'], 'readonly');
      const objectStore = transaction.objectStore('foodData');
      const getRequest = objectStore.get(1);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          setFoodData({
            ...initialFoodData,
            ...getRequest.result,
            showLandingPage: getRequest.result.showLandingPage ?? true,
            totalBillAmount: getRequest.result.totalBillAmount || 0,
            numberOfPeople: getRequest.result.numberOfPeople || 0
          });
        }
      };
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('foodData')) {
        db.createObjectStore('foodData', { keyPath: 'id' });
      }
    };
  }, []);

  const updateFoodData = (newData: FoodData) => {
    const request = window.indexedDB.open('FoodSplitterDB', 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['foodData'], 'readwrite');
      const objectStore = transaction.objectStore('foodData');
      
      const dataToStore = {
        ...initialFoodData,
        ...newData,
        totalBillAmount: newData.totalBillAmount || 0,
        numberOfPeople: newData.numberOfPeople || 0
      };
      
      objectStore.put(dataToStore);
      setFoodData(dataToStore);
    };

    request.onerror = () => {
      console.error('Failed to update IndexedDB');
      setFoodData({
        ...initialFoodData,
        ...newData,
        totalBillAmount: newData.totalBillAmount || 0,
        numberOfPeople: newData.numberOfPeople || 0
      });
    };
  };

  const resetFoodData = () => {
    const request = window.indexedDB.open('FoodSplitterDB', 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['foodData'], 'readwrite');
      const objectStore = transaction.objectStore('foodData');
      
      objectStore.clear();
      setFoodData(initialFoodData);
    };

    request.onerror = () => {
      console.error('Failed to reset IndexedDB');
      setFoodData(initialFoodData);
    };
  };

  return { foodData, updateFoodData, resetFoodData };
}
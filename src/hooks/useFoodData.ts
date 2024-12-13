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
  const [foodData, setFoodData] = useState<FoodData | null>(null);

  useEffect(() => {
    try {
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
            const result = getRequest.result;
            setFoodData({
              ...initialFoodData,
              ...result,
              showLandingPage: result.showLandingPage ?? true
            });
          } else {
            setFoodData(initialFoodData);
          }
        };

        getRequest.onerror = () => {
          console.error('Failed to get data from IndexedDB');
          setFoodData(initialFoodData);
        };
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('foodData')) {
          db.createObjectStore('foodData', { keyPath: 'id' });
        }
      };
    } catch (err: unknown) {
      console.error('IndexedDB error:', err);
      setFoodData(initialFoodData);
    }
  }, []);

  const updateFoodData = (newData: FoodData) => {
    try {
      const request = window.indexedDB.open('FoodSplitterDB', 1);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['foodData'], 'readwrite');
        const objectStore = transaction.objectStore('foodData');
        
        const dataToStore = {
          ...initialFoodData,
          ...newData,
          showLandingPage: newData.showLandingPage ?? true
        };
        
        const putRequest = objectStore.put(dataToStore);
        
        putRequest.onsuccess = () => {
          setFoodData(dataToStore);
        };

        putRequest.onerror = () => {
          console.error('Failed to update data in IndexedDB');
          setFoodData(dataToStore);
        };
      };

      request.onerror = () => {
        console.error('Failed to open IndexedDB for update');
        setFoodData({
          ...initialFoodData,
          ...newData,
          showLandingPage: newData.showLandingPage ?? true
        });
      };
    } catch (err: unknown) {
      console.error('IndexedDB update error:', err);
      setFoodData({
        ...initialFoodData,
        ...newData,
        showLandingPage: newData.showLandingPage ?? true
      });
    }
  };

  const resetFoodData = () => {
    try {
      const request = window.indexedDB.open('FoodSplitterDB', 1);

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction(['foodData'], 'readwrite');
        const objectStore = transaction.objectStore('foodData');
        
        const clearRequest = objectStore.clear();
        
        clearRequest.onsuccess = () => {
          setFoodData(initialFoodData);
        };

        clearRequest.onerror = () => {
          console.error('Failed to clear data in IndexedDB');
          setFoodData(initialFoodData);
        };
      };

      request.onerror = () => {
        console.error('Failed to open IndexedDB for reset');
        setFoodData(initialFoodData);
      };
    } catch (err: unknown) {
      console.error('IndexedDB reset error:', err);
      setFoodData(initialFoodData);
    }
  };

  return { foodData, updateFoodData, resetFoodData };
}
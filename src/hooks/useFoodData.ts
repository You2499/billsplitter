import { useState, useEffect } from 'react';
import type { FoodData } from '../types';

export function useFoodData() {
  const [foodData, setFoodData] = useState<FoodData | null>(null);

  useEffect(() => {
    try {
      const request = window.indexedDB.open('FoodSplitterDB', 1);

      request.onerror = () => {
        setFoodData({
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
        });
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
              id: result.id || 1,
              numberOfPeople: result.numberOfPeople || 0,
              peopleNames: result.peopleNames || [],
              items: result.items || [],
              tip: result.tip || '',
              tax: result.tax || '',
              singlePayer: result.singlePayer || null,
              setupComplete: result.setupComplete || false,
              setupStep: result.setupStep || 0,
              showLandingPage: result.showLandingPage ?? true,
              totalBillAmount: result.totalBillAmount || 0
            });
          } else {
            setFoodData({
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
    } catch (err: unknown) {
      setFoodData({
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
      });
    }
  }, []);

  const updateFoodData = (newData: FoodData) => {
    const request = window.indexedDB.open('FoodSplitterDB', 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['foodData'], 'readwrite');
      const objectStore = transaction.objectStore('foodData');
      
      const dataToStore = {
        ...newData,
        id: newData.id || 1,
        numberOfPeople: newData.numberOfPeople || 0,
        peopleNames: newData.peopleNames || [],
        items: newData.items || [],
        tip: newData.tip || '',
        tax: newData.tax || '',
        singlePayer: newData.singlePayer || null,
        setupComplete: newData.setupComplete || false,
        setupStep: newData.setupStep || 0,
        showLandingPage: newData.showLandingPage ?? true,
        totalBillAmount: newData.totalBillAmount || 0
      };
      
      objectStore.put(dataToStore);
      setFoodData(dataToStore);
    };
  };

  const resetFoodData = () => {
    const request = window.indexedDB.open('FoodSplitterDB', 1);

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      const transaction = db.transaction(['foodData'], 'readwrite');
      const objectStore = transaction.objectStore('foodData');
      
      objectStore.clear();
      setFoodData(null);
    };
  };

  return { foodData, updateFoodData, resetFoodData };
}
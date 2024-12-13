export interface FoodItem {
  item: string;
  price: string;
  contributions: string[];
}

export interface SinglePayer {
  index: number | null;
  amount: number;
  simplified?: boolean;
}

export interface FoodData {
  id: number;
  numberOfPeople: number;
  peopleNames: string[];
  items: FoodItem[];
  tip: string;
  tax: string;
  totalBillAmount?: number;
  singlePayer: SinglePayer | null;
  setupComplete: boolean;
  setupStep: number;
  showLandingPage: boolean;
}

export interface Contribution {
  item: string;
  eachShare: number;
}
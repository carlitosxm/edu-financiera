// src/types/index.ts
export type GamePhase = 'START_SCREEN' | 'MANAGEMENT' | 'BILLING' | 'CASHBACK' | 'SUMMARY' | 'VICTORY' | 'BANKRUPTCY';

export interface Product {
  id: string;
  name: string;
  costPrice: number;
  sellPrice: number;
  minStock: number;
}

export interface Inventory {
  [productId: string]: number;
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  cart: {
    productId: string;
    quantity: number;
  }[];
  paymentWith: number;
}

export interface WeekSummary {
  weekNumber: number;
  initialCash: number;
  salesIncome: number;
  merchandiseCost: number;
  fixedCosts: number;
  cashbackErrors: number;
  finalCash: number;
}

export interface GameState {
  week: number;
  phase: GamePhase;
  cashInRegister: number;
  inventory: Inventory;
  currentCustomerIndex: number;
  customersQueue: Customer[];
  currentWeekSummary: Omit<WeekSummary, 'finalCash'>;
  history: WeekSummary[];
}
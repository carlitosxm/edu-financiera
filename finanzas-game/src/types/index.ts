// src/types/index.ts
export type GamePhase = 'START_SCREEN' | 'MANAGEMENT' | 'BILLING' | 'CASHBACK' | 'SUMMARY' | 'VICTORY' | 'BANKRUPTCY' | 'EVENT';

export interface Product {
  id: string;
  name: string;
  costPrice: number;
  sellPrice: number;
  minStock: number;
  category?: string;
  icon?: string;
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

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  type: 'PRICE_CHANGE' | 'DEMAND_CHANGE' | 'FIXED_COST_CHANGE' | 'CASH_BONUS';
  impact: number; // e.g. 1.2 for 20% increase
  productId?: string;
}

export interface ShopUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'MARKETING' | 'EFFICIENCY' | 'CALCULATOR';
  impact: number;
  icon: string;
  purchased: boolean;
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
  activeEvent: GameEvent | null;
  upgrades: ShopUpgrade[];
}
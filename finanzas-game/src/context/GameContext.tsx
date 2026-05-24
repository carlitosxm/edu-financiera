// src/context/GameContext.tsx
import React, { createContext, useReducer, type ReactNode } from 'react';
import type { GameState, Customer, GameEvent, ShopUpgrade } from '../types/index';
import { PRODUCT_CATALOG, INITIAL_CASH, FIXED_WEEKLY_COSTS, UPGRADES } from '../utils/constants';

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'BUY_STOCK'; payload: { productId: string; quantity: number } }
  | { type: 'START_WEEK'; payload: { customers: Customer[] } }
  | { type: 'NEXT_CUSTOMER' }
  | { type: 'SUBMIT_CASHBACK'; payload: { changeGiven: number; expectedChange: number; penalty: number } }
  | { type: 'CLOSE_WEEK' }
  | { type: 'RESET_GAME' }
  | { type: 'TRIGGER_EVENT'; payload: GameEvent }
  | { type: 'ACKNOWLEDGE_EVENT' }
  | { type: 'BUY_UPGRADE'; payload: string };

const initialState: GameState = {
  week: 1,
  phase: 'START_SCREEN', 
  cashInRegister: INITIAL_CASH,
  inventory: PRODUCT_CATALOG.reduce((acc, prod) => ({ ...acc, [prod.id]: 0 }), {}),
  currentCustomerIndex: 0,
  customersQueue: [],
  currentWeekSummary: {
    weekNumber: 1,
    initialCash: INITIAL_CASH,
    salesIncome: 0,
    merchandiseCost: 0,
    fixedCosts: FIXED_WEEKLY_COSTS,
    cashbackErrors: 0,
  },
  history: [],
  activeEvent: null,
  upgrades: UPGRADES,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, phase: 'MANAGEMENT', week: 1 };

    case 'BUY_STOCK': {
      const { productId, quantity } = action.payload;
      const product = PRODUCT_CATALOG.find((p) => p.id === productId);
      if (!product) return state;
      const totalCost = product.costPrice * quantity;
      if (state.cashInRegister < totalCost) return state; 

      return {
        ...state,
        cashInRegister: state.cashInRegister - totalCost,
        inventory: { ...state.inventory, [productId]: (state.inventory[productId] || 0) + quantity },
      };
    }

    case 'START_WEEK':
      return {
        ...state,
        phase: 'BILLING',
        customersQueue: action.payload.customers,
        currentCustomerIndex: 0,
        currentWeekSummary: {
          ...state.currentWeekSummary,
          weekNumber: state.week,
          initialCash: state.cashInRegister,
          salesIncome: 0,
          merchandiseCost: 0,
          cashbackErrors: 0,
        },
      };

    case 'NEXT_CUSTOMER':
      return { ...state, phase: 'CASHBACK' };

    case 'SUBMIT_CASHBACK': {
      const { changeGiven, penalty } = action.payload;
      const currentCustomer = state.customersQueue[state.currentCustomerIndex];
      
      let incomeFromSale = 0;
      let merchandiseCostOfSale = 0;

      currentCustomer.cart.forEach((item) => {
        const prod = PRODUCT_CATALOG.find((p) => p.id === item.productId);
        if (prod) {
          let sellPrice = prod.sellPrice;
          if (state.activeEvent?.type === 'PRICE_CHANGE' && state.activeEvent.productId === prod.id) {
            sellPrice *= state.activeEvent.impact;
          }
          
          incomeFromSale += sellPrice * item.quantity;
          merchandiseCostOfSale += prod.costPrice * item.quantity;
        }
      });

      const realCashFlow = currentCustomer.paymentWith - changeGiven;
      const nextCustomerIndex = state.currentCustomerIndex + 1;
      const isEndOfWeek = nextCustomerIndex >= state.customersQueue.length;

      const updatedInventory = { ...state.inventory };
      currentCustomer.cart.forEach((item) => {
        updatedInventory[item.productId] = Math.max(0, updatedInventory[item.productId] - item.quantity);
      });

      // Round to 2 decimal places to avoid IEEE 754 precision issues (e.g. 21.599999999)
      const finalCashInRegister = Math.round((state.cashInRegister + realCashFlow - penalty) * 100) / 100;

      if (finalCashInRegister < 0) {
        return { ...state, cashInRegister: finalCashInRegister, phase: 'BANKRUPTCY' };
      }

      return {
        ...state,
        cashInRegister: finalCashInRegister,
        inventory: updatedInventory,
        currentCustomerIndex: nextCustomerIndex,
        phase: isEndOfWeek ? 'SUMMARY' : 'BILLING',
        currentWeekSummary: {
          ...state.currentWeekSummary,
          salesIncome: Math.round((state.currentWeekSummary.salesIncome + incomeFromSale) * 100) / 100,
          merchandiseCost: Math.round((state.currentWeekSummary.merchandiseCost + merchandiseCostOfSale) * 100) / 100,
          cashbackErrors: state.currentWeekSummary.cashbackErrors + penalty,
        },
      };
    }

    case 'CLOSE_WEEK': {
      let dailyCosts = state.currentWeekSummary.fixedCosts;
      
      const efficiencyUpgrade = state.upgrades.find(u => u.type === 'EFFICIENCY' && u.purchased);
      if (efficiencyUpgrade) dailyCosts -= efficiencyUpgrade.impact;

      const netCashAfterFixed = Math.round((state.cashInRegister - dailyCosts) * 100) / 100;
      
      if (netCashAfterFixed < 0) {
        return { ...state, cashInRegister: netCashAfterFixed, phase: 'BANKRUPTCY' };
      }

      if (state.week === 4) {
        return { ...state, cashInRegister: netCashAfterFixed, phase: 'VICTORY' };
      }

      return {
        ...state,
        week: state.week + 1,
        phase: 'MANAGEMENT',
        cashInRegister: netCashAfterFixed,
        history: [...state.history, { ...state.currentWeekSummary, finalCash: netCashAfterFixed }],
        activeEvent: null,
        currentWeekSummary: {
          weekNumber: state.week + 1,
          initialCash: netCashAfterFixed,
          salesIncome: 0,
          merchandiseCost: 0,
          fixedCosts: FIXED_WEEKLY_COSTS,
          cashbackErrors: 0,
        },
      };
    }

    case 'TRIGGER_EVENT':
      return { 
        ...state, 
        phase: 'EVENT',
        activeEvent: action.payload,
        cashInRegister: action.payload.type === 'CASH_BONUS' ? state.cashInRegister + action.payload.impact : state.cashInRegister,
        currentWeekSummary: action.payload.type === 'FIXED_COST_CHANGE' ? {
          ...state.currentWeekSummary,
          fixedCosts: state.currentWeekSummary.fixedCosts * action.payload.impact
        } : state.currentWeekSummary
      };

    case 'ACKNOWLEDGE_EVENT':
      return { ...state, phase: 'MANAGEMENT' };

    case 'BUY_UPGRADE': {
      const upgrade = state.upgrades.find(u => u.id === action.payload);
      if (!upgrade || upgrade.purchased || state.cashInRegister < upgrade.cost) return state;
      
      return {
        ...state,
        cashInRegister: state.cashInRegister - upgrade.cost,
        upgrades: state.upgrades.map(u => u.id === action.payload ? { ...u, purchased: true } : u)
      };
    }

    case 'RESET_GAME': 
      return { ...initialState, phase: 'START_SCREEN' };
      
    default: 
      return state;
  }
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  buyStock: (productId: string, quantity: number) => void;
  startDay: (customers: Customer[]) => void;
  goToCashback: () => void;
  submitCashback: (changeGiven: number, expectedChange: number, penalty: number) => void;
  closeDay: () => void;
  resetGame: () => void;
  triggerEvent: (event: GameEvent) => void;
  acknowledgeEvent: () => void;
  buyUpgrade: (upgradeId: string) => void;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  return (
    <GameContext.Provider value={{
      state,
      startGame: () => dispatch({ type: 'START_GAME' }),
      buyStock: (productId, quantity) => dispatch({ type: 'BUY_STOCK', payload: { productId, quantity } }),
      startDay: (customers) => dispatch({ type: 'START_WEEK', payload: { customers } }),
      goToCashback: () => dispatch({ type: 'NEXT_CUSTOMER' }),
      submitCashback: (changeGiven, expectedChange, penalty) => dispatch({ type: 'SUBMIT_CASHBACK', payload: { changeGiven, expectedChange, penalty } }),
      closeDay: () => dispatch({ type: 'CLOSE_WEEK' }),
      resetGame: () => dispatch({ type: 'RESET_GAME' }),
      triggerEvent: (event) => dispatch({ type: 'TRIGGER_EVENT', payload: event }),
      acknowledgeEvent: () => dispatch({ type: 'ACKNOWLEDGE_EVENT' }),
      buyUpgrade: (upgradeId) => dispatch({ type: 'BUY_UPGRADE', payload: upgradeId })
    }}>
      {children}
    </GameContext.Provider>
  );
};
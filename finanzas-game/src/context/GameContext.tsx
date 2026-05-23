// src/context/GameContext.tsx
import React, { createContext, useReducer, ReactNode } from 'react';
import type { GameState, Customer } from '../types/index';
import { PRODUCT_CATALOG, INITIAL_CASH, FIXED_WEEKLY_COSTS } from '../utils/constants';

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'BUY_STOCK'; payload: { productId: string; quantity: number } }
  | { type: 'START_WEEK'; payload: { customers: Customer[] } }
  | { type: 'NEXT_CUSTOMER' }
  | { type: 'SUBMIT_CASHBACK'; payload: { changeGiven: number; expectedChange: number; penalty: number } }
  | { type: 'CLOSE_WEEK' }
  | { type: 'RESET_GAME' };

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
      const { changeGiven, expectedChange, penalty } = action.payload;
      const currentCustomer = state.customersQueue[state.currentCustomerIndex];
      
      let incomeFromSale = 0;
      let merchandiseCostOfSale = 0;

      currentCustomer.cart.forEach((item) => {
        const prod = PRODUCT_CATALOG.find((p) => p.id === item.productId);
        if (prod) {
          incomeFromSale += prod.sellPrice * item.quantity;
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

      const finalCashInRegister = state.cashInRegister + realCashFlow - penalty;

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
          salesIncome: state.currentWeekSummary.salesIncome + incomeFromSale,
          merchandiseCost: state.currentWeekSummary.merchandiseCost + merchandiseCostOfSale,
          cashbackErrors: state.currentWeekSummary.cashbackErrors + penalty,
        },
      };
    }

    case 'CLOSE_WEEK': {
      const netCashAfterFixed = state.cashInRegister - FIXED_WEEKLY_COSTS;
      
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
      resetGame: () => dispatch({ type: 'RESET_GAME' })
    }}>
      {children}
    </GameContext.Provider>
  );
};
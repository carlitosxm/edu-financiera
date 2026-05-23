// src/utils/constants.ts
import type { Product } from '../types/index';

export const INITIAL_CASH = 100;
export const FIXED_WEEKLY_COSTS = 15; 

export const PRODUCT_CATALOG: Product[] = [
  { id: 'prod_cuaderno', name: 'Cuaderno Universitario', costPrice: 1, sellPrice: 4, minStock: 5 },
  { id: 'prod_lapiz', name: 'Lápiz Pasta', costPrice: 0.50, sellPrice: 2, minStock: 10 },
  { id: 'prod_mochila', name: 'Mochila Escolar', costPrice: 12, sellPrice: 60, minStock: 2 },
  { id: 'prod_calculadora', name: 'Calculadora Básica', costPrice: 4, sellPrice: 15, minStock: 3 },
];
// src/utils/constants.ts
import type { Product, GameEvent, ShopUpgrade } from '../types/index';

export const INITIAL_CASH = 100;
export const FIXED_WEEKLY_COSTS = 15;

export const PRODUCT_CATALOG: Product[] = [
  { id: 'prod_cuaderno', name: 'Cuaderno Universitario', costPrice: 1, sellPrice: 4, minStock: 5, icon: '📔' },
  { id: 'prod_lapiz', name: 'Lápiz Pasta', costPrice: 0.50, sellPrice: 2, minStock: 10, icon: '✏️' },
  { id: 'prod_mochila', name: 'Mochila Escolar', costPrice: 12, sellPrice: 60, minStock: 2, icon: '🎒' },
  { id: 'prod_calculadora', name: 'Calculadora Básica', costPrice: 4, sellPrice: 15, minStock: 3, icon: '🧮' },
  { id: 'prod_regla', name: 'Set de Reglas', costPrice: 2, sellPrice: 8, minStock: 5, icon: '📏' },
  { id: 'prod_colores', name: 'Lápices de Colores', costPrice: 3, sellPrice: 12, minStock: 4, icon: '🎨' },
];

export const EVENTS: GameEvent[] = [
  { id: 'event_festival', title: 'Festival Escolar', description: '¡Hay mucha demanda! Los clientes están dispuestos a pagar más por los cuadernos.', type: 'PRICE_CHANGE', impact: 1.5, productId: 'prod_cuaderno' },
  { id: 'event_inflation', title: 'Inflación Papelera', description: 'El costo de los materiales ha subido. El arriendo semanal aumenta un 20%.', type: 'FIXED_COST_CHANGE', impact: 1.2 },
  { id: 'event_found_cash', title: 'Moneda de la Suerte', description: '¡Has encontrado dinero limpiando la tienda!', type: 'CASH_BONUS', impact: 20 },
  { id: 'event_demand', title: 'Temporada de Dibujo', description: '¡Todos quieren colorear! La demanda de lápices de colores aumenta.', type: 'DEMAND_CHANGE', impact: 2 },
];

export const UPGRADES: ShopUpgrade[] = [
  { id: 'up_calc', name: 'Calculadora Pro', description: 'Muestra el vuelto exacto que debes entregar.', cost: 100, type: 'CALCULATOR', impact: 1, icon: '📲', purchased: false },
  { id: 'up_wholesale', name: 'Convenio Proveedor', description: 'Reduce los costos fijos semanales en $5.', cost: 80, type: 'EFFICIENCY', impact: 5, icon: '🤝', purchased: false },
];
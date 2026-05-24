import type { Customer, Inventory, GameEvent } from '../types/index';
import { PRODUCT_CATALOG } from './constants';

const CUSTOMER_NAMES = [
  'Sofía', 'Mateo', 'Valentina', 'Lucas', 'Camila', 
  'Santiago', 'Elena', 'Benjamín', 'Isabella', 'Joaquín'
];
const AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '👦', '👧', '👨‍💼', '👩‍💼'];
const DENOMINATIONS = [5, 10, 20, 50, 100]; 

export const generateCustomersQueue = (
  count: number, 
  currentInventory: Inventory,
  activeEvent: GameEvent | null = null
): Customer[] => {
  const queue: Customer[] = [];
  const simulatedInventory = { ...currentInventory };

  for (let i = 0; i < count; i++) {
    const availableProducts = PRODUCT_CATALOG.filter(p => (simulatedInventory[p.id] || 0) > 0);
    if (availableProducts.length === 0) break;

    const name = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)];
    
    const maxDistinct = Math.min(availableProducts.length, 3);
    const distinctProductsCount = Math.floor(Math.random() * maxDistinct) + 1;
    
    const shuffledAvailable = [...availableProducts].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledAvailable.slice(0, distinctProductsCount);

    let totalToPay = 0;
    const cart = selectedProducts.map((product) => {
      const availableStock = simulatedInventory[product.id] || 0;
      const maxQty = Math.min(availableStock, 3); 
      const quantity = Math.floor(Math.random() * maxQty) + 1;
      
      simulatedInventory[product.id] -= quantity; 
      
      let sellPrice = product.sellPrice;
      if (activeEvent?.type === 'PRICE_CHANGE' && activeEvent.productId === product.id) {
        sellPrice *= activeEvent.impact;
      }
      
      totalToPay += Math.round(sellPrice * quantity);
      
      return { productId: product.id, quantity };
    });

    const validBills = DENOMINATIONS.filter((bill) => bill > totalToPay);
    const paymentWith = validBills.length > 0 
      ? validBills[Math.floor(Math.random() * Math.min(validBills.length, 3))]
      : (Math.ceil((totalToPay + 1) / 20) * 20);

    queue.push({
      id: `cust_${Date.now()}_${i}`,
      name,
      avatar,
      cart,
      paymentWith,
    });
  }

  return queue;
};
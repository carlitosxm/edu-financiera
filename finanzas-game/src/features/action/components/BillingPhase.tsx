// src/features/action/components/BillingPhase.tsx
import React from 'react';
import { useGame } from '../../../context/useGame';
import { PRODUCT_CATALOG } from '../../../utils/constants';

const getProductIcon = (id: string) => {
  switch (id) {
    case 'prod_cuaderno': return '📓';
    case 'prod_lapiz': return '🖊️';
    case 'prod_mochila': return '🎒';
    case 'prod_calculadora': return '🖩';
    default: return '📦';
  }
};

export const BillingPhase: React.FC = () => {
  const { state, goToCashback } = useGame();
  const currentCustomer = state.customersQueue[state.currentCustomerIndex];

  const realTotal = currentCustomer?.cart.reduce((acc, item) => {
    const product = PRODUCT_CATALOG.find((p) => p.id === item.productId);
    return acc + (product ? product.sellPrice * item.quantity : 0);
  }, 0) || 0;

  if (!currentCustomer) return <div style={{ padding: '20px' }}>Cargando...</div>;

  const firstProductInCart = currentCustomer.cart[0];
  const thoughtProduct = PRODUCT_CATALOG.find(p => p.id === firstProductInCart?.productId);

  return (
    <div style={{ padding: '25px', border: '2px solid #93c5fd', borderRadius: '20px', backgroundColor: '#eff6ff', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
      
      <h2 style={{ color: '#1e3a8a', margin: '0 0 10px 0', fontSize: '24px' }}>Fase 2: Caja Registradora</h2>
      <p style={{ color: '#374151', margin: '0 0 25px 0', fontSize: '15px' }}>
        Atendiendo al cliente <strong>{currentCustomer.name}</strong> ({state.currentCustomerIndex + 1} de {state.customersQueue.length})
      </p>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '25px', alignItems: 'center' }}>
        
        <div style={{ flex: 1, backgroundColor: '#ffffff', padding: '20px', boxShadow: '3px 5px 15px rgba(0,0,0,0.08)', position: 'relative', fontFamily: '"Courier New", Courier, monospace', color: '#111827' }}>
          <h3 style={{ margin: '0 0 15px 0', textAlign: 'center', fontSize: '18px', borderBottom: '1px dashed #d1d5db', paddingBottom: '10px' }}>Recibo Escolar</h3>
          <ul style={{ listStyleType: 'none', padding: 0, margin: '0 0 15px 0', fontSize: '15px' }}>
            {currentCustomer.cart.map((item, index) => {
              const product = PRODUCT_CATALOG.find((p) => p.id === item.productId);
              return (
                <li key={index} style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{item.quantity}x {product?.name.substring(0, 12)}...</span>
                  <span>${(product?.sellPrice || 0) * item.quantity}</span>
                </li>
              );
            })}
          </ul>
          <div style={{ borderTop: '2px solid #111827', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold' }}>
            <span>TOTAL:</span>
            <span style={{ color: '#16a34a' }}>${realTotal}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '130px', position: 'relative' }}>
          <div style={{ backgroundColor: '#ffffff', border: '2px solid #d1d5db', borderRadius: '20px', padding: '10px 15px', marginBottom: '15px', position: 'relative', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '18px' }}>
            <span>{getProductIcon(thoughtProduct?.id || '')}</span>
            <span>${thoughtProduct?.sellPrice}</span>
            <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '12px', height: '12px', backgroundColor: '#ffffff', borderRight: '2px solid #d1d5db', borderBottom: '2px solid #d1d5db' }} />
          </div>

          <img src="/michi_cliente.png" alt="Michi" style={{ width: '110px', height: 'auto', filter: 'drop-shadow(0px 6px 6px rgba(0,0,0,0.15))' }} />
        </div>

      </div>

      <button 
        onClick={goToCashback} 
        style={{ width: '100%', backgroundColor: '#22c55e', color: 'white', padding: '18px', borderRadius: '12px', fontSize: '22px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', boxShadow: '0 6px 0px #16a34a' }}
        onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(6px)'; e.currentTarget.style.boxShadow = '0 0px 0px #16a34a'; }}
        onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0 6px 0px #16a34a'; }}
      >
        Cobrar ${realTotal} 📠
      </button>
    </div>
  );
};
// src/features/management/components/ManagementPhase.tsx
import React from 'react';
import { useGame } from '../../../context/useGame';
import { PRODUCT_CATALOG, FIXED_WEEKLY_COSTS } from '../../../utils/constants';
import { generateCustomersQueue } from '../../../utils/customerGenerator';
import { sounds } from '../../../utils/sounds'; // Importación de sonidos integrada

const getProductIcon = (id: string) => {
  switch (id) {
    case 'prod_cuaderno': return '📓';
    case 'prod_lapiz': return '🖊️';
    case 'prod_mochila': return '🎒';
    case 'prod_calculadora': return '🖩';
    default: return '📦';
  }
};

export const ManagementPhase: React.FC = () => {
  const { state, buyStock, startDay } = useGame();
  const totalStock = Object.values(state.inventory).reduce((acc, qty) => acc + qty, 0);

  const handleStartWeek = () => {
    const weeklyCustomers = Math.floor(Math.random() * 5) + 1; 
    const newCustomers = generateCustomersQueue(weeklyCustomers, state.inventory);
    startDay(newCustomers);
  };

  return (
    <div style={{ padding: '25px', border: '2px solid #bbf7d0', borderRadius: '20px', backgroundColor: '#f0fdf4', display: 'flex', flexDirection: 'column', width: '100%', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#166534', margin: 0, fontSize: '22px' }}>Fase 1: Abastecimiento y Stock (Semana {state.week})</h2>
        <span style={{ fontSize: '28px' }}>🏬</span>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '36px' }}>📠</span>
          <div>
            <p style={{ margin: 0, color: '#4b5563', fontSize: '13px', fontWeight: 'bold' }}>Disponible en Caja:</p>
            <h3 style={{ margin: 0, color: '#16a34a', fontSize: '28px', fontWeight: 900 }}>${state.cashInRegister}</h3>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: '#fff', padding: '15px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '36px' }}>🏫</span>
          <div>
            <p style={{ margin: 0, color: '#4b5563', fontSize: '13px', fontWeight: 'bold' }}>Costo Fijo:</p>
            <h3 style={{ margin: 0, color: '#dc2626', fontSize: '20px', fontWeight: 900 }}>${FIXED_WEEKLY_COSTS} <span style={{fontSize: '14px', color: '#6b7280'}}>/ semana</span></h3>
          </div>
        </div>
      </div>

      <div style={{ 
        padding: '15px', borderRadius: '12px', marginBottom: '20px', fontWeight: 'bold', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.3s ease',
        backgroundColor: totalStock === 0 ? '#fff3cd' : '#d1e7dd', color: totalStock === 0 ? '#856404' : '#0f5132', border: `1px solid ${totalStock === 0 ? '#ffeeba' : '#badbcc'}`
      }}>
        {totalStock === 0 
          ? '⚠️ ¡Atención Emprendedor! Tu tienda está vacía. Debes comprar mercancía al proveedor antes de poder abrir.'
          : '✅ ¡Excelente! Tienes inventario disponible. Ya puedes abrir las puertas de tu negocio.'}
      </div>

      <h3 style={{ marginTop: 0, color: '#111827', marginBottom: '15px', fontSize: '18px' }}>Catálogo Mayorista:</h3>
      
      <div style={{ display: 'grid', gap: '12px', marginBottom: '25px' }}>
        {PRODUCT_CATALOG.map((product) => {
          const currentStock = state.inventory[product.id] || 0;
          const canAffordOne = state.cashInRegister >= product.costPrice;
          
          return (
            <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#ffffff', padding: '15px', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ backgroundColor: '#fef3c7', padding: '10px', borderRadius: '12px', fontSize: '28px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getProductIcon(product.id)}
                </div>
                <div>
                  <strong style={{ display: 'block', fontSize: '16px', color: '#1f2937' }}>{product.name}</strong>
                  <small style={{ color: '#6b7280', display: 'block', margin: '2px 0' }}>Costo Proveedor: ${product.costPrice} | Venta Cliente: ${product.sellPrice}</small>
                  <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Stock Actual: <strong style={{ color: currentStock === 0 ? '#dc2626' : '#16a34a' }}>{currentStock} unidades</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {/* Botón +1 con el sonido de moneda limpio */}
                <button 
                  onClick={() => { buyStock(product.id, 1); sounds.playCoin(); }} 
                  disabled={!canAffordOne} 
                  style={{ backgroundColor: canAffordOne ? '#22c55e' : '#e5e7eb', color: canAffordOne ? 'white' : '#9ca3af', padding: '10px 15px', borderRadius: '10px', fontWeight: 'bold' }}
                >
                  +1 (${product.costPrice})
                </button>
                {/* Botón +5 con el sonido de moneda limpio */}
                <button 
                  onClick={() => { buyStock(product.id, 5); sounds.playCoin(); }} 
                  disabled={state.cashInRegister < (product.costPrice * 5)} 
                  style={{ backgroundColor: state.cashInRegister >= (product.costPrice * 5) ? '#166534' : '#e5e7eb', color: state.cashInRegister >= (product.costPrice * 5) ? 'white' : '#9ca3af', padding: '10px 15px', borderRadius: '10px', fontWeight: 'bold' }}
                >
                  +5 (${product.costPrice * 5})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button 
        onClick={handleStartWeek} 
        disabled={totalStock === 0}
        style={{ width: '100%', backgroundColor: totalStock === 0 ? '#cbd5e1' : '#22c55e', color: totalStock === 0 ? '#9ca3af' : 'white', padding: '20px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}
      >
        {totalStock === 0 ? '🔒' : '🚀'} Comenzar Jornada de Ventas
      </button>
    </div>
  );
};
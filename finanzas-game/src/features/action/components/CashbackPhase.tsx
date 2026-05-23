// src/features/action/components/CashbackPhase.tsx
import React, { useState } from 'react';
import { useGame } from '../../../context/useGame';
import { PRODUCT_CATALOG } from '../../../utils/constants';

export const CashbackPhase: React.FC = () => {
  const { state, submitCashback } = useGame();
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [penaltyAccumulated, setPenaltyAccumulated] = useState<number>(0);
  const [errorFeedback, setErrorFeedback] = useState<string>('');

  const currentCustomer = state.customersQueue[state.currentCustomerIndex];

  const realTotal = currentCustomer?.cart.reduce((acc, item) => {
    const product = PRODUCT_CATALOG.find((p) => p.id === item.productId);
    return acc + (product ? product.sellPrice * item.quantity : 0);
  }, 0) || 0;

  const expectedChange = (currentCustomer?.paymentWith || 0) - realTotal;
  const changeGivenNum = parseInt(displayValue, 10) || 0;
  const simulatedCash = state.cashInRegister + (currentCustomer?.paymentWith || 0) - changeGivenNum - penaltyAccumulated;

  const handleNumberClick = (num: string) => {
    setErrorFeedback(''); 
    setDisplayValue((prev) => {
      if (prev === '0') return num; 
      if (prev.length >= 5) return prev; 
      return prev + num;
    });
  };

  const handleClear = () => setDisplayValue('0');
  const handleDelete = () => setDisplayValue((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));

  const handleConfirm = () => {
    if (changeGivenNum === expectedChange) {
      submitCashback(changeGivenNum, expectedChange, penaltyAccumulated);
      setDisplayValue('0');
      setPenaltyAccumulated(0);
      setErrorFeedback('');
    } else {
      setPenaltyAccumulated((prev) => prev + 2);
      setErrorFeedback(`⚠️ ¡Vuelto incorrecto! El cliente reclama que el vuelto real debe ser de $${expectedChange}. Se aplican $2 de multa.`);
    }
  };

  if (!currentCustomer) return null;

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '20px', width: '100%', boxSizing: 'border-box' }} className="phase-animation">
      <h2 style={{ margin: '0 0 15px 0', color: '#b45309', fontSize: '22px', fontWeight: 800 }}>Fase 3: Gestión de Cambio</h2>

      {errorFeedback && (
        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '12px', marginBottom: '15px', fontSize: '14px', textAlign: 'center', fontWeight: 'bold', border: '1px solid #fecaca' }}>
          {errorFeedback}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'row', gap: '15px', alignItems: 'stretch', width: '100%', boxSizing: 'border-box' }}>
        
        <div style={{ flex: '1', backgroundColor: '#fffbeb', padding: '15px', borderRadius: '16px', border: '1px solid #fef3c7', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
          <img src="/michi_cliente.png" alt="Michi" style={{ width: '75px', height: '75px', objectFit: 'contain', marginBottom: '10px' }} />
          <h4 style={{ margin: '0 0 5px 0', color: '#78350f' }}>Cliente: {currentCustomer.name}</h4>
          <div style={{ borderTop: '1px dashed #fcd34d', paddingTop: '10px', width: '100%', fontSize: '14px', lineHeight: '1.6' }}>
            🛒 Total Cuenta: <strong>${realTotal}</strong><br />
            💵 Paga Con: <strong>${currentCustomer.paymentWith}</strong>
          </div>
        </div>

        <div style={{ flex: '1.4', backgroundColor: '#cbd5e1', padding: '15px', borderRadius: '20px', border: '3px solid #64748b', boxShadow: '0 6px 0px #475569', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#1e293b', color: '#4ade80', padding: '10px 15px', borderRadius: '8px', textAlign: 'right', fontSize: '36px', fontFamily: 'monospace', marginBottom: '12px', border: '3px solid #94a3b8' }}>
            {displayValue}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', flex: 1 }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((n) => (
              <button key={n} onClick={() => handleNumberClick(n)} style={{ padding: '12px 0', fontSize: '20px', fontWeight: 'bold', borderRadius: '8px', backgroundColor: '#f8fafc', border: '2px solid #94a3b8', boxShadow: '0 3px 0px #94a3b8' }}>{n}</button>
            ))}
            <button onClick={handleClear} style={{ padding: '12px 0', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', backgroundColor: '#fca5a5', border: '2px solid #dc2626', boxShadow: '0 3px 0px #dc2626', color: '#b91c1c' }}>C</button>
            <button onClick={handleDelete} style={{ padding: '12px 0', fontSize: '18px', fontWeight: 'bold', borderRadius: '8px', backgroundColor: '#fdba74', border: '2px solid #ea580c', boxShadow: '0 3px 0px #ea580c', color: '#9a3412' }}>✕</button>
          </div>
        </div>

        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box' }}>
          <div style={{ backgroundColor: '#f1f5f9', borderRadius: '16px', padding: '12px 15px', border: '2px solid #e2e8f0', fontSize: '13px' }}>
            <h5 style={{ margin: '0 0 8px 0', borderBottom: '1px solid #cbd5e1' }}>📋 Auditoría de Flujo</h5>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Caja Inicial:</span><span>${state.cashInRegister}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>+ Recibido:</span><span>${currentCustomer.paymentWith}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2563eb', fontWeight: 'bold' }}><span>- Vuelto Digitado:</span><span>-${displayValue}</span></div>
            {penaltyAccumulated > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: '#dc2626' }}><span>- Multas:</span><span>-${penaltyAccumulated}</span></div>}
            <hr style={{ borderTop: '1px solid #cbd5e1', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}><span>Caja Proyectada:</span><span style={{ color: '#16a34a' }}>${simulatedCash}</span></div>
          </div>

          <button 
            onClick={handleConfirm}
            style={{ width: '100%', backgroundColor: '#22c55e', color: 'white', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: '900', boxShadow: '0 6px 0px #16a34a' }}
            onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 2px 0px #16a34a'; }}
            onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0 6px 0px #16a34a'; }}
          >
            Confirmar Vuelto
          </button>
        </div>

      </div>
    </div>
  );
};
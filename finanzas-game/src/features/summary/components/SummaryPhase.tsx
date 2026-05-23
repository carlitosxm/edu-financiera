// src/features/summary/components/SummaryPhase.tsx
import React from 'react';
import { useGame } from '../../../context/useGame';

export const SummaryPhase: React.FC = () => {
  const { state, closeDay } = useGame();
  const summary = state.currentWeekSummary;
  const isLastWeek = state.week === 4;

  return (
    <div className="phase-animation" style={{ padding: '30px', background: 'linear-gradient(180deg, #4c2a6a 0%, #2d1643 100%)', borderRadius: '24px', border: '3px solid #7c3aed', boxShadow: '0 15px 35px rgba(0,0,0,0.4)', width: '100%', boxSizing: 'border-box' }} >
      
      <h2 style={{ color: '#fde047', marginTop: 0, marginBottom: '25px', fontSize: '24px', fontWeight: 800 }}>
        Fase 4: Auditoría de Cierre Semanal
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span>💰</span><span>Ventas Totales:</span></div>
          <span style={{ color: '#4ade80', fontSize: '20px', fontWeight: 800 }}>+${summary.salesIncome}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span>📦</span><span>Costo Inventario Vendido:</span></div>
          <span style={{ color: '#f87171', fontSize: '20px', fontWeight: 800 }}>-${summary.merchandiseCost}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span>🏫</span><span>Costos Fijos Cobrados:</span></div>
          <span style={{ color: '#f87171', fontSize: '20px', fontWeight: 800 }}>-${summary.fixedCosts}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><span>❌</span><span>Pérdida por Descuadre:</span></div>
          <span style={{ color: summary.cashbackErrors > 0 ? '#f87171' : '#ffffff', fontSize: '20px', fontWeight: 800 }}>-${summary.cashbackErrors}</span>
        </div>
      </div>

      <div style={{ background: 'linear-gradient(180deg, #475569 0%, #1e293b 100%)', padding: '5px 8px', borderRadius: '18px', border: '2px solid #64748b', display: 'flex' }}>
        <button 
          onClick={closeDay} 
          style={{ 
            width: '100%', color: 'white', padding: '15px', border: '1px solid #15803d', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold',
            background: isLastWeek ? 'linear-gradient(180deg, #eab308 0%, #ca8a04 100%)' : 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)', 
            boxShadow: isLastWeek ? '0 4px 0px #854d0e' : '0 4px 0px #14532d'
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(3px)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; }}
        >
          {isLastWeek ? '🏆 Pagar Alquiler Final y Ver Resultado' : '📅 Pagar Alquiler y Terminar Semana'}
        </button>
      </div>

    </div>
  );
};
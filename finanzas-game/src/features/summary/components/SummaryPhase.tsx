// src/features/summary/components/SummaryPhase.tsx
import React from 'react';
import { useGame } from '../../../context/useGame';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const SummaryPhase: React.FC = () => {
  const { state, closeDay } = useGame();
  const summary = state.currentWeekSummary;
  const isLastWeek = state.week === 4;

  const totalExpenses = summary.merchandiseCost + summary.fixedCosts + summary.cashbackErrors;
  const netEarnings = summary.salesIncome - totalExpenses;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="phase-animation">
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)' }}>Resumen Semanal</h2>
        <p style={{ color: 'var(--text-muted)' }}>Semana {state.week} finalizada.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <Card title="Desglose Financiero">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Saldo Inicial:</span>
              <span style={{ fontWeight: '700' }}>${summary.initialCash.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
              <span>Ingresos por Ventas:</span>
              <span style={{ color: 'var(--success)', fontWeight: '800' }}>+${summary.salesIncome.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Costo de Mercancía:</span>
              <span style={{ color: 'var(--error)', fontWeight: '700' }}>-${summary.merchandiseCost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Gastos del Local:</span>
              <span style={{ color: 'var(--error)', fontWeight: '700' }}>-${summary.fixedCosts.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Multas por Cambio:</span>
              <span style={{ color: summary.cashbackErrors > 0 ? 'var(--error)' : 'var(--text-muted)', fontWeight: '700' }}>-${summary.cashbackErrors.toFixed(2)}</span>
            </div>
            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '2.5px solid var(--background)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5rem', fontWeight: '900' }}>
              <span>Ganancia Neta:</span>
              <span style={{ color: netEarnings >= 0 ? 'var(--primary)' : 'var(--error)' }}>
                {netEarnings >= 0 ? '+' : ''}${netEarnings.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
           <div className="premium-card" style={{ textAlign: 'center', backgroundColor: 'var(--secondary)05' }}>
             <div style={{ fontSize: '3rem' }}>📅</div>
             <p style={{ marginTop: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
               {isLastWeek ? '¡Has completado el mes! Prepárate para el resultado final.' : `Faltan ${4 - state.week} semanas para completar el mes.`}
             </p>
           </div>
           <Button 
             variant={isLastWeek ? 'accent' : 'primary'} 
             size="lg" 
             fullWidth 
             onClick={closeDay}
             style={{ padding: '1.5rem', fontSize: '1.2rem' }}
           >
             {isLastWeek ? '🏆 Ver Resultado Final' : '📅 Continuar a Siguiente Semana'}
           </Button>
        </div>
      </div>
    </div>
  );
};
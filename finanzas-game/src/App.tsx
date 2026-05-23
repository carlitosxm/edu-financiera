// src/App.tsx
import React from 'react';
import { useGame } from './context/useGame';
import { StartScreen } from './features/management/components/StartScreen';
import { ManagementPhase } from './features/management/components/ManagementPhase';
import { BillingPhase } from './features/action/components/BillingPhase';
import { CashbackPhase } from './features/action/components/CashbackPhase';
import { SummaryPhase } from './features/summary/components/SummaryPhase';
import { FIXED_WEEKLY_COSTS } from './utils/constants';
import './index.css';

function App() {
  const { state, resetGame } = useGame();
  const GOAL_WEEKS = 4;

  if (state.phase === 'START_SCREEN') {
    return <StartScreen />;
  }

  if (state.phase === 'BANKRUPTCY') {
    return (
      <div className="game-app-container phase-animation" style={{ textAlign: 'center', borderTop: '8px solid #EF4444' }}>
        <h1 style={{ color: '#EF4444', fontSize: '36px' }}>💸 ¡QUIEBRA FINANCIERA! 💸</h1>
        <p style={{ fontSize: '18px' }}>Tu caja quedó en negativo. No lograste reunir lo necesario para pagar los costos operativos de la <strong>Semana {state.week}</strong>.</p>
        <button onClick={resetGame} style={{ padding: '12px 24px', fontSize: '18px', backgroundColor: '#EF4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', marginTop: '20px' }}>Intentar de nuevo</button>
      </div>
    );
  }

  if (state.phase === 'VICTORY') {
    return (
      <div className="game-app-container phase-animation" style={{ textAlign: 'center', borderTop: '8px solid #10B981' }}>
        <h1 style={{ color: '#10B981', fontSize: '36px' }}>🏆 ¡EMPRENDEDOR EXITOSO! 🏆</h1>
        <p style={{ fontSize: '18px' }}>¡Felicitaciones! Completaste las 4 semanas del mes manteniendo tu negocio a flote y superando los retos económicos.</p>
        <div style={{ backgroundColor: '#ecfdf5', padding: '20px', borderRadius: '12px', margin: '20px 0', border: '2px dashed #34d399' }}>
          <p style={{ margin: 0, fontSize: '20px' }}>Tu Capital Final en Caja Registradora:</p>
          <h2 style={{ margin: 0, color: '#059669', fontSize: '42px', fontWeight: 900 }}>${state.cashInRegister}</h2>
        </div>
        <button onClick={resetGame} style={{ padding: '12px 24px', fontSize: '18px', backgroundColor: '#10B981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>Jugar otra vez</button>
      </div>
    );
  }

  return (
    <div className="game-app-container">
      <header style={{ backgroundColor: '#fef3c7', padding: '15px 20px', borderRadius: '16px', border: '2px solid #fde68a', marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px' }}>🏫</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '22px', color: '#111827', fontWeight: 800 }}>Mi Tiendita Escolar</h1>
              <p style={{ margin: 0, color: '#4b5563', fontSize: '13px' }}>Simulador de Educación Financiera</p>
            </div>
          </div>
          <button onClick={resetGame} style={{ backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            ↺ Reiniciar
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px', fontWeight: 'bold', color: '#4B5563' }}>
          <span>Calendario Mensual:</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4].map((w) => {
              const isCurrent = state.week === w;
              const isPast = state.week > w;
              return (
                <div key={w} style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isCurrent ? '#fbbf24' : isPast ? '#34d399' : '#e5e7eb',
                  color: isCurrent || isPast ? '#ffffff' : '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  border: isCurrent ? '2px solid #b45309' : '1px solid #cbd5e1',
                  boxShadow: isCurrent ? '0 0 8px rgba(251, 191, 36, 0.6)' : 'none',
                  transition: 'all 0.3s'
                }}>
                  {w}
                </div>
              );
            })}
          </div>
          <span style={{ marginLeft: 'auto', backgroundColor: '#fff', padding: '4px 10px', borderRadius: '8px', border: '1px solid #fde68a' }}>
            Semana {state.week} de 4
          </span>
        </div>
      </header>

      <main className="phase-animation" key={state.phase} style={{ minHeight: '400px' }}>
        {(() => {
          switch (state.phase) {
            case 'MANAGEMENT': return <ManagementPhase />;
            case 'BILLING': return <BillingPhase />;
            case 'CASHBACK': return <CashbackPhase />;
            case 'SUMMARY': return <SummaryPhase />;
            default: return <div>Fase no encontrada</div>;
          }
        })()}
      </main>

      <footer style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px dashed #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6b7280', fontSize: '12px', letterSpacing: '1px', fontWeight: 'bold' }}>
          MODO: {state.phase}
        </span>
        <div style={{ backgroundColor: state.cashInRegister < FIXED_WEEKLY_COSTS ? '#fef2f2' : '#f0fdf4', padding: '10px 20px', borderRadius: '20px', border: `2px solid ${state.cashInRegister < FIXED_WEEKLY_COSTS ? '#fca5a5' : '#86efac'}` }}>
          <strong style={{ fontSize: '16px', color: state.cashInRegister < FIXED_WEEKLY_COSTS ? '#dc2626' : '#16a34a' }}>
            Caja Registradora: ${state.cashInRegister}
          </strong>
        </div>
      </footer>
    </div>
  );
}

export default App;
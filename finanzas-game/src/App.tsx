// src/App.tsx - VERSIÓN DEFINITIVA CON RANKING Y QUÉBREDAS PREMIUM
import React, { useState, useEffect, FormEvent } from 'react';
import { useGame } from './context/useGame';
import { StartScreen } from './features/management/components/StartScreen';
import { ManagementPhase } from './features/management/components/ManagementPhase';
import { BillingPhase } from './features/action/components/BillingPhase';
import { CashbackPhase } from './features/action/components/CashbackPhase';
import { SummaryPhase } from './features/summary/components/SummaryPhase';
import { FIXED_WEEKLY_COSTS } from './utils/constants';
import './index.css';

interface HighScore { 
  name: string; 
  cash: number; 
  date: string; 
}

function App() {
  const { state, resetGame } = useGame();
  const GOAL_WEEKS = 4;

  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
  const [hasSavedRecord, setHasSavedRecord] = useState(false);

  // Sincronizar el ranking desde el almacenamiento del navegador
  useEffect(() => {
    if (state.phase === 'VICTORY') {
      const savedScores = localStorage.getItem('michi_leaderboard');
      if (savedScores) setLeaderboard(JSON.parse(savedScores));
      setHasSavedRecord(false);
      setPlayerName('');
    }
  }, [state.phase]);

  const handleSaveRecord = (e: FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const newRecord: HighScore = {
      name: playerName.trim(),
      cash: state.cashInRegister,
      date: new Date().toLocaleDateString()
    };

    const updatedLeaderboard = [...leaderboard, newRecord]
      .sort((a, b) => b.cash - a.cash)
      .slice(0, 5); // Guardamos estrictamente el TOP 5

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('michi_leaderboard', JSON.stringify(updatedLeaderboard));
    setHasSavedRecord(true);
  };

  // =========================================================================
  // 1. PANTALLA DE INICIO (LANDING PORTADA)
  // =========================================================================
  if (state.phase === 'START_SCREEN') {
    return <StartScreen />;
  }

  // =========================================================================
  // 2. PANTALLA PANORÁMICA DE QUIEBRA FINANCIERA (MICHI TRISTE)
  // =========================================================================
  if (state.phase === 'BANKRUPTCY') {
    const summary = state.currentWeekSummary;
    const totalExpenses = (summary?.merchandiseCost || 0) + (summary?.fixedCosts || FIXED_WEEKLY_COSTS) + (summary?.cashbackErrors || 0);

    return (
      <div className="phase-animation" style={{
        backgroundColor: '#2b221e',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%)',
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0, left: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, boxSizing: 'border-box', padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#f4eae1',
          border: '6px solid #5c4033',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          borderRadius: '16px',
          width: '100%', maxWidth: '850px',
          padding: '25px 40px', boxSizing: 'border-box'
        }}>
          <h1 style={{ color: '#991b1b', fontSize: '32px', fontWeight: '900', margin: '0 0 10px 0', textAlign: 'center', display: 'flex', alignItems: 'center', gap: '15px', justifyContent: 'center' }}>
            💸 ¡QUIEBRA FINANCIERA! 💸
          </h1>
          <p style={{ textAlign: 'center', color: '#4b5563', fontSize: '15px', margin: '0 0 25px 0' }}>
            Tu caja quedó en negativo. No lograste reunir lo necesario para pagar los costos operativos de la <strong>Semana {state.week}</strong>.
          </p>

          <div style={{ display: 'flex', gap: '30px', alignItems: 'center', marginBottom: '25px' }}>
            {/* Balance Card */}
            <div style={{ flex: 1, backgroundColor: '#fff7ed', border: '2px solid #cbd5e1', borderRadius: '12px', padding: '15px' }}>
              <h3 style={{ margin: '0 0 12px 0', color: '#1e293b', fontSize: '15px', borderBottom: '2px solid #e2e8f0', paddingBottom: '4px', textAlign: 'center' }}>
                Balance Semana {state.week}
              </h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: '14px' }}>
                <span>Ingresos de la Semana:</span>
                <span style={{ color: '#16a34a', fontWeight: 'bold' }}>+${summary?.salesIncome || 0}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '8px 0', fontSize: '14px' }}>
                <span>Gastos Operativos:</span>
                <span style={{ color: '#dc2626', fontWeight: 'bold' }}>-${totalExpenses}.00</span>
              </div>
              <hr style={{ border: 0, borderTop: '2px dashed #cbd5e1', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 'bold' }}>
                <span>Saldo de Caja Final:</span>
                <span style={{ color: '#b91c1c' }}>${state.cashInRegister}.00</span>
              </div>
            </div>

            {/* Acción y Michi Triste */}
            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
              <button onClick={resetGame} style={{ flex: 1, backgroundColor: '#dc2626', color: 'white', padding: '16px 20px', fontSize: '15px', fontWeight: 'bold', borderRadius: '12px', border: '2px solid #991b1b', boxShadow: '0 5px 0px #991b1b', cursor: 'pointer' }}>
                Intentar Semana {state.week} de Nuevo
              </button>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/michi_triste.png" alt="Michi triste" style={{ width: '120px', height: 'auto', filter: 'drop-shadow(0px 8px 12px rgba(0,0,0,0.3))' }} />
                <span style={{ fontSize: '24px', marginTop: '-10px' }}>📠</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', borderTop: '2px solid #e2e8f0', paddingTop: '15px' }}>
            <button onClick={() => alert("Consejo: ¡Guarda siempre fondos para pagar los $25 obligatorios de arriendo antes de comprar stock!")} style={{ backgroundColor: '#475569', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
              Aprender Guía de Gestión
            </button>
            <button onClick={resetGame} style={{ backgroundColor: '#64748b', color: 'white', padding: '10px 20px', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold' }}>
              Volver al Menú Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. NUEVA PANTALLA IMPONENTE DE "EMPRENDEDOR EXITOSO" (ESTILO COFRE/MADERA)
  // =========================================================================
  if (state.phase === 'VICTORY') {
    return (
      <div className="phase-animation" style={{
        /* Fondo de madera noble y calidez dorada */
        background: 'linear-gradient(135deg, #4a2f13 0%, #241405 100%)',
        width: '100vw',
        minHeight: '100vh',
        position: 'fixed',
        top: 0, left: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, boxSizing: 'border-box', padding: '30px', overflowY: 'auto'
      }}>
        <div style={{
          /* Contenedor principal estilo retablo o cartel tallado de madera */
          background: 'linear-gradient(180deg, #ecdcb9 0%, #cfb382 100%)',
          border: '8px solid #6b4423',
          outline: '3px solid #f59e0b',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,0,0,0.15)',
          borderRadius: '24px',
          width: '100%', maxWidth: '750px',
          padding: '30px 40px', boxSizing: 'border-box',
          textAlign: 'center'
        }}>
          
          {/* TÍTULO GRANDE CON RELIEVE Y ESTRELLAS DESTACADAS */}
          <h1 style={{
            fontSize: '44px', fontWeight: 900, margin: '0 0 5px 0',
            color: '#15803d', letterSpacing: '1px',
            textShadow: '2px 2px 0px #fff, -2px -2px 0px #fff, 2px -2px 0px #fff, -2px 2px 0px #fff, 0px 6px 12px rgba(0,0,0,0.3)'
          }}>
            ✨¡EMPRENDEDOR EXITOSO!✨
          </h1>
          <p style={{ fontSize: '15px', color: '#513a21', fontWeight: 'bold', margin: '0 0 25px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            ¡Completaste las 4 semanas del mes manteniendo tu negocio a flote!
          </p>

          {/* FILA DE PODIO: TROFEO - COFRE DE CAPITAL - TROFEO */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
            
            <div style={{ fontSize: '70px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>🏆</div>
            
            {/* Bloque central: El Cofre del Tesoro con el Capital Final */}
            <div style={{
              flex: 1,
              background: 'linear-gradient(180deg, #451a03 0%, #1c0d02 100%)',
              border: '4px solid #d97706',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 12px 24px rgba(0,0,0,0.4), inset 0 0 15px rgba(217,119,6,0.3)',
              position: 'relative'
            }}>
              <span style={{ fontSize: '13px', color: '#fcd34d', fontWeight: '900', letterSpacing: '1px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                🪙 Capital Final Neto:
              </span>
              <div style={{ 
                fontSize: '48px', fontWeight: 900, color: '#4ade80', fontFamily: 'monospace',
                textShadow: '0 0 15px rgba(74,222,128,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
              }}>
                <span>${state.cashInRegister}</span>
              </div>
            </div>

            <div style={{ fontSize: '70px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.3))' }}>🏆</div>
          </div>

          {/* SECCIÓN INTERMEDIA: CARTELERA PARA GUARDAR RÉCORD */}
          <div style={{
            backgroundColor: '#ebd9b4',
            border: '2px solid #a1824a',
            borderRadius: '16px',
            padding: '15px 20px',
            marginBottom: '25px',
            boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)'
          }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#451a03', fontSize: '15px', fontWeight: 'bold' }}>
              📝 Cartelera de Emprendedores
            </h4>
            
            {!hasSavedRecord ? (
              <form onSubmit={handleSaveRecord} style={{ display: 'flex', gap: '12px' }}>
                <input 
                  type="text" 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)} 
                  placeholder="Escribe tu nombre de comerciante..." 
                  maxLength={14} 
                  style={{ 
                    flex: 1, padding: '12px 15px', fontSize: '15px', borderRadius: '10px', 
                    border: '2px solid #b45309', backgroundColor: '#fdfbc7', fontWeight: 'bold', color: '#451a03' 
                  }} 
                />
                <button 
                  type="submit" 
                  disabled={!playerName.trim()} 
                  style={{ 
                    backgroundColor: playerName.trim() ? '#16a34a' : '#9ca3af', 
                    color: 'white', padding: '0 25px', borderRadius: '10px', fontSize: '15px',
                    fontWeight: '900', border: '2px solid #15803d', boxShadow: playerName.trim() ? '0 4px 0px #14532d' : 'none', cursor: 'pointer'
                  }}
                >
                  Guardar Récord ✒️
                </button>
              </form>
            ) : (
              <div style={{ backgroundColor: '#d1e7dd', color: '#0f5132', padding: '10px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px' }}>
                🎉 ¡Fabuloso! Tu nombre ha quedado inmortalizado en la libreta de líderes.
              </div>
            )}
          </div>

          {/* TABLA DE POSICIONES: SALÓN DE LA FAMA (PERGAMINO ANTIGUO) */}
          <div style={{
            background: 'linear-gradient(180deg, #fefbf3 0%, #f5ecd7 100%)',
            border: '3px double #b45309',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 6px 15px rgba(0,0,0,0.1), inset 0 0 15px rgba(180,83,9,0.05)',
            marginBottom: '30px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#7c2d12', fontWeight: 800, fontSize: '17px', letterSpacing: '0.5px' }}>
              👑 SALÓN DE LA FAMA: LÍDERES DE LA TIENDITA
            </h3>

            {leaderboard.length === 0 ? (
              /* Mensaje de historia espera idéntico a tu boceto */
              <div style={{ padding: '15px 0', color: '#7c2d12', opacity: 0.8, fontStyle: 'italic' }}>
                📜 ¡Tu historia espera!<br />Sé el primero en entrar al Salón de la Fama.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {leaderboard.map((score, index) => {
                  const medals = ['🥇', '🥈', '🥉', ' #4 ', ' #5 '];
                  return (
                    <div key={index} style={{ 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
                      backgroundColor: index === 0 ? '#fef08a' : '#ffffff', 
                      padding: '10px 20px', borderRadius: '10px', 
                      border: '1px solid #fed7aa', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontWeight: 'bold' }}>
                        <span style={{ fontSize: '16px' }}>{medals[index]}</span>
                        <span style={{ color: '#431407' }}>{score.name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '900', color: '#16a34a' }}>
                        <span>${score.cash}</span>
                        <span>💰</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* BOTÓN GRANDE INFERIOR: VOLVER A JUGAR */}
          <div style={{
            background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
            padding: '4px 6px', borderRadius: '16px', border: '2px solid #2563eb', display: 'flex'
          }}>
            <button 
              onClick={resetGame} 
              style={{
                width: '100%', background: 'linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%)',
                color: 'white', padding: '16px', border: '1px solid #1e40af', borderRadius: '12px',
                fontSize: '20px', fontWeight: '900', cursor: 'pointer', textTransform: 'uppercase',
                boxShadow: '0 5px 0px #1e3a8a, inset 0 2px 4px rgba(255,255,255,0.4)'
              }}
              onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(4px)'; e.currentTarget.style.boxShadow = '0 1px 0px #1e3a8a'; }}
              onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0px)'; e.currentTarget.style.boxShadow = '0 5px 0px #1e3a8a'; }}
            >
              🔄 Volver a Jugar (Nuevo Mes)
            </button>
          </div>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 4. INTERFAZ DE GAMEPLAY ORDINARIO (SEMANAS 1 A 4)
  // =========================================================================
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
          <button onClick={resetGame} style={{ backgroundColor: '#ffffff', color: '#374151', border: '1px solid #d1d5db', padding: '8px 16px', borderRadius: '12px', fontWeight: 'bold' }}>
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
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: isCurrent ? '#fbbf24' : isPast ? '#34d399' : '#e5e7eb',
                  color: isCurrent || isPast ? '#ffffff' : '#9ca3af',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                  border: isCurrent ? '2px solid #b45309' : '1px solid #cbd5e1'
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
        <span style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold' }}>MODO: {state.phase}</span>
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
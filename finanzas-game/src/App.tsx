import { useState, useEffect, type FormEvent } from 'react';
import { useGame } from './context/useGame';
import { StartScreen } from './features/management/components/StartScreen';
import { ManagementPhase } from './features/management/components/ManagementPhase';
import { BillingPhase } from './features/action/components/BillingPhase';
import { CashbackPhase } from './features/action/components/CashbackPhase';
import { SummaryPhase } from './features/summary/components/SummaryPhase';
import { EventModal } from './features/management/components/EventModal';
import { FIXED_WEEKLY_COSTS } from './utils/constants';
import { Button } from './components/ui/Button';
import { Card } from './components/ui/Card';
import './index.css';

interface HighScore { 
  name: string; 
  cash: number; 
  date: string; 
}

function App() {
  const { state, resetGame } = useGame();
  
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);
  const [hasSavedRecord, setHasSavedRecord] = useState(false);

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
      .slice(0, 5);

    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('michi_leaderboard', JSON.stringify(updatedLeaderboard));
    setHasSavedRecord(true);
  };

  if (state.phase === 'START_SCREEN') {
    return <StartScreen />;
  }

  if (state.phase === 'BANKRUPTCY') {
    const summary = state.currentWeekSummary;
    const totalExpenses = (summary?.merchandiseCost || 0) + (summary?.fixedCosts || FIXED_WEEKLY_COSTS) + (summary?.cashbackErrors || 0);

    return (
      <div className="phase-animation" style={{
        backgroundColor: 'var(--text)',
        backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.9) 100%)',
        width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, padding: '20px'
      }}>
        <Card variant="danger" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ color: 'var(--error)', fontSize: '3rem', fontWeight: '900', marginBottom: '1rem' }}>
            💸 ¡QUIEBRA! 💸
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2rem' }}>
            No lograste reunir lo necesario para pagar los costos operativos de la <strong>Semana {state.week}</strong>.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div className="premium-card" style={{ backgroundColor: 'var(--background)' }}>
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid #ddd' }}>Balance Semana {state.week}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Saldo Inicial:</span>
                <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>${(summary?.initialCash || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Ingresos:</span>
                <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>+${(summary?.salesIncome || 0).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Gastos:</span>
                <span style={{ color: 'var(--error)', fontWeight: 'bold' }}>-${totalExpenses.toFixed(2)}</span>
              </div>
              <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px dashed #ccc' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '800' }}>
                <span>Saldo Final:</span>
                <span style={{ color: 'var(--error)' }}>${state.cashInRegister.toFixed(2)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
              <Button variant="danger" size="lg" fullWidth onClick={resetGame}>
                Reintentar Semana {state.week}
              </Button>
              <Button variant="outline" fullWidth onClick={resetGame}>
                Menú Principal
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (state.phase === 'VICTORY') {
    return (
      <div className="phase-animation" style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        width: '100vw', minHeight: '100vh', position: 'fixed', top: 0, left: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2000, padding: '30px', overflowY: 'auto'
      }}>
        <Card variant="accent" style={{ maxWidth: '800px', width: '100%', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '3.5rem', fontWeight: 900, marginBottom: '0.5rem',
            color: 'var(--success)', textShadow: '0 10px 20px rgba(16, 185, 129, 0.2)'
          }}>
            ✨¡ÉXITO!✨
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
            ¡Eres un experto en finanzas! Has mantenido tu negocio a flote todo el mes.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginBottom: '3rem' }}>
             <div style={{ fontSize: '5rem' }}>🏆</div>
             <div className="premium-card" style={{ backgroundColor: 'var(--text)', color: 'white', padding: '1.5rem 3rem' }}>
               <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '900', textTransform: 'uppercase' }}>Capital Final</span>
               <div style={{ fontSize: '3.5rem', fontWeight: '900', color: 'var(--primary)' }}>${state.cashInRegister.toFixed(2)}</div>
             </div>
             <div style={{ fontSize: '5rem' }}>🏆</div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            {!hasSavedRecord ? (
              <form onSubmit={handleSaveRecord} style={{ display: 'flex', gap: '1rem' }}>
                <input 
                  type="text" value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)} 
                  placeholder="Tu nombre de comerciante..." 
                  maxLength={14} 
                  style={{ 
                    flex: 1, padding: '1rem', borderRadius: 'var(--radius)', 
                    border: '2px solid var(--background)', backgroundColor: 'var(--background)',
                    fontSize: '1.1rem', fontWeight: '600'
                  }} 
                />
                <Button type="submit" disabled={!playerName.trim()} size="lg">
                  Guardar Récord ✒️
                </Button>
              </form>
            ) : (
              <div className="premium-card" style={{ backgroundColor: 'var(--success)15', color: 'var(--success)', fontWeight: '700' }}>
                🎉 ¡Registro guardado en el Salón de la Fama!
              </div>
            )}
          </div>

          <Card title="👑 Salón de la Fama" style={{ textAlign: 'left', backgroundColor: 'var(--background)' }}>
             {leaderboard.length === 0 ? (
               <p style={{ textAlign: 'center', fontStyle: 'italic', color: 'var(--text-muted)' }}>¡Tu historia espera!</p>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                 {leaderboard.map((score, index) => (
                   <div key={index} style={{ 
                     display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', 
                     backgroundColor: 'white', borderRadius: 'var(--radius)', border: '1px solid #eee'
                   }}>
                     <span style={{ fontWeight: '700' }}>{index + 1}. {score.name}</span>
                     <span style={{ fontWeight: '900', color: 'var(--success)' }}>${score.cash} 💰</span>
                   </div>
                 ))}
               </div>
             )}
          </Card>

          <Button variant="secondary" size="lg" fullWidth onClick={resetGame} style={{ marginTop: '2rem' }}>
            🔄 Jugar Nuevo Mes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="game-app-container">
      <EventModal />
      <header className="premium-card" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '3rem', backgroundColor: 'var(--background)', padding: '0.5rem', borderRadius: 'var(--radius)' }}>🏫</div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text)' }}>Mi Tiendita Escolar</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: '500' }}>Simulador de Educación Financiera Pro</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calendario</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              {[1, 2, 3, 4].map((w) => (
                <div key={w} style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  backgroundColor: state.week === w ? 'var(--accent)' : state.week > w ? 'var(--success)' : 'var(--background)',
                  color: state.week >= w ? 'white' : 'var(--text-muted)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem',
                  border: state.week === w ? '2px solid white' : 'none',
                  boxShadow: state.week === w ? '0 0 0 2px var(--accent)' : 'none'
                }}>
                  {w}
                </div>
              ))}
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetGame}>Reiniciar</Button>
        </div>
      </header>

      <main className="phase-animation" key={state.phase} style={{ flex: 1 }}>
        {(() => {
          switch (state.phase) {
            case 'MANAGEMENT': 
            case 'EVENT': return <ManagementPhase />;
            case 'BILLING': return <BillingPhase />;
            case 'CASHBACK': return <CashbackPhase />;
            case 'SUMMARY': return <SummaryPhase />;
            default: return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando fase...</div>;
          }
        })()}
      </main>

      <footer className="mobile-stack" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', gap: '1rem' }}>
        <div style={{ fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Fase Actual: <span style={{ color: 'var(--secondary)' }}>{state.phase}</span>
        </div>
        <div className="glass" style={{ padding: '0.5rem 1.5rem', borderRadius: 'var(--radius-full)', border: '1px solid #ddd' }}>
          <strong style={{ fontSize: '1.1rem', color: state.cashInRegister < 20 ? 'var(--error)' : 'var(--success)' }}>
            💰 Caja: ${state.cashInRegister.toFixed(2)}
          </strong>
        </div>
      </footer>
    </div>
  );
}

export default App;
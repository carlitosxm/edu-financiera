// src/features/action/components/CashbackPhase.tsx
import React, { useState } from 'react';
import { useGame } from '../../../context/useGame';
import { PRODUCT_CATALOG } from '../../../utils/constants';
import { sounds } from '../../../utils/sounds';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

interface CoinParticle {
  id: number;
  left: number;
  delay: number;
}

export const CashbackPhase: React.FC = () => {
  const { state, submitCashback } = useGame();
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [penaltyAccumulated, setPenaltyAccumulated] = useState<number>(0);
  const [errorFeedback, setErrorFeedback] = useState<string>('');
  const [coins, setCoins] = useState<CoinParticle[]>([]);

  const currentCustomer = state.customersQueue[state.currentCustomerIndex];

  const realTotal = Math.round(currentCustomer?.cart.reduce((acc, item) => {
    const product = PRODUCT_CATALOG.find((p) => p.id === item.productId);
    let sellPrice = product?.sellPrice || 0;
    if (state.activeEvent?.type === 'PRICE_CHANGE' && state.activeEvent.productId === item.productId) {
      sellPrice *= state.activeEvent.impact;
    }
    return acc + (sellPrice * item.quantity);
  }, 0) || 0);

  const expectedChange = Math.round((currentCustomer?.paymentWith || 0) - realTotal);
  const changeGivenNum = parseInt(displayValue, 10) || 0;
  
  // Check for calculator upgrade
  const hasCalculator = state.upgrades.find(u => u.type === 'CALCULATOR' && u.purchased);

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
      sounds.playRegister();
      const particles = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        left: Math.random() * 80 + 10,
        delay: i * 0.05
      }));
      setCoins(particles);

      setTimeout(() => {
        submitCashback(changeGivenNum, expectedChange, penaltyAccumulated);
        setDisplayValue('0');
        setPenaltyAccumulated(0);
        setErrorFeedback('');
        setCoins([]);
      }, 1000);

    } else {
      sounds.playError();
      setPenaltyAccumulated((prev) => prev + 2);
      setErrorFeedback(`⚠️ ¡Vuelto incorrecto! El cliente reclama que el vuelto real debe ser de $${expectedChange}. Se aplican $2 de multa.`);
    }
  };

  if (!currentCustomer) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }} className="phase-animation">
      {coins.map((coin) => (
        <span key={coin.id} className="michi-coin-particle" style={{ left: `${coin.left}%`, bottom: '100px', animationDelay: `${coin.delay}s` }}>🪙</span>
      ))}

      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)' }}>Entregar Vuelto</h2>
        <p style={{ color: 'var(--text-muted)' }}>No te equivoques o perderás dinero en multas.</p>
      </div>

      {errorFeedback && (
        <div style={{ backgroundColor: 'var(--error)15', color: 'var(--error)', padding: '1rem', borderRadius: 'var(--radius)', textAlign: 'center', fontWeight: '700', border: '1px solid var(--error)30', animation: 'fadeIn 0.3s ease' }}>
          {errorFeedback}
        </div>
      )}

      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
        
        <Card title="Cliente">
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '4rem' }}>{currentCustomer.avatar}</div>
            <div style={{ fontWeight: '800' }}>{currentCustomer.name}</div>
            <div style={{ backgroundColor: 'var(--background)', padding: '1rem', borderRadius: 'var(--radius)', textAlign: 'left', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Total:</span><span style={{fontWeight: '700'}}>${realTotal}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Pagó con:</span><span style={{fontWeight: '700', color: 'var(--primary)'}}>${currentCustomer.paymentWith}</span></div>
            </div>
            {hasCalculator && (
              <div style={{ backgroundColor: 'var(--secondary)15', color: 'var(--secondary)', padding: '0.75rem', borderRadius: 'var(--radius)', fontSize: '0.85rem', fontWeight: '800' }}>
                📲 Calc Pro: El vuelto es ${expectedChange}
              </div>
            )}
          </div>
        </Card>

        <div style={{ 
          backgroundColor: '#334155', padding: '1.5rem', borderRadius: 'var(--radius-lg)', 
          boxShadow: '0 10px 0px #1e293b', border: '4px solid #475569'
        }}>
          <div style={{ 
            backgroundColor: '#0f172a', color: '#4ade80', padding: '1.5rem', borderRadius: 'var(--radius)', 
            textAlign: 'right', fontSize: '3rem', fontFamily: 'monospace', marginBottom: '1.5rem', 
            border: '2px solid #1e293b', textShadow: '0 0 10px rgba(74, 222, 128, 0.4)' 
          }}>
            {displayValue}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((n) => (
              <Button key={n} onClick={() => handleNumberClick(n)} variant="outline" style={{ backgroundColor: 'white', border: 'none', fontSize: '1.5rem' }}>{n}</Button>
            ))}
            <Button onClick={handleClear} variant="danger" style={{ fontSize: '1.2rem' }}>C</Button>
            <Button onClick={handleDelete} variant="accent" style={{ fontSize: '1.2rem' }}>✕</Button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'space-between' }}>
          <Card title="Auditoría" style={{ fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Caja:</span><span>${state.cashInRegister}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>+ Recibido:</span><span>${currentCustomer.paymentWith}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--secondary)', fontWeight: '800' }}><span>- Vuelto:</span><span>-${displayValue}</span></div>
              {penaltyAccumulated > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--error)', fontWeight: '800' }}><span>- Multas:</span><span>-${penaltyAccumulated}</span></div>}
              <hr style={{ margin: '0.5rem 0', border: 'none', borderTop: '1px dashed #ddd' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '900', fontSize: '1rem', color: 'var(--primary)' }}>
                <span>Proyectado:</span>
                <span>${state.cashInRegister + currentCustomer.paymentWith - changeGivenNum - penaltyAccumulated}</span>
              </div>
            </div>
          </Card>

          <Button variant="primary" size="lg" fullWidth onClick={handleConfirm} style={{ padding: '1.5rem' }}>
            Confirmar ✅
          </Button>
        </div>
      </div>
    </div>
  );
};
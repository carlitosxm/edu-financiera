import React from 'react';
import { useGame } from '../../../context/useGame';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const EventModal: React.FC = () => {
  const { state, acknowledgeEvent } = useGame();

  if (!state.activeEvent || state.phase !== 'EVENT') return null;

  const { title, description, icon } = {
    title: state.activeEvent.title,
    description: state.activeEvent.description,
    icon: state.activeEvent.type === 'PRICE_CHANGE' ? '📈' : 
          state.activeEvent.type === 'CASH_BONUS' ? '💰' : 
          state.activeEvent.type === 'FIXED_COST_CHANGE' ? '💸' : '🛒'
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 3000,
      padding: '20px'
    }}>
      <Card variant="accent" style={{ maxWidth: '500px', textAlign: 'center', animation: 'fadeIn 0.5s ease-out' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{icon}</div>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)', marginBottom: '1rem' }}>{title}</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{description}</p>
        <Button fullWidth size="lg" onClick={acknowledgeEvent}>
          Entendido
        </Button>
      </Card>
    </div>
  );
};

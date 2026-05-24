// src/features/action/components/BillingPhase.tsx
import React from 'react';
import { useGame } from '../../../context/useGame';
import { PRODUCT_CATALOG } from '../../../utils/constants';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const BillingPhase: React.FC = () => {
  const { state, goToCashback } = useGame();
  const currentCustomer = state.customersQueue[state.currentCustomerIndex];

  if (!currentCustomer) return <div style={{ textAlign: 'center', padding: '4rem' }}>Cargando cliente...</div>;

  const realTotal = Math.round(currentCustomer.cart.reduce((acc, item) => {
    const product = PRODUCT_CATALOG.find((p) => p.id === item.productId);
    let sellPrice = product?.sellPrice || 0;
    
    // Apply event impact if active
    if (state.activeEvent?.type === 'PRICE_CHANGE' && state.activeEvent.productId === item.productId) {
      sellPrice *= state.activeEvent.impact;
    }
    
    return acc + (sellPrice * item.quantity);
  }, 0));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)' }}>Venta en Proceso</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Atendiendo a <strong>{currentCustomer.name}</strong> ({state.currentCustomerIndex + 1} / {state.customersQueue.length})
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
        <Card title="Recibo de Venta" style={{ fontFamily: 'monospace' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1rem 0' }}>
            {currentCustomer.cart.map((item, index) => {
              const product = PRODUCT_CATALOG.find((p) => p.id === item.productId);
              let sellPrice = product?.sellPrice || 0;
              const isAffected = state.activeEvent?.type === 'PRICE_CHANGE' && state.activeEvent.productId === item.productId;
              if (isAffected) sellPrice *= state.activeEvent!.impact;

              return (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem' }}>
                  <span>{item.quantity}x {product?.name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: '700' }}>${sellPrice * item.quantity}</span>
                    {isAffected && <div style={{ fontSize: '0.7rem', color: 'var(--accent)' }}>(PRECIO ESPECIAL ✨)</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ borderTop: '2.5px solid var(--text)', paddingTop: '1.5rem', marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', fontSize: '2rem', fontWeight: '900' }}>
            <span>TOTAL:</span>
            <span style={{ color: 'var(--primary)' }}>${realTotal}</span>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card variant="glass" style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{currentCustomer.avatar}</div>
            <div style={{ 
              backgroundColor: 'white', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', 
              boxShadow: 'var(--shadow)', display: 'inline-block', position: 'relative',
              fontWeight: '800', fontSize: '1.2rem'
            }}>
              "¡Hola! Necesito esto."
              <div style={{ 
                position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', 
                width: '16px', height: '16px', backgroundColor: 'white',
              }} />
            </div>
          </Card>
          
          <Button size="lg" fullWidth onClick={goToCashback} style={{ padding: '1.5rem', fontSize: '1.4rem' }}>
            Cobrar ${realTotal} 📠
          </Button>
        </div>
      </div>
    </div>
  );
};
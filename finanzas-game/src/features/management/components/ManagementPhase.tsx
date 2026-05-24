// src/features/management/components/ManagementPhase.tsx
import React, { useEffect, useState } from 'react';
import { useGame } from '../../../context/useGame';
import { PRODUCT_CATALOG, EVENTS } from '../../../utils/constants';
import { generateCustomersQueue } from '../../../utils/customerGenerator';
import { sounds } from '../../../utils/sounds';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { StatBox } from '../../../components/ui/StatBox';

export const ManagementPhase: React.FC = () => {
  const { state, buyStock, startDay, triggerEvent, buyUpgrade } = useGame();
  const [showUpgrades, setShowUpgrades] = useState(false);
  
  const totalStock = Object.values(state.inventory).reduce((acc, qty) => acc + qty, 0);

  // Trigger random event at the start of the week if not already set
  useEffect(() => {
    if (state.phase === 'MANAGEMENT' && !state.activeEvent) {
      const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
      triggerEvent(randomEvent);
    }
  }, [state.phase, state.activeEvent]);

  const handleStartWeek = () => {
    let customerCount = Math.floor(Math.random() * 5) + 3; // Base scale 3-7
    
    // Apply marketing upgrade
    const marketingUpgrade = state.upgrades.find(u => u.type === 'MARKETING' && u.purchased);
    if (marketingUpgrade) customerCount += marketingUpgrade.impact;

    // Apply demand event
    if (state.activeEvent?.type === 'DEMAND_CHANGE') {
      customerCount = Math.round(customerCount * state.activeEvent.impact);
    }

    // Cap customers at 5 per week OR total available units
    const finalCustomerCount = Math.min(customerCount, 5, totalStock);

    const newCustomers = generateCustomersQueue(finalCustomerCount, state.inventory, state.activeEvent);
    startDay(newCustomers);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <StatBox label="Caja" value={`$${state.cashInRegister.toFixed(2)}`} icon="💰" color="var(--success)" />
        <StatBox label="Inventario" value={`${totalStock} unidades`} icon="📦" color="var(--secondary)" />
        <StatBox label="Costos Fijos" value={`$${state.currentWeekSummary.fixedCosts.toFixed(2)}`} icon="🏢" color="var(--error)" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '-1rem' }}>
        <Button 
          variant={!showUpgrades ? 'primary' : 'outline'} 
          onClick={() => setShowUpgrades(false)}
        >
          📦 Mercancía
        </Button>
        <Button 
          variant={showUpgrades ? 'primary' : 'outline'} 
          onClick={() => setShowUpgrades(true)}
        >
          🚀 Mejoras
        </Button>
      </div>

      {!showUpgrades ? (
        <Card title={`Catálogo Mayorista - Semana ${state.week}`}>
          <div className="mobile-grid-1" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {PRODUCT_CATALOG.map((product) => {
              const currentStock = state.inventory[product.id] || 0;
              const canAffordOne = state.cashInRegister >= product.costPrice;
              
              // Event impact on sell price
              let displayPrice = product.sellPrice;
              const isAffected = state.activeEvent?.type === 'PRICE_CHANGE' && state.activeEvent.productId === product.id;
              if (isAffected) displayPrice *= state.activeEvent!.impact;

              return (
                <div key={product.id} className="premium-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--background)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ fontSize: '2.5rem', backgroundColor: 'white', padding: '0.5rem', borderRadius: 'var(--radius)' }}>
                      {product.icon}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem' }}>{product.name}</strong>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        Costo: <span style={{color: 'var(--error)', fontWeight: '700'}}>${product.costPrice.toFixed(2)}</span> | 
                        Venta: <span style={{color: 'var(--success)', fontWeight: '700'}}>${displayPrice.toFixed(2)}</span>
                        {isAffected && <span style={{ color: 'var(--accent)', marginLeft: '5px' }}>🔥 Evento!</span>}
                      </div>
                      <div style={{ fontSize: '0.9rem', marginTop: '0.25rem', fontWeight: '800' }}>
                        Stock: <span style={{ color: currentStock < product.minStock ? 'var(--error)' : 'var(--success)' }}>{currentStock}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button 
                      size="sm"
                      onClick={() => { buyStock(product.id, 1); sounds.playCoin(); }} 
                      disabled={!canAffordOne} 
                    >
                      +1 (${product.costPrice.toFixed(2)})
                    </Button>
                    <Button 
                      size="sm"
                      variant="secondary"
                      onClick={() => { buyStock(product.id, 5); sounds.playCoin(); }} 
                      disabled={state.cashInRegister < (product.costPrice * 5)} 
                    >
                      +5 (${(product.costPrice * 5).toFixed(2)})
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      ) : (
        <Card title="Mejoras para tu Tienda">
          <div className="mobile-grid-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {state.upgrades.map((upgrade) => (
              <div key={upgrade.id} className="premium-card" style={{ 
                display: 'flex', flexDirection: 'column', gap: '1rem',
                opacity: upgrade.purchased ? 0.7 : 1,
                border: upgrade.purchased ? '2px solid var(--success)' : '1px solid #ddd'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{upgrade.icon}</div>
                  <div>
                    <strong style={{ display: 'block' }}>{upgrade.name}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{upgrade.description}</span>
                  </div>
                </div>
                <div style={{ marginTop: 'auto' }}>
                  {upgrade.purchased ? (
                    <div style={{ color: 'var(--success)', fontWeight: '800', textAlign: 'center', padding: '0.5rem' }}>
                      ✨ ADQUIRIDO
                    </div>
                  ) : (
                    <Button 
                      fullWidth 
                      variant="accent"
                      onClick={() => { buyUpgrade(upgrade.id); sounds.playCoin(); }}
                      disabled={state.cashInRegister < upgrade.cost}
                    >
                      Comprar (${upgrade.cost.toFixed(2)})
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Button 
        size="lg" 
        fullWidth 
        onClick={handleStartWeek} 
        disabled={totalStock === 0}
        variant={totalStock === 0 ? 'outline' : 'primary'}
        style={{ padding: '1.5rem', fontSize: '1.25rem' }}
      >
        {totalStock === 0 ? '🔒 Compra mercancía para abrir' : '🚀 ¡Abrir la Tienda!'}
      </Button>
    </div>
  );
};
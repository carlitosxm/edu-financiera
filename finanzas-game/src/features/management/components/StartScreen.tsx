// src/features/management/components/StartScreen.tsx
import React from 'react';
import { useGame } from '../../../context/useGame';
import { Button } from '../../../components/ui/Button';

export const StartScreen: React.FC = () => {
  const { startGame } = useGame();

  return (
    <div className="phase-animation" style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0, left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '2rem',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '10rem', marginBottom: '2rem', animation: 'floatCoinUp 3s ease-in-out infinite alternate' }}>
        🏫
      </div>
      
      <h1 style={{ 
        fontSize: '4rem', 
        fontWeight: '900', 
        color: 'var(--text)', 
        marginBottom: '1rem',
        letterSpacing: '-2px'
      }}>
        Mi Tiendita <span style={{ color: 'var(--primary)' }}>Escolar</span>
      </h1>
      
      <p style={{ 
        fontSize: '1.25rem', 
        color: 'var(--text-muted)', 
        marginBottom: '3rem',
        maxWidth: '600px'
      }}>
        Aprende a gestionar tu dinero, invertir en stock y hacer crecer tu propio negocio escolar en 4 semanas.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '400px' }}>
        <Button 
          size="lg" 
          fullWidth 
          onClick={startGame}
          style={{ padding: '1.8rem', fontSize: '1.5rem' }}
        >
          🚀 Empezar Negocio
        </Button>
        <div style={{ 
          fontSize: '0.85rem', 
          fontWeight: '800', 
          color: 'var(--accent)', 
          textTransform: 'uppercase', 
          letterSpacing: '2px',
          backgroundColor: 'white',
          padding: '0.5rem 1rem',
          borderRadius: 'var(--radius-full)',
          boxShadow: 'var(--shadow)'
        }}>
          Meta: Sobrevivir 4 Semanas
        </div>
      </div>

      <footer style={{ position: 'absolute', bottom: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '500' }}>
        Desarrollado para Educación Financiera Pro &copy; 2026
      </footer>
    </div>
  );
};
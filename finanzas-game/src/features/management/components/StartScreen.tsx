// src/features/management/components/StartScreen.tsx
import React from 'react';
import { useGame } from '../../../context/useGame';

export const StartScreen: React.FC = () => {
  const { startGame } = useGame();

  return (
    <div className="phase-animation" style={{
      backgroundImage: `url('/michi-fondo.jpg')`, 
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain', 
      backgroundColor: '#fdf6e3', 
      width: '100vw',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end', 
      paddingBottom: '12vh', 
      zIndex: 1000,
      boxSizing: 'border-box'
    }}>

      <button 
        onClick={startGame}
        style={{
          backgroundColor: '#F59E0B',
          color: '#fff',
          fontSize: '24px',
          fontWeight: '900',
          padding: '20px 40px',
          borderRadius: '50px',
          border: '3px solid #fff',
          cursor: 'pointer',
          boxShadow: '0 8px 0px #D97706, 0 15px 25px rgba(0,0,0,0.3)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          transition: 'all 0.1s',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 1010 
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = 'translateY(8px)';
          e.currentTarget.style.boxShadow = '0 0px 0px #D97706, 0 5px 10px rgba(0,0,0,0.3)';
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'translateY(0px)';
          e.currentTarget.style.boxShadow = '0 8px 0px #D97706, 0 15px 25px rgba(0,0,0,0.3)';
        }}
      >
        <span style={{ fontSize: '28px' }}>➔</span> ¡EMPEZAR NEGOCIO!
      </button>
      
      <div style={{
        marginTop: '20px',
        backgroundColor: '#FDE68A',
        color: '#92400E',
        padding: '8px 20px',
        borderRadius: '8px',
        fontWeight: 'bold',
        fontSize: '14px',
        border: '2px solid #F5A623',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        zIndex: 1010
      }}>
        META: SOBREVIVIR 4 SEMANAS
      </div>
    </div>
  );
};
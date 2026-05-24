import React, { type ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'accent' | 'danger';
  title?: string;
  padding?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  title,
  padding = '1.5rem',
  style,
  onClick
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'glass': return 'glass';
      default: return '';
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'accent': return { borderTop: '4px solid var(--accent)' };
      case 'danger': return { borderTop: '4px solid var(--error)' };
      default: return {};
    }
  };

  return (
    <div 
      className={`premium-card ${getVariantClass()}`}
      onClick={onClick}
      style={{
        padding,
        ...getVariantStyles(),
        ...style
      }}
    >
      {title && (
        <h3 style={{ 
          marginBottom: '1rem', 
          color: 'var(--text)', 
          fontSize: '1.25rem', 
          fontWeight: '800',
          borderBottom: '2px solid var(--background)',
          paddingBottom: '0.5rem'
        }}>
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};

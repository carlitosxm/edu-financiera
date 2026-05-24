import React, { type ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  style,
  ...props 
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: 'var(--primary)',
          color: 'white',
          boxShadow: '0 4px 0px var(--primary-dark)',
        };
      case 'secondary':
        return {
          backgroundColor: 'var(--secondary)',
          color: 'white',
          boxShadow: '0 4px 0px #4f46e5',
        };
      case 'accent':
        return {
          backgroundColor: 'var(--accent)',
          color: 'white',
          boxShadow: '0 4px 0px #d97706',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text)',
          border: '2px solid var(--text-muted)',
        };
      case 'danger':
        return {
          backgroundColor: 'var(--error)',
          color: 'white',
          boxShadow: '0 4px 0px #dc2626',
        };
      default:
        return {};
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return { padding: '0.5rem 1rem', fontSize: '0.875rem' };
      case 'lg': return { padding: '1rem 2rem', fontSize: '1.25rem' };
      default: return { padding: '0.75rem 1.5rem', fontSize: '1rem' };
    }
  };

  return (
    <button
      style={{
        ...getVariantStyles(),
        ...getSizeStyles(),
        borderRadius: 'var(--radius)',
        fontWeight: '700',
        width: fullWidth ? '100%' : 'auto',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        ...style
      }}
      className={`button-hover ${props.className || ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

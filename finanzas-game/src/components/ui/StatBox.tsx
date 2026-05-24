import React from 'react';

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: string;
}

export const StatBox: React.FC<StatBoxProps> = ({ 
  label, 
  value, 
  icon, 
  trend,
  color = 'var(--primary)'
}) => {
  return (
    <div className="premium-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
      {icon && (
        <div style={{ 
          fontSize: '2rem', 
          backgroundColor: `${color}15`, 
          padding: '0.75rem', 
          borderRadius: 'var(--radius)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
      )}
      <div>
        <span style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
          {label}
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)' }}>
            {value}
          </span>
          {trend && (
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              color: trend.isUp ? 'var(--success)' : 'var(--error)',
              backgroundColor: trend.isUp ? 'var(--success)15' : 'var(--error)15',
              padding: '2px 6px',
              borderRadius: 'var(--radius-sm)'
            }}>
              {trend.isUp ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

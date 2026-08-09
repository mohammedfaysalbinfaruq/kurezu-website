import React from 'react';

interface KurezuLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const KurezuLogo: React.FC<KurezuLogoProps> = ({ 
  className = "", 
  theme,
  size = 'md'
}) => {
  // DARK MODE: KUREZU = #FFFFFF
  // LIGHT MODE: KUREZU = #000000
  const color = theme === 'dark' ? '#FFFFFF' : theme === 'light' ? '#000000' : 'var(--text-primary)';

  const sizeClasses = {
    sm: 'text-2xl sm:text-3xl',
    md: 'text-3xl sm:text-4xl md:text-5xl',
    lg: 'text-4xl sm:text-5xl md:text-6xl',
    xl: 'text-6xl sm:text-7xl md:text-8xl',
  };

  return (
    <span 
      className={`font-league-gothic uppercase select-none leading-none inline-block ${sizeClasses[size] || ''} ${className}`}
      style={{
        fontFamily: "'League Gothic', sans-serif",
        fontStyle: 'italic',
        letterSpacing: '-0.01em',
        color: color,
      }}
      aria-label="KUREZU"
    >
      KUREZU
    </span>
  );
};

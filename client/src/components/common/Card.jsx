import React from 'react';

const Card = ({ children, className = '', hoverEffect = true, style = {} }) => {
  const handlePointerMove = (event) => {
    if (!hoverEffect) return;

    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateX = ((y / rect.height) - 0.5) * -8;
    const rotateY = ((x / rect.width) - 0.5) * 8;

    card.style.setProperty('--card-x', `${x}px`);
    card.style.setProperty('--card-y', `${y}px`);
    card.style.setProperty('--card-glow-opacity', '1');
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handlePointerLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty('--card-glow-opacity', '0');
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div 
      className={`minimal-card ${className}`} 
      style={{
        padding: '2rem',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        transition: hoverEffect
          ? 'border-color var(--transition-normal), background var(--transition-normal), transform var(--transition-fast)'
          : 'none',
        ...style
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
};

export default Card;

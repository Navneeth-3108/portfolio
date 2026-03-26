import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', disabled = false, style = {} }) => {
  const handlePointerMove = (event) => {
    if (disabled) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

    button.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };

  const handlePointerLeave = (event) => {
    event.currentTarget.style.transform = 'translate(0, 0)';
  };

  const baseStyles = {
    padding: '0.65rem 1.25rem',
    borderRadius: '6px',
    fontWeight: '500',
    fontSize: '0.9rem',
    transition: 'all var(--transition-fast)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    opacity: disabled ? 0.5 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    letterSpacing: '-0.01em'
  };
  
  const primaryStyles = {
    background: 'var(--text-primary)',
    color: 'var(--bg-primary)',
    border: '1px solid transparent'
  };
  
  const outlineStyles = {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-primary)'
  };

  const currentStyles = variant === 'primary' ? primaryStyles : outlineStyles;
  const computedClass = `minimal-btn-${variant} ${className}`;
  
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ ...baseStyles, ...currentStyles, ...style }}
      className={computedClass}
      disabled={disabled}
      data-cursor="Click"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </button>
  );
};

export default Button;

import React, { useRef } from 'react';

const Magnetic = ({ children, scale = 0.35 }) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    ref.current.style.transform = `translate(${x * scale}px, ${y * scale}px)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = `translate(0px, 0px)`;
  };

  return (
    <div 
      ref={ref} 
      onMouseMove={handleMouseMove} 
      onMouseLeave={handleMouseLeave}
      className="magnetic-wrap"
      style={{ display: 'inline-block' }}
    >
      {children}
    </div>
  );
};

export default Magnetic;

import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/useTheme';

class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1;
  }

  update(width, height) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(ctx, color) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }
}

const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let nodes = [];
    const nodeCount = window.innerWidth < 768 ? 60 : 120;
    const connectionDistance = 150;
    const mouseConnectionDistance = 200;
    
    let mouse = { x: null, y: null };
    let animationFrameId;

    const rgb = theme === 'light' ? '120, 119, 198' : '200, 200, 255';

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    const init = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const nodeColor = `rgba(${rgb}, 0.3)`;

      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(canvas.width, canvas.height);
        nodes[i].draw(ctx, nodeColor);

        // Connections between nodes
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < connectionDistance * connectionDistance) {
            const opacity = 1 - Math.sqrt(distSq) / connectionDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb}, ${opacity * 0.15})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }

        // Mouse connections
        if (mouse.x !== null) {
          const mdx = nodes[i].x - mouse.x;
          const mdy = nodes[i].y - mouse.y;
          const mdistSq = mdx * mdx + mdy * mdy;

          if (mdistSq < mouseConnectionDistance * mouseConnectionDistance) {
            const mopacity = 1 - Math.sqrt(mdistSq) / mouseConnectionDistance;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb}, ${mopacity * 0.3})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas 
      ref={canvasRef}
      className="interactive-bg-canvas"
      aria-hidden="true"
    />
  );
};

export default InteractiveBackground;

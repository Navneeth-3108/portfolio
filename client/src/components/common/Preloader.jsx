import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * 200;
    this.y = Math.random() * 200;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > 200 || this.y < 0 || this.y > 200) this.reset();
  }
}

const Preloader = ({ isLoading }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!isLoading) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    const particleCount = 40;

    const resize = () => {
      canvas.width = 200;
      canvas.height = 200;
    };

    for (let i = 0; i < particleCount; i++) particles.push(new Particle());

    const draw = () => {
      ctx.clearRect(0, 0, 200, 200);
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 0.5;
      
      particles.forEach((p, i) => {
        p.update();
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
            ctx.beginPath();
            ctx.globalAlpha = 1 - dist / 40;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div 
          className="preloader-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "circOut" } }}
        >
          <div className="preloader-container">
            <div className="preloader-neural-box">
              <canvas ref={canvasRef} className="preloader-canvas" />
              <motion.div 
                className="preloader-core"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <motion.div 
              className="preloader-text"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="preloader-title">Synthesizing</h2>
              <div className="preloader-bar">
                <motion.div 
                  className="preloader-progress"
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;

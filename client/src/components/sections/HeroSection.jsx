import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import Magnetic from '../common/Magnetic';

const HeroSection = ({ personalDetails }) => {
  const scrollToSection = (sectionId) => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const navHeader = document.querySelector('.nav-header');
    const headerHeight = navHeader?.getBoundingClientRect().height || 0;
    const sectionPaddingTop = Number.parseFloat(window.getComputedStyle(target).paddingTop) || 0;
    const offsetBuffer = 8;
    const targetTop =
      target.getBoundingClientRect().top + window.scrollY - headerHeight + sectionPaddingTop - offsetBuffer;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 20 }
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-dot-grid" aria-hidden="true" />

      <motion.div
        className="container hero-content"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h1 variants={itemVariants} className="hero-title">
          {personalDetails?.fullName || 'Portfolio'}<br />
          <span className="text-shimmer">{personalDetails?.headline || 'Profile'}</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="hero-subtitle">
          {personalDetails?.bio || 'Add personal details in the backend to display your profile information.'}
          {personalDetails?.location && (
            <div className="hero-location">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="currentColor"
                style={{ flexShrink: 0, color: 'var(--text-secondary)' }}
              >
                <path d="M12 2c-4.4 0-8 3.6-8 8 0 5.5 8 12.5 8 12.5s8-7 8-12.5c0-4.4-3.6-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
              </svg>
              <span>{personalDetails.location}</span>
            </div>
          )}
        </motion.p>

        <motion.div variants={itemVariants} className="hero-actions" aria-label="Hero Actions">
          <Magnetic>
            <Button variant="primary" onClick={() => scrollToSection('projects')}>
              View Projects
            </Button>
          </Magnetic>
          <Magnetic>
            <Button variant="outline" onClick={() => scrollToSection('contact')}>
              Contact Me
            </Button>
          </Magnetic>
          {personalDetails?.githubLink && (
            <Magnetic>
              <a href={personalDetails.githubLink} target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile">
                <Button variant="outline">
                  GitHub
                </Button>
              </a>
            </Magnetic>
          )}
          {personalDetails?.linkedinLink && (
            <Magnetic>
              <a href={personalDetails.linkedinLink} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile">
                <Button variant="outline">
                  LinkedIn
                </Button>
              </a>
            </Magnetic>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

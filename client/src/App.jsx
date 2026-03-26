import React, { useState, useEffect } from 'react';
import './index.css';
import { useTheme } from './contexts/useTheme';
import { apiService } from './services/api';

import HeroSection from './components/sections/HeroSection';
import SkillsSection from './components/sections/SkillsSection';
import ExperienceSection from './components/sections/ExperienceSection';
import EducationSection from './components/sections/EducationSection';
import ProjectsSection from './components/sections/ProjectsSection';
import ContactSection from './components/sections/ContactSection';
import InteractiveBackground from './components/common/InteractiveBackground';
import Preloader from './components/common/Preloader';
import AdminPage from './pages/AdminPage';


const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Education', href: '#education' },
  { name: 'Projects', href: '#projects' },
  { name: 'Contact', href: '#contact' }
];

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.pathname === '/admin');
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [personalDetails, setPersonalDetails] = useState(null);
  const [clickedNav, setClickedNav] = useState('');
  const [themeClicked, setThemeClicked] = useState(false);
  const [activeSection, setActiveSection] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLocationChange = () => {
      setIsAdmin(window.location.pathname === '/admin');
    };

    window.addEventListener('popstate', handleLocationChange);
    const originalPushState = window.history.pushState;
    window.history.pushState = function () {
      originalPushState.apply(this, arguments);
      handleLocationChange();
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 50);

      const triggerPoint = scrollY + 160;
      let currentSectionName = 'Home';

      for (const link of NAV_LINKS) {
        const section = document.querySelector(link.href);
        if (section && section.offsetTop <= triggerPoint) {
          currentSectionName = link.name;
        }
      }

      const isBottom = (window.innerHeight + scrollY) >= document.body.offsetHeight - 80;
      if (isBottom) {
        setActiveSection('Contact');
      } else {
        setActiveSection(currentSectionName);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPersonalDetails = async () => {
      const startTime = Date.now();
      try {
        const res = await apiService.getPersonalDetails();
        if (res?.data) {
          setPersonalDetails(res.data);
        }
      } catch {
        // Error handled by loading state and silent failure is acceptable here as UI handles null personalDetails

      } finally {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 800 - elapsed);
        setTimeout(() => setLoading(false), remaining);
      }
    };

    fetchPersonalDetails();
  }, []);

  const handleNavClick = (event, link) => {
    event.preventDefault();
    setIsMenuOpen(false);

    if (link.href === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveSection('Home');
      return;
    }

    const target = document.querySelector(link.href);
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

    setClickedNav(link.name);
    window.setTimeout(() => {
      setClickedNav('');
    }, 320);
  };

  const handleThemeClick = () => {
    setThemeClicked(true);
    toggleTheme();
    window.setTimeout(() => setThemeClicked(false), 420);
  };

  return (
    <div className="app-container">
      <Preloader isLoading={loading} />
      <InteractiveBackground />

      {isAdmin ? (
        <AdminPage />
      ) : (
        <>
          <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="container nav-content">
              <div className="nav-logo">
                {personalDetails?.fullName?.charAt(0) || 'P'}.
              </div>

              <button
                className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle Menu"
              >
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
                <span className="hamburger-line"></span>
              </button>

              <nav className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}>
                {NAV_LINKS.map(link => (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`nav-link ${clickedNav === link.name ? 'nav-link-clicked' : ''} ${activeSection === link.name ? 'nav-link-active' : ''}`}
                    onClick={(event) => handleNavClick(event, link)}
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={handleThemeClick}
                  className={`theme-toggle-btn ${themeClicked ? 'theme-toggle-clicked' : ''}`}
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                >
                  {theme === 'dark' ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
                  )}
                </button>
              </nav>
            </div>
          </header>

          <main id="main-content">
            <HeroSection personalDetails={personalDetails} />
            <SkillsSection />
            <ExperienceSection />
            <EducationSection />
            <ProjectsSection />
            <ContactSection />
          </main>

          <footer className="footer">
            <div className="container">
              <div className="footer-logo">
                {personalDetails?.fullName || 'Portfolio'}.
              </div>
              <div className="footer-socials">
                {personalDetails?.githubLink && (
                  <a href={personalDetails.githubLink} target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .08 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.02-2.68-.1-.25-.44-1.28.1-2.66 0 0 .84-.27 2.75 1.02A9.54 9.54 0 0 1 12 6.84c.85 0 1.71.11 2.51.32 1.9-1.29 2.74-1.02 2.74-1.02.54 1.38.2 2.41.1 2.66.63.7 1.02 1.59 1.02 2.68 0 3.85-2.34 4.69-4.57 4.94.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z" /></svg>
                  </a>
                )}
                {personalDetails?.linkedinLink && (
                  <a href={personalDetails.linkedinLink} target="_blank" rel="noopener noreferrer" className="social-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3A1.97 1.97 0 1 0 5.3 7a1.97 1.97 0 0 0-.05-4zM20.44 13.36c0-3.2-1.71-4.69-4-4.69-1.85 0-2.67 1.02-3.13 1.74v-1.49H9.94V20h3.38v-5.7c0-1.5.29-2.95 2.15-2.95 1.83 0 1.86 1.71 1.86 3.05V20h3.38v-6.64z" /></svg>
                  </a>
                )}
              </div>
              <p className="footer-copyright">
                &copy; {new Date().getFullYear()} {personalDetails?.fullName || 'Portfolio'}. All rights reserved.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

export default App;

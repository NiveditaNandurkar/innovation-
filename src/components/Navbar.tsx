import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../providers/ThemeProvider';
import { Icon, type IconName } from './icons';
import { SpiderEmblem } from './SpiderBits';

const LINKS: { to: string; label: string; icon: IconName }[] = [
  { to: '/', label: 'Events', icon: 'calendar' },
  { to: '/certificates', label: 'Certificate Portal', icon: 'shield' },
  { to: '/my-certificates', label: 'My Certificates', icon: 'award' },
];

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -80, scale: 0.4, opacity: 0 }}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        style={{ display: 'grid' }}
      >
        <Icon name={isDark ? 'sun' : 'moon'} size={20} />
      </motion.span>
    </button>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="nav">
        <div className="shell nav__inner">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <SpiderEmblem size={38} />
            <span className="brand-name">
              INNO<span>VENTA</span>
            </span>
          </NavLink>

          <nav className="nav__links" aria-label="Primary">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `page-link${isActive ? ' is-active' : ''}`}
              >
                <Icon name={link.icon} size={17} />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="row">
            <ThemeToggle />
            <button
              type="button"
              className="icon-btn nav__burger"
              aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? 'close' : 'menu'} size={21} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: 'easeOut' }}
          >
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) => (isActive ? 'is-active' : '')}
              >
                <Icon name={link.icon} size={20} />
                {link.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
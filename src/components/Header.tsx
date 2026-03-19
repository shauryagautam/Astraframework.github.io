import { ArrowUpRight, Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';

const navLinks = [
  { href: "/docs", label: "Docs" },
  { href: "/#docs", label: "Quickstart" },
  { href: "/#features", label: "Toolkit" },
  { href: "/#showcase", label: "Examples" },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  return (
    <>
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-4 md:py-5 flex justify-between items-center border-b border-[var(--t-border)] bg-[var(--t-header-bg)] backdrop-blur-md transition-colors duration-400"
      >
        <Link to="/" className="z-50">
          <motion.div 
            className="flex items-center gap-2 md:gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img src="/astra-icon.svg" alt="Astra" className="w-6 h-6 md:w-8 md:h-8" />
            <div className="flex flex-col">
              <span className="hidden xs:block text-[8px] md:text-[10px] font-medium opacity-50 mb-0.5 uppercase">PROJECT 001</span>
              <h1 className="text-xl md:text-2xl leading-none font-extrabold tracking-tighter">ASTRA</h1>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              to={link.href} 
              className="hover:text-[var(--t-accent)] transition-colors uppercase tracking-tight"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 z-50">
          <ThemeSwitcher />
          
          <motion.a 
            href="https://github.com/shauryagautam/Astra" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-tighter px-4 py-2 rounded-full border-2 border-[var(--t-text)] hover:bg-[var(--t-text)] hover:text-[var(--t-bg)] transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub <ArrowUpRight size={14} />
          </motion.a>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[var(--t-text)] hover:bg-[var(--t-border)] rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden bg-[var(--t-bg)] pt-24 px-6 overflow-y-auto"
          >
            <div className="liquid-glass-bg opacity-30" aria-hidden="true">
              <div className="liquid-glass-orb-1 opacity-20" />
            </div>
            
            <nav className="flex flex-col gap-6 relative z-10">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    to={link.href} 
                    className="text-4xl font-extrabold uppercase tracking-tighter hover:text-[var(--t-accent)] transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="pt-10 border-t border-[var(--t-border)] mt-4"
              >
                <a 
                  href="https://github.com/shauryagautam/Astra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-xl font-bold uppercase tracking-tight"
                >
                  View GitHub repository <ArrowUpRight size={20} />
                </a>
              </motion.div>
            </nav>
            
            <div className="mt-auto py-12 opacity-30 text-[10px] font-bold uppercase tracking-widest relative z-10">
              ASTRA FRAMEWORK &copy; 2026
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

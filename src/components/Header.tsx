import { ArrowUpRight, Menu as MenuIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
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
  // const location = useLocation();



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
        className="fixed top-0 left-0 w-full z-50 px-4 py-3 md:py-5 flex justify-between items-center border-b border-(--t-border) bg-(--t-header-bg) backdrop-blur-md transition-colors duration-400 overflow-hidden select-none"
      >
        <Link to="/" className="z-50 shrink-0 min-w-0">
          <motion.div 
            className="flex items-center gap-2 md:gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <img src={`${import.meta.env.BASE_URL}astra-icon.svg`} alt="Astra" className="w-5 h-5 md:w-8 md:h-8 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="hidden sm:block text-[8px] md:text-[10px] font-medium opacity-50 mb-0.5 uppercase tracking-widest truncate">PROJECT 001</span>
              <h1 className="text-base sm:text-lg md:text-2xl leading-none font-extrabold tracking-tighter truncate">ASTRA</h1>
            </div>
          </motion.div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              to={link.href} 
              className="hover:text-(--t-accent) transition-colors uppercase tracking-tight"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 z-50 shrink-0">
          <div className="scale-75 xs:scale-90 sm:scale-100 origin-right shrink-0">
            <ThemeSwitcher />
          </div>
          
          <motion.a 
            href="https://github.com/shauryagautam/Astra" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-tighter px-4 py-2 rounded-full border-2 border-(--t-text) hover:bg-(--t-text) hover:text-(--t-bg) transition-all shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            GitHub <ArrowUpRight size={14} />
          </motion.a>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-(--t-text) hover:bg-(--t-border) rounded-lg transition-colors md:hidden shrink-0"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-40 md:hidden bg-(--t-bg)/95 backdrop-blur-xl pt-24 px-6 overflow-y-auto flex flex-col"
          >
            <div className="liquid-glass-bg opacity-30" aria-hidden="true">
              <div className="liquid-glass-orb-1 opacity-20" />
            </div>
            
            <nav className="flex flex-col gap-4 relative z-10">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    to={link.href} 
                    className="text-4xl xs:text-5xl font-extrabold uppercase tracking-tighter hover:text-(--t-accent) transition-colors block py-2"
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
                className="pt-8 border-t border-(--t-border) mt-4"
              >
                <a 
                  href="https://github.com/shauryagautam/Astra"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-lg font-bold uppercase tracking-tight"
                >
                  View GitHub repository <ArrowUpRight size={18} />
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

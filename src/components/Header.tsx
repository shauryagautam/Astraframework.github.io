import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from './ThemeSwitcher';

export const Header = () => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 w-full z-40 px-6 py-5 flex justify-between items-center border-b border-[var(--t-border)] bg-[var(--t-header-bg)] backdrop-blur-md transition-colors duration-400"
    >
      <Link to="/">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <img src="/astra-icon.svg" alt="Astra" className="w-8 h-8" />
          <div className="flex flex-col">
            <span className="text-[10px] font-medium opacity-50 mb-0.5">PROJECT 001</span>
            <h1 className="text-2xl leading-none font-extrabold">ASTRA</h1>
          </div>
        </motion.div>
      </Link>

      <nav className="hidden md:flex gap-8 text-sm font-medium absolute left-1/2 -translate-x-1/2">
        <Link to="/docs" className="hover:text-[var(--t-accent)] transition-colors uppercase tracking-tight">Docs</Link>
        <Link to="/#docs" className="hover:text-[var(--t-accent)] transition-colors uppercase tracking-tight">Quickstart</Link>
        <Link to="/#features" className="hover:text-[var(--t-accent)] transition-colors uppercase tracking-tight">Toolkit</Link>
        <Link to="/#showcase" className="hover:text-[var(--t-accent)] transition-colors uppercase tracking-tight">Examples</Link>
      </nav>

      <div className="flex items-center gap-4">
        <ThemeSwitcher />
        <motion.a 
          href="https://github.com/shauryagautam/Astra" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-tighter px-4 py-2 rounded-full border-2 border-[var(--t-text)] hover:bg-[var(--t-text)] hover:text-[var(--t-bg)] transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          GitHub <ArrowUpRight size={16} />
        </motion.a>
      </div>
    </motion.header>
  );
};

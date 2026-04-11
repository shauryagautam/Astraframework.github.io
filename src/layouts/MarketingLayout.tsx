import type { ReactNode } from 'react';
import { Grain } from '../components/Grain';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import { Twitter, Instagram, Linkedin, Github } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export const MarketingLayout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  return (
    <div className="min-h-screen bg-(--t-bg) text-(--t-text) transition-colors duration-400">
      {isGlass && (
        <div className="liquid-glass-bg" aria-hidden="true">
          <div className="liquid-glass-orb-1" />
          <div className="liquid-glass-orb-2" />
        </div>
      )}
      <Grain />
      <Header />
      <main>
        {children}
      </main>
      
      <footer className="px-6 py-12 border-t border-(--t-border) flex flex-col md:flex-row justify-between items-start gap-8 opacity-50 text-[10px] font-bold uppercase bg-(--t-bg)">
        <div className="flex flex-col gap-1">
          <span>ASTRA FRAMEWORK</span>
          <span>&copy; 2026 OPEN SOURCE</span>
        </div>
        <div className="flex flex-wrap gap-8 items-center">
          <a href="https://github.com/shauryagautam/Astra" target="_blank" rel="noopener noreferrer" className="hover:text-(--t-accent) transition-all flex items-center gap-2">
            <Github size={12} /> GitHub
          </a>
          <a href="https://x.com/Shaurya1309" target="_blank" rel="noopener noreferrer" className="hover:text-(--t-accent) transition-all flex items-center gap-2">
            <Twitter size={12} /> X
          </a>
          <a href="https://www.instagram.com/mr.shauryagautam" target="_blank" rel="noopener noreferrer" className="hover:text-(--t-accent) transition-all flex items-center gap-2">
            <Instagram size={12} /> Instagram
          </a>
          <a href="https://www.linkedin.com/in/shaurya13" target="_blank" rel="noopener noreferrer" className="hover:text-(--t-accent) transition-all flex items-center gap-2">
            <Linkedin size={12} /> LinkedIn
          </a>
        </div>
        <div className="text-right whitespace-nowrap">
          <span>BUILT FOR SPEED & ARCHITECTURAL INTEGRITY</span>
        </div>
      </footer>
    </div>
  );
};

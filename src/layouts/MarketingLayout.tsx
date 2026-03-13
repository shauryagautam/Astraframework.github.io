import type { ReactNode } from 'react';
import { Grain } from '../components/Grain';
import { Header } from '../components/Header';
import { useTheme } from '../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
}

export const MarketingLayout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  return (
    <div className="min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] transition-colors duration-400">
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
      
      <footer className="px-6 py-12 border-t border-[var(--t-border)] flex flex-col md:flex-row justify-between items-start gap-8 opacity-50 text-[10px] font-bold uppercase bg-[var(--t-bg)]">
        <div className="flex flex-col gap-1">
          <span>ASTRA FRAMEWORK</span>
          <span>&copy; 2026 OPEN SOURCE</span>
        </div>
        <div className="flex gap-8">
          <a href="https://github.com/shauryagautam/Astra" className="hover:underline">GitHub</a>
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">Discord</a>
        </div>
        <div className="text-right whitespace-nowrap">
          <span>BUILT FOR SPEED & ARCHITECTURAL INTEGRITY</span>
        </div>
      </footer>
    </div>
  );
};

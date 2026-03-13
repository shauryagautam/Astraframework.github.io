import { useState } from 'react';
import type { ReactNode } from 'react';
import { Grain } from '../components/Grain';
import { Header } from '../components/Header';
import { DocsSidebar } from '../components/DocsSidebar';
import { useTheme } from '../context/ThemeContext';
import { Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export const DocsLayout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--t-bg)] text-[var(--t-text)] transition-colors duration-400 flex flex-col">
      {isGlass && (
        <div className="liquid-glass-bg" aria-hidden="true">
          <div className="liquid-glass-orb-1" />
          <div className="liquid-glass-orb-2" />
        </div>
      )}
      <Grain />
      <Header />
      
      <div className="flex-1 flex flex-col lg:flex-row max-w-screen-2xl mx-auto w-full pt-20">
        {/* Mobile Sidebar Toggle */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-10 right-10 z-50 p-5 rounded-2xl bg-[var(--t-accent)] text-[var(--t-accent-text)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-transform active:scale-95"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar */}
        <div className={cn(
          "fixed inset-0 z-40 lg:relative lg:z-0 lg:block transition-all duration-500 ease-in-out",
          isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0 lg:translate-x-0 lg:opacity-100"
        )}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          <div className="relative w-72 h-full bg-[var(--t-bg)] border-r border-[var(--t-border)] shadow-2xl lg:shadow-none">
             <DocsSidebar />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0 flex flex-col lg:flex-row">
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
          
          {/* Table of Contents - Hidden on small screens */}
          <aside className="hidden xl:block w-72 p-12 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto border-l border-[var(--t-border)] bg-[var(--t-bg)]/50">
            <h5 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--t-text-muted)] mb-6">On this page</h5>
            <nav className="space-y-4">
               <div className="group flex items-center gap-3 text-xs text-[var(--t-text-secondary)] hover:text-[var(--t-accent)] cursor-pointer py-1 transition-all">
                 <div className="w-1.5 h-1.5 rounded-full border border-[var(--t-border-strong)] group-hover:bg-[var(--t-accent)] group-hover:border-[var(--t-accent)] transition-all" />
                 Introduction
               </div>

               <div className="group flex items-center gap-3 text-xs text-[var(--t-accent)] font-bold py-1 transition-all">
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--t-accent)]" />
                 Configuration
               </div>
            </nav>

            <div className="mt-20 p-6 rounded-2xl border border-[var(--t-border-strong)] bg-gradient-to-br from-[var(--t-accent)]/5 to-transparent">
               <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--t-accent)] mb-2">Internal Alpha</p>
               <p className="text-[11px] text-[var(--t-text-secondary)] leading-relaxed mb-4">
                 Join the discussion on our private community.
               </p>
               <a href="#" className="text-[10px] font-bold uppercase border-b border-[var(--t-accent)] pb-0.5 hover:text-[var(--t-accent)] transition-colors">Join Discord &rarr;</a>
            </div>
          </aside>
        </main>
      </div>

      <footer className="px-6 py-12 border-t border-[var(--t-border)] flex flex-col md:flex-row justify-between items-start gap-8 opacity-50 text-[10px] font-bold uppercase bg-[var(--t-bg)] z-10">
        <div className="flex flex-col gap-1">
          <span>ASTRA FRAMEWORK</span>
          <span>&copy; 2026 OPEN SOURCE</span>
        </div>
        <div className="flex gap-8">
          <a href="https://github.com/shauryagautam/Astra" className="hover:underline">GitHub</a>
          <a href="#" className="hover:underline">Twitter</a>
          <a href="#" className="hover:underline">Discord</a>
        </div>
      </footer>
    </div>
  );
};

import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Grain } from '../components/Grain';
import { Header } from '../components/Header';
import { DocsSidebar } from '../components/DocsSidebar';
import { useTheme } from '../hooks/useTheme';
import { Menu, X, Twitter, Instagram, Linkedin } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

import { DocsTopicSearch } from '../components/DocsTopicSearch';
import { TableOfContents } from '../components/TableOfContents';

export const DocsLayout = ({ children }: LayoutProps) => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-(--t-bg) text-(--t-text) transition-colors duration-400 flex flex-col overflow-x-hidden selection:bg-(--t-accent) selection:text-(--t-accent-text)">
      {isGlass && (
        <div className="liquid-glass-bg" aria-hidden="true">
          <div className="liquid-glass-orb-1 opacity-20" />
          <div className="liquid-glass-orb-2 opacity-20" />
        </div>
      )}
      <Grain />
      <Header />
      
      <div className="flex-1 block md:flex max-w-[1600px] mx-auto w-full pt-16 md:pt-20 px-0 md:px-8 relative gap-0 md:gap-8 lg:gap-12 overflow-x-hidden md:overflow-visible">
        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 md:sticky md:top-20 md:h-[calc(100vh-5rem)] md:block transition-all duration-500 ease-in-out md:w-64",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}>
          <div className={cn(
            "fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-500",
            isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )} onClick={() => setIsSidebarOpen(false)} />
          
          <div className="relative h-full bg-(--t-bg) border-r border-(--t-border) shadow-2xl md:shadow-none md:border-none overflow-y-auto custom-scrollbar">
             <DocsSidebar onItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col lg:flex-row relative z-0 items-start px-4 md:px-0 max-w-full overflow-x-hidden">
          <div className="flex-1 min-w-0 py-8 md:py-12 max-w-full">
            {children}
            <DocsTopicSearch />
          </div>
          
          <TableOfContents />

          {/* Mobile Sidebar Toggle */}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="md:hidden fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-70 p-4 rounded-full bg-(--t-accent) text-(--t-accent-text) shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all border border-white/10"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </main>
      </div>

      <footer className="px-8 py-12 border-t border-(--t-border) bg-(--t-bg) relative z-10 transition-colors duration-400">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
             <div className="flex items-center gap-3">
                <img src={`${import.meta.env.BASE_URL}astra-icon.svg`} alt="Astra" className="w-5 h-5 opacity-80" />
                <span className="text-[11px] font-black uppercase tracking-tighter">Astra</span>
             </div>
             <p className="text-[10px] font-medium uppercase tracking-widest opacity-40 leading-relaxed max-w-[200px]">
                Built for performance.
             </p>
             <div className="text-[9px] font-bold uppercase tracking-widest opacity-20">
                &copy; 2026 Astra
             </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-4">
               <h5 className="text-[10px] font-black uppercase tracking-widest opacity-20">Project</h5>
               <nav className="flex flex-col gap-2.5 text-[11px] font-bold uppercase tracking-tighter">
                  <a href="https://github.com/shauryagautam/Astra" className="hover:text-(--t-accent) transition-colors">GitHub</a>
                  <Link to="/docs" className="hover:text-(--t-accent) transition-colors">Documentation</Link>
                  <Link to="/#showcase" className="hover:text-(--t-accent) transition-colors">Showcase</Link>
               </nav>
            </div>
            
            <div className="space-y-4">
               <h5 className="text-[10px] font-black uppercase tracking-widest opacity-20">Community</h5>
               <nav className="flex flex-col gap-3 text-[11px] font-bold uppercase tracking-tighter">
                  <a href="https://x.com/Shaurya1309" target="_blank" rel="noopener noreferrer" className="hover:text-(--t-accent) transition-colors flex items-center gap-2">
                    <Twitter size={12} /> X
                  </a>
                  <a href="https://www.instagram.com/mr.shauryagautam" target="_blank" rel="noopener noreferrer" className="hover:text-(--t-accent) transition-colors flex items-center gap-2">
                    <Instagram size={12} /> Instagram
                  </a>
                  <a href="https://www.linkedin.com/in/shaurya13" target="_blank" rel="noopener noreferrer" className="hover:text-(--t-accent) transition-colors flex items-center gap-2">
                    <Linkedin size={12} /> LinkedIn
                  </a>
               </nav>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

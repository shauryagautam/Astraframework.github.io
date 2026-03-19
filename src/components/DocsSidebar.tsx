import { NavLink, useLocation } from 'react-router-dom';
import { DOCS_CONFIG } from '../config/docs';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { useEffect, useRef, useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DocsSidebar = ({ onItemClick }: { onItemClick?: () => void }) => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isGlass = theme === 'liquid-glass';
  const [searchQuery, setSearchQuery] = useState('');

  // Scroll active link into view
  useEffect(() => {
    const activeLink = sidebarRef.current?.querySelector('.active-sidebar-link');
    if (activeLink) {
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [pathname]);

  const filteredDocs = useMemo(() => 
    DOCS_CONFIG.map(category => ({
      ...category,
      sections: category.sections.filter(section => 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.sections.length > 0),
    [searchQuery]
  );

  return (
    <div 
      ref={sidebarRef}
      className={cn(
        "w-full h-full overflow-y-auto px-4 py-8 transition-colors duration-400 custom-scrollbar scroll-smooth",
        isGlass ? "border-white/10" : "border-[var(--t-border)]"
      )}
    >
      {/* Search Bar */}
      <div className="mb-8 relative group px-2">
        <label className={cn(
          "flex items-center gap-3 py-2 px-4 rounded-xl border transition-all cursor-text",
          isGlass 
            ? "border-white/5 bg-white/[0.03] hover:bg-white/[0.05] focus-within:border-white/20 focus-within:bg-white/[0.08]" 
            : "border-[var(--t-border)] bg-[var(--t-bg-secondary)] hover:border-[var(--t-border-strong)] focus-within:ring-1 focus-within:ring-[var(--t-accent)]/20 shadow-sm"
        )}>
          <Search size={14} className="text-[var(--t-text-muted)] group-focus-within:text-[var(--t-accent)] transition-colors shrink-0" />
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-[13px] bg-transparent outline-none placeholder:text-[var(--t-text-muted)]/50 font-medium"
          />
        </label>
      </div>

      <nav className="space-y-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {filteredDocs.map((category, idx) => {
            const isCategoryActive = category.sections.some(s => pathname === `/docs/${category.id}/${s.id}`);
            
            return (
              <motion.div 
                key={category.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
                className="space-y-3"
              >
                <h4 className={cn(
                  "flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] px-4 transition-all",
                  isCategoryActive ? "text-[var(--t-accent)]" : "text-[var(--t-text-muted)]/60"
                )}>
                  <span>{category.title}</span>
                </h4>
                
                <ul className="space-y-0.5">
                  {category.sections.map((section) => {
                    const href = `/docs/${category.id}/${section.id}`;
                    
                    return (
                      <li key={section.id} className="px-2">
                        <NavLink
                          to={href}
                          onClick={onItemClick}
                          className={({ isActive }) => cn(
                            "group flex items-center gap-3 text-[13px] py-2 px-3 rounded-lg transition-all relative z-10",
                            isActive 
                              ? "active-sidebar-link text-[var(--t-accent)] font-bold bg-[var(--t-accent)]/[0.04]" 
                              : "text-[var(--t-text-secondary)] hover:text-[var(--t-text)] hover:bg-[var(--t-surface-hover)]"
                          )}
                        >
                          {({ isActive }) => (
                            <>
                              {isActive && (
                                <motion.div 
                                  layoutId="active-pill"
                                  className="absolute inset-0 rounded-lg bg-[var(--t-accent)]/[0.04] border border-[var(--t-accent)]/[0.08] -z-10"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              <span className={cn(
                                "w-1 h-1 rounded-full transition-all shrink-0",
                                isActive ? "bg-[var(--t-accent)] scale-125 shadow-[0_0_8px_var(--t-accent)]" : "bg-transparent group-hover:bg-[var(--t-text-muted)]/30"
                              )} />
                              <span className={cn(
                                "transition-transform inline-block",
                                isActive ? "translate-x-0" : "group-hover:translate-x-0.5"
                              )}>
                                {section.title}
                              </span>
                            </>
                          )}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </nav>
    </div>
  );
};

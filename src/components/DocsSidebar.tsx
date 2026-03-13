import { NavLink, useLocation } from 'react-router-dom';
import { DOCS_CONFIG } from '../config/docs';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { useState, useMemo } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const DocsSidebar = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const isGlass = theme === 'liquid-glass';
  const [searchQuery, setSearchQuery] = useState('');

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
    <aside className={cn(
      "w-72 h-[calc(100vh-80px)] overflow-y-auto sticky top-20 p-8 pt-10 border-r transition-colors duration-400 custom-scrollbar",
      isGlass ? "border-white/10" : "border-[var(--t-border)]"
    )}>
      {/* Search Bar - Premium Style */}
      <div className="mb-10 relative group">
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "w-full text-xs py-3 pl-10 pr-4 rounded-lg border transition-all bg-transparent outline-none focus:ring-2 focus:ring-[var(--t-accent)]/20",
            isGlass 
              ? "border-white/10 focus:border-white/30 bg-white/5" 
              : "border-[var(--t-border)] focus:border-[var(--t-border-strong)] bg-[var(--t-bg-secondary)]"
          )}
        />
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--t-text-muted)] group-focus-within:text-[var(--t-accent)] transition-colors" />
      </div>

      <nav className="space-y-10">
        <AnimatePresence mode="popLayout">
          {filteredDocs.map((category) => (
            <motion.div 
              key={category.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--t-text-muted)] mb-4 px-2">
                <ChevronRight size={10} className="text-[var(--t-accent)]" />
                {category.title}
              </h4>
              <ul className="space-y-1">
                {category.sections.map((section) => {
                  const href = `/docs/${category.id}/${section.id}`;
                  const isActive = pathname === href;

                  return (
                    <li key={section.id} className="relative">
                      <NavLink
                        to={href}
                        className={({ isActive }) => cn(
                          "group block text-[13px] py-1.5 px-3 rounded-md transition-all relative z-10",
                          isActive 
                            ? "text-[var(--t-accent)] font-semibold" 
                            : "text-[var(--t-text-secondary)] hover:text-[var(--t-text)] hover:bg-[var(--t-surface-hover)]"
                        )}
                      >
                        {section.title}
                      </NavLink>
                      {isActive && (
                        <motion.div 
                          layoutId="active-nav-bg"
                          className="absolute inset-0 bg-[var(--t-accent)]/5 border-l-2 border-[var(--t-accent)] rounded-r-md z-0"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </nav>
    </aside>
  );
};

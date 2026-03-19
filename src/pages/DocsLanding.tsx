// src/pages/DocsLanding.tsx
import { Link } from 'react-router-dom';
import { DocsLayout } from '../layouts/DocsLayout';
import { DOCS_CONFIG } from '../config/docs';
import { motion } from 'framer-motion';
import { ArrowRight, Book, Code, Database, Shield, Zap, Terminal } from 'lucide-react';

const categoryIcons: Record<string, any> = {
  'introduction': Book,
  'core-concepts': Zap,
  'database': Database,
  'auth': Shield,
  'advanced': Code,
  'development': Terminal
};

export const DocsLanding = () => {
  return (
    <DocsLayout>
      <div className="max-w-4xl py-20 px-6 lg:px-20 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-0.5 w-12 bg-[var(--t-accent)]" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--t-accent)] block">Astra Documentation</span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-display font-black tracking-[-0.06em] leading-[0.85] text-[var(--t-text)] mb-8">
               Everything you need<br />to build with Astra.
            </h1>
            <p className="text-xl text-[var(--t-text-secondary)] leading-relaxed max-w-2xl font-medium">
              Astra is a high-performance Go framework designed for modern backend developers. 
              Explore our comprehensive guides and API references to master full-stack Go development.
            </p>
          </header>

          <div className="flex flex-wrap gap-4 mb-20">
            <Link 
              to="/docs/introduction/quickstart"
              className="px-8 py-4 bg-[var(--t-accent)] text-[var(--t-accent-text)] font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all flex items-center gap-3 rounded-xl"
            >
               Get Started <ArrowRight size={14} />
            </Link>
            <a 
              href="https://github.com/shauryagautam/Astra" 
              className="px-8 py-4 border border-[var(--t-border-strong)] text-[var(--t-text)] font-black uppercase tracking-widest text-[11px] hover:bg-[var(--t-surface-hover)] transition-all rounded-xl"
            >
               View on Github
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {DOCS_CONFIG.map((category, idx) => {
               const Icon = categoryIcons[category.id] || Book;
               const firstSection = category.sections[0]?.id || 'overview';
               
               return (
                 <motion.div
                   key={category.id}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.1 }}
                 >
                   <Link 
                     to={`/docs/${category.id}/${firstSection}`}
                     className="group block p-8 rounded-3xl border border-[var(--t-border)] bg-[var(--t-bg-secondary)]/30 hover:bg-[var(--t-accent)]/5 hover:border-[var(--t-accent)]/30 transition-all h-full"
                   >
                     <div className="w-12 h-12 rounded-2xl bg-[var(--t-accent)]/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon size={24} className="text-[var(--t-accent)]" />
                     </div>
                     <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">{category.title}</h3>
                     <p className="text-sm text-[var(--t-text-muted)] leading-relaxed mb-6 font-medium">
                        Explore {category.sections.length} guides on {category.title.toLowerCase()} and best practices.
                     </p>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[var(--t-accent)] opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        Explore Category <ArrowRight size={10} />
                     </span>
                   </Link>
                 </motion.div>
               );
             })}
          </div>
        </motion.div>

        <section className="mt-32 pt-20 border-t border-[var(--t-border)]">
           <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--t-accent)]/40 mb-12">Search by Topic</h4>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-6">
              {['Middleware', 'Validation', 'Authentication', 'ORM', 'Migrations', 'HTTP Context', 'Testing', 'Deployment'].map(topic => (
                <Link 
                  key={topic} 
                  to={`/docs/introduction/docs#${topic.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm font-bold text-[var(--t-text-muted)] hover:text-[var(--t-accent)] transition-colors"
                >
                  {topic} &rarr;
                </Link>
              ))}
           </div>
        </section>
      </div>
    </DocsLayout>
  );
};

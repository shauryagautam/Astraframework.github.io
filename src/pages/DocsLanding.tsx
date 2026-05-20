// src/pages/DocsLanding.tsx
import { Link } from 'react-router-dom';
import { DocsLayout } from '../layouts/DocsLayout';
import { DOCS_CONFIG } from '../config/docs';
import { motion } from 'framer-motion';
import { ArrowRight, Book, Code, Database, Shield, Zap, Terminal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { BalancedText } from '../components/shared/BalancedText';

const categoryIcons: Record<string, LucideIcon> = {
  'introduction': Book,
  'core-concepts': Zap,
  'database': Database,
  'auth': Shield,
  'advanced': Code,
  'development': Terminal
};

import { SEO } from '../components/shared/SEO';

export const DocsLanding = () => {
  return (
    <DocsLayout>
      <SEO 
        title="Documentation" 
        description="Comprehensive guides and API references for the Astra framework. Master modern Go development." 
      />
      <div className="max-w-4xl py-20 px-6 lg:px-20 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <header className="mb-10">
            <div className="flex items-center gap-4 mb-6">
              <span className="h-0.5 w-12 bg-(--t-accent)" />
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-(--t-accent) block">Astra Documentation</span>
            </div>
            <h1 className="text-6xl sm:text-7xl font-display font-black tracking-[-0.06em] leading-[0.85] text-(--t-text) mb-8">
               <BalancedText>Everything you need to build with Astra.</BalancedText>
            </h1>
            <p className="text-xl text-(--t-text-secondary) leading-relaxed max-w-2xl font-medium">
              <BalancedText>
                Astra is a high-performance Go framework designed for modern backend developers. 
                Explore our comprehensive guides and API references to master full-stack Go development.
              </BalancedText>
            </p>
          </header>

          <div className="flex flex-wrap gap-4 mb-16">
            <Link 
              to="/docs/introduction/quickstart"
              className="px-8 py-4 bg-(--t-accent) text-(--t-accent-text) font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all flex items-center gap-3 rounded-xl"
            >
               Get Started <ArrowRight size={14} />
            </Link>
            <a 
              href="https://github.com/shauryagautam/Astra" 
              className="px-8 py-4 border border-(--t-border-strong) text-(--t-text) font-black uppercase tracking-widest text-[11px] hover:bg-(--t-surface-hover) transition-all rounded-xl"
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
                     className="group block p-8 rounded-3xl border border-(--t-border) bg-(--t-bg-secondary)/30 hover:bg-(--t-accent)/5 hover:border-(--t-accent)/30 transition-all h-full"
                   >
                     <div className="w-12 h-12 rounded-2xl bg-(--t-accent)/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                        <Icon size={24} className="text-(--t-accent)" />
                     </div>
                     <h3 className="text-xl font-bold mb-3 uppercase tracking-tight">{category.title}</h3>
                     <p className="text-sm text-(--t-text-muted) leading-relaxed mb-6 font-medium">
                        <BalancedText>
                          Explore {category.sections.length} guides on {category.title.toLowerCase()} and best practices.
                        </BalancedText>
                     </p>
                     <span className="text-[10px] font-black uppercase tracking-widest text-(--t-accent) opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        Explore Category <ArrowRight size={10} />
                     </span>
                   </Link>
                 </motion.div>
               );
             })}
          </div>
        </motion.div>

      </div>
    </DocsLayout>
  );
};

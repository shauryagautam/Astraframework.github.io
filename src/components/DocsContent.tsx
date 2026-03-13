import { useParams, Navigate, Link } from 'react-router-dom';
import { docsData } from '../data/docs';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export const DocsContent = () => {
  const { categoryId, sectionId } = useParams();

  const category = docsData.find(c => c.id === categoryId);
  const section = category?.sections.find(s => s.id === sectionId);

  if (!category || !section) {
    const firstCat = docsData[0];
    const firstSec = firstCat.sections[0];
    return <Navigate to={`/docs/${firstCat.id}/${firstSec.id}`} replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={section.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-4xl py-12 px-6 lg:px-20 w-full"
      >
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--t-text-muted)] mb-10">
          <Link to="/" className="hover:text-[var(--t-accent)] transition-colors">
            <Home size={12} />
          </Link>
          <ChevronRight size={10} />
          <Link to="/docs" className="hover:text-[var(--t-accent)] transition-colors">Docs</Link>
          <ChevronRight size={10} />
          <span className="text-[var(--t-accent)]">{category.title}</span>
        </nav>

        <div className="w-full">
          <MarkdownRenderer content={section.rawContent} />
        </div>

        <footer className="mt-32 pt-12 border-t border-[var(--t-border)] flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-[var(--t-text-muted)]">
          <div className="flex items-center gap-4">
             <span>Last updated: March 2026</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[var(--t-accent)] transition-colors">Edit this page</a>
             <a href="#" className="hover:text-[var(--t-accent)] transition-colors">View on GitHub</a>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

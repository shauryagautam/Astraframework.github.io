import { useParams, Navigate, Link } from 'react-router-dom';
import { DOCS_CONFIG } from '../config/docs';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ChevronRight, Edit3, ThumbsUp, ThumbsDown } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { useEffect } from 'react';

export const DocsContent = () => {
  const { categoryId, sectionId } = useParams();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const category = DOCS_CONFIG.find(c => c.id === categoryId);
  const section = category?.sections.find(s => s.id === sectionId);

  // Smooth scroll to top on section change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [sectionId]);

  if (!category || !section) {
    const firstCat = DOCS_CONFIG[0];
    const firstSec = firstCat?.sections[0];
    if (!firstCat || !firstSec) return <div>No documentation found.</div>;
    return <Navigate to={`/docs/${firstCat.id}/${firstSec.id}`} replace />;
  }

  // Calculate Next and Previous Sections
  const flatSections = DOCS_CONFIG.flatMap(cat => 
    cat.sections.map(sec => ({ ...sec, categoryId: cat.id, categoryTitle: cat.title }))
  );
  
  const currentIndex = flatSections.findIndex(s => s.id === sectionId && s.categoryId === categoryId);
  const prevSection = currentIndex > 0 ? flatSections[currentIndex - 1] : null;
  const nextSection = currentIndex < flatSections.length - 1 ? flatSections[currentIndex + 1] : null;

  // Format the GitHub edit URL
  // path is usually something like /docs-content/01-docs.md
  const filePath = section.metadata.filePath.startsWith('/') 
    ? section.metadata.filePath.slice(1) 
    : section.metadata.filePath;
  const editUrl = `https://github.com/shauryagautam/Astra/edit/main/${filePath}`;

  return (
    <>
      <motion.div 
        className="fixed top-20 left-0 right-0 h-1 bg-[var(--t-accent)] origin-left z-50 pointer-events-none"
        style={{ scaleX }}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="max-w-4xl py-12 lg:pr-12 w-full mx-auto"
        >
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--t-accent)]/40 mb-10 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link to="/docs" className="hover:text-[var(--t-accent)] transition-colors shrink-0">Docs</Link>
          <ChevronRight size={10} className="shrink-0 opacity-30" />
          <span className="shrink-0">{category.title}</span>
          <ChevronRight size={10} className="shrink-0 opacity-30" />
          <span className="text-[var(--t-text)] shrink-0">{section.title}</span>
        </nav>

        <div className="w-full prose-premium">
          <MarkdownRenderer content={section.rawContent} />
        </div>

        {/* Next/Prev Navigation */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {prevSection ? (
            <Link 
              to={`/docs/${prevSection.categoryId}/${prevSection.id}`}
              className="group p-6 rounded-2xl border border-[var(--t-border)] hover:border-[var(--t-accent)] bg-[var(--t-bg-secondary)]/30 hover:bg-[var(--t-accent)]/5 transition-all text-left flex flex-col gap-2"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--t-text-muted)] group-hover:text-[var(--t-accent)] transition-colors">Previous</span>
              <span className="text-lg font-bold text-[var(--t-text)] group-hover:translate-x-[-4px] transition-transform flex items-center gap-2">
                 &larr; {prevSection.title}
              </span>
            </Link>
          ) : <div />}

          {nextSection && (
            <Link 
              to={`/docs/${nextSection.categoryId}/${nextSection.id}`}
              className="group p-6 rounded-2xl border border-[var(--t-border)] hover:border-[var(--t-accent)] bg-[var(--t-bg-secondary)]/30 hover:bg-[var(--t-accent)]/5 transition-all text-right flex flex-col gap-2"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-[var(--t-text-muted)] group-hover:text-[var(--t-accent)] transition-colors">Next</span>
              <span className="text-lg font-bold text-[var(--t-text)] group-hover:translate-x-[4px] transition-transform flex items-center justify-end gap-2">
                 {nextSection.title} &rarr;
              </span>
            </Link>
          )}
        </div>

        {/* Helpfulness Survey */}
        <section className="mt-24 p-6 sm:p-10 rounded-3xl border border-[var(--t-border)] bg-[var(--t-bg-secondary)]/20 backdrop-blur-md relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--t-accent)]/[0.03] blur-3xl -mr-32 -mt-32 rounded-full group-hover:bg-[var(--t-accent)]/[0.06] transition-all duration-700" />
           <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="text-center md:text-left">
                 <h4 className="text-xl font-display font-black uppercase tracking-tight mb-2">Was this page helpful?</h4>
                 <p className="text-[var(--t-text-muted)] text-sm max-w-xs font-medium">Your feedback helps us make Astra's documentation better for everyone.</p>
              </div>
              <div className="flex gap-3">
                 <button className="h-12 px-6 rounded-xl border border-[var(--t-border)] hover:border-[var(--t-accent)] hover:bg-[var(--t-accent)]/10 transition-all text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <ThumbsUp size={16} className="text-emerald-500" /> Yes
                 </button>
                 <button className="h-12 px-6 rounded-xl border border-[var(--t-border)] hover:border-red-500/50 hover:bg-red-500/10 transition-all text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <ThumbsDown size={16} className="text-rose-500" /> No
                 </button>
              </div>
           </div>
        </section>

        {/* Edit on GitHub Link */}
        <div className="mt-32 pt-8 border-t border-[var(--t-border)]">
          <a 
            href={editUrl}
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] font-black uppercase tracking-widest text-[var(--t-text-muted)] hover:text-[var(--t-accent)] transition-all flex items-center gap-2 group"
          >
            <Edit3 size={12} className="group-hover:rotate-12 transition-transform" />
            <span>Edit this page on GitHub</span>
          </a>
        </div>
      </motion.div>
    </AnimatePresence>
    </>
  );
};

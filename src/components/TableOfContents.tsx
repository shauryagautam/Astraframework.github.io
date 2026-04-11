import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const location = useLocation();

  useEffect(() => {
    const findHeadings = () => {
      const parent = document.querySelector('.markdown-content');
      if (!parent) return;

      const headingElements = Array.from(parent.querySelectorAll('h2, h3'));
      const foundHeadings = headingElements.map(el => ({
        id: el.id,
        text: el.textContent || '',
        level: el.tagName === 'H2' ? 2 : 3
      })).filter(h => h.id);
      
      setHeadings(foundHeadings);
    };

    // Initial find
    findHeadings();

    // Use MutationObserver on the stable main container
    const observer = new MutationObserver(() => {
      findHeadings();
      observeHeadings();
    });
    
    const mainContainer = document.querySelector('main');
    if (mainContainer) {
      observer.observe(mainContainer, { childList: true, subtree: true });
    }

    // Intersection observer for active heading
    const intersectionObserver = new IntersectionObserver( (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0px -80% 0px' }
    );

    const observeHeadings = () => {
      document.querySelectorAll('.markdown-content h2, .markdown-content h3').forEach(el => intersectionObserver.observe(el));
    };

    observeHeadings();

    const handleScroll = () => {
      if (window.scrollY < 100) {
        setActiveId('');
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-60 shrink-0 p-6 sticky top-24 h-[calc(100vh-80px)] overflow-y-auto z-20">
      <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-(--t-text-muted) mb-4 px-4">On this page</h5>
      
      <nav className="space-y-0.5 border-l border-(--t-border)">
         {headings.map((heading) => (
           <a
             key={heading.id}
             href={`#${heading.id}`}
             onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
             }}
             className={cn(
               "group flex items-center text-[12px] transition-all py-1.5 px-4 border-l-2 -ml-[1px]",
               activeId === heading.id 
                 ? "text-(--t-accent) border-(--t-accent) font-bold bg-(--t-accent)/5" 
                 : "text-(--t-text-muted) border-transparent hover:text-(--t-text) hover:border-(--t-border-strong)"
             )}
             style={{ paddingLeft: heading.level === 3 ? '1.5rem' : '1rem' }}
           >
             {heading.text}
           </a>
         ))}
      </nav>

    </aside>
  );
};

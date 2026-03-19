import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { Info, Lightbulb, AlertTriangle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CodeBlock } from './shared/CodeBlock';

const Alert = ({ type, children }: { type: string, children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const styles: Record<string, { bg: string, border: string, icon: any, color: string, decoration: string }> = {
    info: { 
      bg: isLight ? "bg-blue-50" : "bg-blue-500/5", 
      border: isLight ? "border-blue-200" : "border-blue-500/20", 
      icon: Info, 
      color: "text-blue-500",
      decoration: "before:bg-blue-500" 
    },
    tip: { 
      bg: isLight ? "bg-emerald-50" : "bg-emerald-500/5", 
      border: isLight ? "border-emerald-200" : "border-emerald-500/20", 
      icon: Lightbulb, 
      color: "text-emerald-500",
      decoration: "before:bg-emerald-500"
    },
    warning: { 
      bg: isLight ? "bg-amber-50" : "bg-amber-500/5", 
      border: isLight ? "border-amber-200" : "border-amber-500/20", 
      icon: AlertTriangle, 
      color: "text-amber-500",
      decoration: "before:bg-amber-500"
    },
    danger: { 
      bg: isLight ? "bg-rose-50" : "bg-rose-500/5", 
      border: isLight ? "border-rose-200" : "border-rose-500/20", 
      icon: AlertCircle, 
      color: "text-rose-500",
      decoration: "before:bg-rose-500"
    }
  };

  const style = styles[type] || styles.info;
  const Icon = style.icon;

  return (
    <div className={cn(
      "my-10 p-6 sm:p-8 rounded-2xl border relative overflow-hidden flex gap-6 items-start",
      style.bg, style.border, "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1", style.decoration
    )}>
      <div className={cn("mt-1 shrink-0", style.color)}>
        <Icon size={24} />
      </div>
      <div className="text-[15px] leading-relaxed font-medium text-[var(--t-text-secondary)]">
        {children}
      </div>
    </div>
  );
};

export const MarkdownRenderer = memo(({ content }: { content: string }) => {
  // Process custom containers like :::tip before passing to ReactMarkdown
  const processedContent = useMemo(() => {
    if (!content) return '';
    let result = content;
    
    // Replace :::type ... ::: with <div class="callout" data-type="type"> ... </div>
    const containerRegex = /:::(\w+)\n([\s\S]*?)\n:::/g;
    result = result.replace(containerRegex, (_match, type, inner) => {
        return `<div class="callout" data-type="${type}">${inner}</div>`;
    });

    return result;
  }, [content]);

  if (!content) return null;

  const components: any = {
    h1: ({ children }: any) => (
      <header className="mb-12 pt-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[1.1] text-[var(--t-text)]">
          {children}
        </h1>
      </header>
    ),
    h2: ({ children }: any) => {
      const id = children.toString().toLowerCase().replace(/\s+/g, '-');
      return (
        <h2 id={id} className="text-2xl sm:text-3xl mt-16 mb-6 font-display font-black uppercase tracking-tight flex items-center gap-4 group anchor-link text-[var(--t-text)]">
          <span className="text-xs font-mono text-[var(--t-accent)] opacity-20 group-hover:opacity-100 transition-opacity">#</span>
          {children}
        </h2>
      );
    },
    h3: ({ children }: any) => {
      const id = children.toString().toLowerCase().replace(/\s+/g, '-');
      return (
        <h3 id={id} className="text-xl mt-10 mb-4 font-display font-bold uppercase tracking-widest text-[var(--t-accent)]/80 flex items-center gap-3 group">
          <span className="w-1.5 h-1.5 bg-[var(--t-accent)] rounded-full opacity-30 group-hover:opacity-100 transition-all" />
          {children}
        </h3>
      );
    },
    p: ({ children }: any) => (
      <p className="text-[16px] text-[var(--t-text-secondary)] leading-[1.7] mb-6 font-normal tracking-[-0.01em] max-w-[75ch]">
        {children}
      </p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-none mb-8 space-y-3 text-[var(--t-text-secondary)] ml-2">
        {children}
      </ul>
    ),
    li: ({ children }: any) => (
      <li className="flex items-start gap-4">
        <div className="mt-[11px] w-1.5 h-1.5 rounded-full bg-[var(--t-accent)] shrink-0 shadow-[0_0_8px_rgba(var(--t-accent-rgb),0.5)] opacity-60" />
        <span className="text-[17px] sm:text-[18px] leading-[1.7] opacity-90">{children}</span>
      </li>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="my-8 pl-6 py-3 border-l-4 border-[var(--t-accent)] italic text-[17px] text-[var(--t-text-secondary)] leading-relaxed bg-[var(--t-accent)]/5 rounded-r-xl">
        {children}
      </blockquote>
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <CodeBlock 
            code={code} 
            language={match[1]} 
            className="my-8"
          />
        );
      }
      return (
        <code className="bg-[var(--t-accent)]/[0.06] text-[var(--t-accent)] px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-[var(--t-accent)]/[0.1] font-semibold" {...props}>
          {children}
        </code>
      );
    },
    table: ({ children }: any) => (
      <div className="overflow-x-auto my-8 rounded-xl border border-[var(--t-border)] bg-[var(--t-bg-secondary)]/30 backdrop-blur-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead>
        <tr className="border-b border-[var(--t-border-strong)] bg-[var(--t-accent)]/5">
          {children}
        </tr>
      </thead>
    ),
    th: ({ children }: any) => (
      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-[var(--t-accent)]">
        {children}
      </th>
    ),
    td: ({ children }: any) => (
      <td className="px-6 py-5 text-[15px] text-[var(--t-text-secondary)] font-medium">
        {children}
      </td>
    ),
    hr: () => <hr className="my-10 border-[var(--t-border)] border-t" />,
    img: ({ src, alt }: any) => (
      <div className="my-10 rounded-2xl overflow-hidden shadow-xl border border-[var(--t-border)]">
        <img src={src} alt={alt} className="w-full h-auto block" />
        {alt && (
           <div className="px-5 py-3 bg-[var(--t-bg-secondary)] border-t border-[var(--t-border)] text-[11px] font-medium text-[var(--t-text-muted)] text-center italic">
             {alt}
           </div>
        )}
      </div>
    ),
    a: ({ href, children }: any) => {
        const isExternal = href?.startsWith('http');
        if (isExternal) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--t-accent)] hover:underline font-medium">
                    {children}
                </a>
            );
        }
        return (
            <Link to={href} className="text-[var(--t-accent)] hover:underline font-medium">
                {children}
            </Link>
        );
    },
    div: ({ node, className, children, ...props }: any) => {
        if (className === 'callout') {
            const type = props['data-type'] || 'info';
            return <Alert type={type}>{children}</Alert>;
        }
        return <div className={className} {...props}>{children}</div>;
    }
  };

  return (
    <div className="markdown-content w-full pb-20">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
});

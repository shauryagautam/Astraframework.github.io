import React, { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { cn } from '../lib/utils';
import { useTheme } from '../hooks/useTheme';
import { Info, Lightbulb, AlertTriangle, AlertCircle, Check, type LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CodeBlock } from './shared/CodeBlock';
import { BalancedText } from './shared/BalancedText';
import { useState } from 'react';

const Alert = ({ type, children }: { type: string, children: React.ReactNode }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const styles: Record<string, { bg: string, border: string, icon: LucideIcon, color: string, decoration: string }> = {
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
      "my-8 p-6 sm:p-8 rounded-2xl border relative overflow-hidden flex gap-6 items-start",
      style.bg, style.border, "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1", style.decoration
    )}>
      <div className={cn("mt-1 shrink-0", style.color)}>
        <Icon size={24} />
      </div>
      <div className="text-[15px] leading-relaxed font-medium text-(--t-text-secondary)">
        <BalancedText as="span">{children as string}</BalancedText>
      </div>
    </div>
  );
};

const HeadingWithAnchor = ({ id, level, children }: { id: string, level: 2 | 3, children: React.ReactNode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (level === 2) {
    return (
      <h2 id={id} className="text-2xl sm:text-3xl mt-12 mb-5 font-display font-black uppercase tracking-tight flex items-center gap-4 group anchor-link text-(--t-text)">
        <button 
          onClick={handleCopy}
          className="text-xs font-mono text-(--t-accent) opacity-20 group-hover:opacity-100 transition-opacity hover:scale-125 active:scale-95 shrink-0"
          title="Copy link to section"
        >
          {copied ? <Check size={14} className="text-emerald-500 animate-in zoom-in duration-300" /> : '#'}
        </button>
        <BalancedText as="span">{children as string}</BalancedText>
      </h2>
    );
  }

  return (
    <h3 id={id} className="text-xl mt-8 mb-4 font-display font-bold uppercase tracking-widest text-(--t-accent)/80 flex items-center gap-3 group">
      <button 
        onClick={handleCopy}
        className="w-1.5 h-1.5 bg-(--t-accent) rounded-full opacity-30 group-hover:opacity-100 group-hover:scale-150 transition-all shrink-0 relative"
      >
        {copied && <Check size={10} className="absolute -top-1 -left-1 text-emerald-500 animate-in zoom-in" />}
      </button>
      <BalancedText as="span">{children as string}</BalancedText>
    </h3>
  );
};

import type { Components } from 'react-markdown';

export const MarkdownRenderer = memo(({ content }: { content: string }) => {
  // Process custom containers like :::tip before passing to ReactMarkdown
  const processedContent = useMemo(() => {
    if (!content) return '';
    let result = content;
    
    // Replace :::type ... ::: with <div class="callout" data-type="type"> ... </div>
    const containerRegex = /:::(\w+)\n([\s\S]*?)\n:::/g;
    result = result.replace(containerRegex, (_match, type, inner) => {
        return `<div class="callout" data-type="${type}">${inner}</div>` + "\n";
    });

    return result;
  }, [content]);

  if (!content) return null;

  const components: Components = {
    h1: ({ children }) => (
      <header className="mb-10 pt-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-black tracking-tight leading-[1.1] text-(--t-text)">
          <BalancedText as="span">{children as string}</BalancedText>
        </h1>
      </header>
    ),
    h2: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-') || '';
      return <HeadingWithAnchor id={id} level={2}>{children}</HeadingWithAnchor>;
    },
    h3: ({ children }) => {
      const id = children?.toString().toLowerCase().replace(/\s+/g, '-') || '';
      return <HeadingWithAnchor id={id} level={3}>{children}</HeadingWithAnchor>;
    },
    p: ({ children }) => (
      <p className="text-[16px] text-(--t-text-secondary) leading-[1.7] mb-5 font-normal tracking-[-0.01em] max-w-[75ch]">
        {children}
      </p>
    ),
    ul: ({ children }) => (
      <ul className="list-none mb-8 space-y-3 text-(--t-text-secondary) ml-2">
        {children}
      </ul>
    ),
    li: ({ children }) => (
      <li className="flex items-start gap-4">
        <div className="mt-[11px] w-1.5 h-1.5 rounded-full bg-(--t-accent) shrink-0 shadow-[0_0_8px_rgba(var(--t-accent-rgb),0.5)] opacity-60" />
        <span className="text-[17px] sm:text-[18px] leading-[1.7] opacity-90">{children}</span>
      </li>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-6 py-3 border-l-4 border-(--t-accent) italic text-[17px] text-(--t-text-secondary) leading-relaxed bg-(--t-accent)/5 rounded-r-xl">
        <BalancedText as="span">{children as string}</BalancedText>
      </blockquote>
    ),
    code: ({ className, children, ...props }) => {
      const isInline = !props.node?.position; // Simplified inline check
      const match = /language-(\w+)/.exec(className || '');
      const code = String(children).replace(/\n$/, '');
      
      const inlineStyle = "bg-(--t-accent)/6 text-(--t-accent) px-1.5 py-0.5 rounded-md text-[13px] font-mono border border-(--t-accent)/10 font-semibold";

      if (!isInline && match) {
        return (
          <CodeBlock 
            code={code} 
            language={match[1]} 
            className="my-8"
          />
        );
      }
      return (
        <code className={inlineStyle} {...props}>
          {children}
        </code>
      );
    },
    table: ({ children }) => (
      <div className="overflow-x-auto my-8 rounded-xl border border-(--t-border) bg-(--t-bg-secondary)/30 backdrop-blur-sm">
        <table className="w-full text-left border-collapse min-w-[600px]">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => (
      <thead>
        <tr className="border-b border-(--t-border-strong) bg-(--t-accent)/5">
          {children}
        </tr>
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-6 py-5 text-[11px] font-black uppercase tracking-widest text-(--t-accent)">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-5 text-[15px] text-(--t-text-secondary) font-medium">
        {children}
      </td>
    ),
    hr: () => <hr className="my-10 border-(--t-border) border-t" />,
    img: ({ src, alt }) => (
      <div className="my-10 rounded-2xl overflow-hidden shadow-xl border border-(--t-border)">
        <img src={src} alt={alt} className="w-full h-auto block" />
        {alt && (
           <div className="px-5 py-3 bg-(--t-bg-secondary) border-t border-(--t-border) text-[11px] font-medium text-(--t-text-muted) text-center italic">
             {alt}
           </div>
         )}
      </div>
    ),
    a: ({ href, children }) => {
        const isExternal = href?.startsWith('http');
        if (isExternal) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-(--t-accent) hover:underline font-medium">
                    {children}
                </a>
            );
        }
        return (
            <Link to={href || ''} className="text-(--t-accent) hover:underline font-medium">
                {children}
            </Link>
        );
    },
    div: ({ className, children, ...props }) => {
        if (className === 'callout') {
            const type = (props as Record<string, unknown>)['data-type'] as string || 'info';
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

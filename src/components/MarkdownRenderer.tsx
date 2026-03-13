import React, { useState } from 'react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { Copy, Check } from 'lucide-react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-20"
      title="Copy code"
    >
      {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/40" />}
    </button>
  );
};

const parseInline = (text: string) => {
  let html = text
    .replace(/`([^`]+)`/g, '<code class="bg-white/10 text-white/90 px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-white/90">$1</strong>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--t-accent)] hover:underline">$1</a>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

export const MarkdownRenderer = ({ content }: { content: string }) => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  if (!content) return null;

  const lines = content.split('\n');
  const elements = [];
  
  let inCodeBlock = false;
  let codeContent = '';
  let codeLang = '';
  
  let listItems: React.ReactNode[] = [];
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      elements.push(
        <p key={`p-${elements.length}`} className="text-lg text-[var(--t-text-secondary)] leading-relaxed mb-6 font-medium opacity-80">
          {parseInline(paragraphLines.join(' '))}
        </p>
      );
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc pl-6 mb-8 space-y-2 text-[var(--t-text-secondary)]">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inCodeBlock) {
      if (line.trim() === '```') {
        inCodeBlock = false;
        elements.push(
          <div key={`code-${elements.length}`} className={cn(
            "relative rounded-2xl border overflow-hidden mt-8 mb-16 shadow-2xl group",
            isGlass ? "glass-panel-strong border-white/10" : "bg-[#050505] border-[var(--t-border-strong)]"
          )}>
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 group-hover:bg-red-500/40 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/40 transition-colors" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors" />
              </div>
              <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest">
                {codeLang}
              </span>
            </div>
            <CopyButton text={codeContent.trim()} />
            <div className="p-8 overflow-x-auto font-mono text-sm leading-relaxed text-white/90 bg-gradient-to-br from-transparent to-white/[0.02]">
              <pre>
                <code>{codeContent.trim()}</code>
              </pre>
            </div>
          </div>
        );
        codeContent = '';
        codeLang = '';
      } else {
        codeContent += line + '\n';
      }
      continue;
    }

    if (line.startsWith('```')) {
      flushParagraph();
      flushList();
      inCodeBlock = true;
      codeLang = line.slice(3).trim();
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h1 key={`h1-${elements.length}`} className="text-5xl md:text-6xl mb-8 font-display font-black tracking-tight leading-[0.9]">
          {line.slice(2)}
        </h1>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-3xl mt-16 mb-6 font-display font-bold uppercase tracking-tight">
          {line.slice(3)}
        </h2>
      );
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-xl mt-10 mb-4 font-display font-bold uppercase tracking-tight text-white/80">
          {line.slice(4)}
        </h3>
      );
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ')) {
      flushParagraph();
      listItems.push(
        <li key={`li-${listItems.length}`}>
          {parseInline(line.slice(2))}
        </li>
      );
      continue;
    }

    if (line.trim() === '') {
      flushParagraph();
      flushList();
      continue;
    }

    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return <div className="markdown-content w-full">{elements}</div>;
};

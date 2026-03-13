import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export const CodeBlock = ({ code, language = 'go', filename }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "relative rounded-2xl border overflow-hidden mt-8 mb-16 shadow-2xl group",
      isGlass ? "glass-panel-strong border-white/10" : "bg-[#050505] border-[var(--t-border-strong)]"
    )}>
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 group-hover:bg-red-500/40 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 group-hover:bg-yellow-500/40 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 group-hover:bg-green-500/40 transition-colors" />
          </div>
          {filename && (
            <span className="text-[10px] font-mono text-white/40">{filename}</span>
          )}
        </div>
        <span className="text-[10px] font-mono uppercase text-white/30 tracking-widest">
          {language}
        </span>
      </div>
      
      <button
        onClick={handleCopy}
        className="absolute top-14 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors z-20"
        title="Copy code"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} className="text-white/40" />}
      </button>

      <div className="p-8 overflow-x-auto font-mono text-sm leading-relaxed text-white/90 bg-gradient-to-br from-transparent to-white/[0.02]">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};

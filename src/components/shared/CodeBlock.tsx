import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface CodeBlockProps {
  code: string;
  title?: string;
  copyable?: boolean;
  className?: string;
}

export const CodeBlock = ({ 
  code, 
  title, 
  copyable = true,
  className 
}: CodeBlockProps) => {
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
      "relative rounded-xl border overflow-hidden shadow-2xl group",
      isGlass ? "glass-panel-strong border-white/10" : "bg-[#0a0a0a] border-[var(--t-border-strong)]",
      className
    )}>
      {title && (
        <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-4 text-xs font-mono text-white/40">
            <span>{title}</span>
          </div>
          {copyable && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
            >
              {copied ? (
                <><Check size={12} /> Copied</>
              ) : (
                <><Copy size={12} /> Copy</>
              )}
            </button>
          )}
        </div>
      )}
      
      <div className="p-8 font-mono text-sm overflow-x-auto">
        <AnimatePresence mode="wait">
          <motion.pre
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-white/80"
          >
            <code>{code}</code>
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
};

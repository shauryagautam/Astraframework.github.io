import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  iconSize?: number;
}

export const CopyButton = ({ text, className, iconSize = 14 }: CopyButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "relative p-2 rounded-lg transition-all flex items-center justify-center overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 active:scale-95 group/copy",
        className
      )}
      title="Copy to clipboard"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={iconSize} className="text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Copy size={iconSize} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Tooltip or feedback can be added here if needed */}
    </button>
  );
};

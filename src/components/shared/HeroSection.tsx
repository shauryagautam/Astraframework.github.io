import { motion } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BalancedText } from './BalancedText';

interface HeroSectionProps {
  quickstart?: string;
  title?: string;
  subtitle?: string;
  features?: {
    label: string;
    description: string;
  }[];
}

export const HeroSection = ({ 
  quickstart = "go install github.com/astraframework/astra/cli@latest",
  title = "High productivity through compile-time guarantees.",
  subtitle = "A production-grade full-stack framework of Go.",
  features = [
    { label: "001 / DESIGN", description: "Astra is a structured Go framework providing clear patterns for building maintainable web applications." },
    { label: "002 / ECOSYSTEM", description: "Built-in routing, middleware, and database tools provide a complete foundation for web development." }
  ]
}: HeroSectionProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(quickstart);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-32 lg:pt-40 overflow-hidden">
      <div className="grid-background absolute inset-0 -z-10" />
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-12">
        <div className="flex flex-col">
          <motion.div 
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="blueprint-line-h w-24" />
            <BalancedText className="text-sm font-bold tracking-[0.2em] uppercase shrink-0">
              {subtitle}
            </BalancedText>
          </motion.div>

          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[42px] xs:text-[52px] md:text-[8vw] lg:text-[7vw] leading-[0.85] font-extrabold tracking-[-0.05em] mb-8 lg:mb-12"
          >
            <BalancedText children={title} />
          </motion.h1>
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-[500px] bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[9px] md:text-[10px] text-white/30 font-mono tracking-widest uppercase">Quickstart</span>
          </div>
          <div className="p-4 md:p-6">
            <div className="flex items-start gap-2 md:gap-3 group">
              <Terminal className="text-[#8A8A8A] mt-1 shrink-0" size={14} />
              <code className="text-xs md:text-sm font-mono text-white/90 leading-relaxed break-all">
                {quickstart}
              </code>
              <button 
                onClick={handleCopy}
                className="ml-auto text-[#8A8A8A] hover:text-white flex items-center gap-1 transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-green-500 font-mono text-xs md:text-sm leading-none">$</span>
              <code className="text-xs md:text-sm font-mono text-white/50 italic"># Initialize your next project</code>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mt-auto border-t border-(--t-border-strong) pt-8 md:pt-12 pb-8 md:pb-12 text-center sm:text-left">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + (idx * 0.1) }}
            className="flex flex-col items-center sm:items-start"
          >
            <span className="text-[10px] md:text-xs font-bold mb-2 uppercase tracking-wider">{feature.label}</span>
            <BalancedText className="text-xs md:text-sm leading-relaxed max-w-[320px] text-(--t-text-secondary)">
              {feature.description}
            </BalancedText>
          </motion.div>
        ))}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col justify-end items-center sm:items-start lg:items-end w-full sm:col-span-2 lg:col-span-1"
        >
          <Link 
            to="/docs" 
            className="w-full sm:w-auto text-center bg-(--t-accent) text-(--t-accent-text) px-8 py-4 text-xs md:text-sm font-bold uppercase tracking-widest hover:bg-(--t-accent-hover) hover:text-(--t-accent-hover-text) hover:shadow-[0_0_20px_rgba(var(--t-accent-rgb),0.3)] transition-all"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-1/4 translate-x-1/3 -rotate-90 hidden xl:block">
        <span className="text-[10vw] font-display font-extrabold text-(--t-watermark) select-none uppercase">Fullstack</span>
      </div>
    </section>
  );
};

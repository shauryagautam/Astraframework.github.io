import { motion } from 'framer-motion';
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
  title = "STRUCTURED<br />FRAMEWORK.",
  subtitle = "Go Framework",
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
            <span className="text-sm font-bold tracking-[0.2em] uppercase">{subtitle}</span>
          </motion.div>

          <motion.h1 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-[12vw] md:text-[14vw] lg:text-[10vw] leading-[0.85] font-extrabold tracking-[-0.05em] mb-8"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </div>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-[500px] bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] text-white/30 font-mono tracking-widest uppercase">Quickstart</span>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-3 group">
              <Terminal className="text-[#8A8A8A] mt-1 shrink-0" size={16} />
              <code className="text-sm font-mono text-white/90 leading-relaxed break-all">
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
              <span className="text-green-500 font-mono text-sm leading-none">$</span>
              <code className="text-sm font-mono text-white/50 italic"># Initialize your next project</code>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-auto border-t border-[var(--t-border-strong)] pt-12 pb-12">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 + (idx * 0.1) }}
            className="flex flex-col"
          >
            <span className="text-xs font-bold mb-2">{feature.label}</span>
            <p className="text-sm leading-relaxed max-w-[300px] text-[var(--t-text-secondary)]">
              {feature.description}
            </p>
          </motion.div>
        ))}

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col justify-end items-start md:items-end"
        >
          <Link 
            to="/docs" 
            className="bg-[var(--t-accent)] text-[var(--t-accent-text)] px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-[var(--t-accent-hover)] hover:text-[var(--t-accent-hover-text)] hover:ring-1 hover:ring-[var(--t-border-strong)] transition-all"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      <div className="absolute right-0 bottom-1/4 translate-x-1/3 -rotate-90 hidden xl:block">
        <span className="text-[10vw] font-display font-extrabold text-[var(--t-watermark)] select-none uppercase">Fullstack</span>
      </div>
    </section>
  );
};

import { motion } from 'framer-motion';
import { Download, PlusCircle, Play, ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { CopyButton } from './shared/CopyButton';

const steps = [
  {
    id: '01',
    title: 'Install CLI',
    desc: 'Install the Astra CLI to create and manage projects.',
    cmd: 'go install github.com/astraframework/astra/cli@latest',
    icon: Download
  },
  {
    id: '02',
    title: 'Create App',
    desc: 'Generate a new Astra project with standard structure and configuration.',
    cmd: 'astra new myapp',
    icon: PlusCircle
  },
  {
    id: '03',
    title: 'Run Dev',
    desc: 'Start the development server to begin building your application.',
    cmd: 'cd myapp && astra dev',
    icon: Play
  }
];

export const GettingStarted = () => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  return (
    <section id="docs" className="px-6 py-24 bg-[var(--t-bg)] relative overflow-hidden transition-colors duration-400">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-16">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--t-text-muted)] mb-2">Workflow</span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl mb-6">QUICK START.</h2>
          <p className="text-lg max-w-2xl text-[var(--t-text-secondary)]">
            Get an Astra application running in minutes with the CLI tool that handles project setup and development workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className={cn(
                "group relative p-8 border transition-all shadow-sm rounded-sm",
                isGlass
                  ? "glass-panel hover:bg-white/10"
                  : "bg-[var(--t-surface)] border-[var(--t-border)] hover:border-[var(--t-border-strong)]"
              )}
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-3 bg-[var(--t-accent)] text-[var(--t-accent-text)] rounded-sm group-hover:scale-110 transition-transform">
                  <step.icon size={20} />
                </div>
                <span className="text-4xl font-display font-extrabold opacity-5 italic">{step.id}</span>
              </div>
              
              <h3 className="text-xl mb-3">{step.title}</h3>
              <p className="text-sm text-[var(--t-text-secondary)] mb-6 leading-relaxed">
                {step.desc}
              </p>

              <div className="relative bg-[var(--t-code-bg)] p-4 rounded-sm font-mono text-[11px] break-all border border-[var(--t-border)] group-hover:bg-[var(--t-code-bg-hover)] transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <span className="text-[var(--t-text-muted)] mr-2">$</span>
                    {step.cmd}
                  </div>
                  <CopyButton text={step.cmd} iconSize={12} className="w-8 h-8 p-0 border-none bg-transparent hover:bg-white/5" />
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-[var(--t-border-strong)]">
                  <ArrowRight size={32} />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

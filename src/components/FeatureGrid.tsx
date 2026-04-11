import { Cpu, ShieldCheck, Zap, Database, Terminal, Server } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { FeatureCard } from './shared/FeatureCard';
import { BalancedText } from './shared/BalancedText';

const features = [
  { id: '001', title: 'Static Dependency Injection', desc: 'Powered by Google Wire. Catch missing dependencies at compile-time with zero runtime reflection tax.', icon: Cpu, stack: 'Core / IoC' },
  { id: '002', title: 'Unified Server Multiplexing', desc: 'Serve standard REST/HTTP and HTTP/2 gRPC traffic over a single TCP port.', icon: Database, stack: 'Routing / HTTP' },
  { id: '003', title: 'Generics-based ORM', desc: 'Type-safe database queries, iterators, and automatic nested transactions via SAVEPOINTs.', icon: ShieldCheck, stack: 'Data / Persistence' },
  { id: '004', title: 'Native Asset Pipeline', desc: 'Deep Vite and Tailwind integration with dual-mode proxying for HMR and SSR.', icon: Zap, stack: 'Security / Auth' },
  { id: '005', title: 'CLI & Tooling', desc: 'Project generators, development server, and command-line tools for productive development.', icon: Terminal, stack: 'DX / CLI' },
  { id: '006', title: 'Observability', desc: 'Logging, health checks, and monitoring integration for production-ready applications.', icon: Server, stack: 'Monitoring / Health' },
];

export const FeatureGrid = () => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  return (
    <section
      id="features"
      className={cn(
        "px-6 py-24 text-white relative",
        isGlass ? "bg-transparent" : "bg-black"
      )}
    >
      <div className="grid-background-dark absolute inset-0 opacity-20" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8A8A8A] mb-2 uppercase tracking-widest">Capabilities</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl">
              <BalancedText children="FRAMEWORK. FEATURES." />
            </h2>
          </div>
          <div className="text-left md:text-right max-w-[400px]">
            <BalancedText className="text-xs text-[#8A8A8A] uppercase leading-relaxed font-bold">
              A COMPREHENSIVE FRAMEWORK WITH INTEGRATED TOOLS FOR BUILDING 
              MAINTAINABLE WEB APPLICATIONS IN GO.
            </BalancedText>
          </div>
        </div>

        <div className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-white/10"
        )}>
          {features.map((feature, idx) => (
            <FeatureCard
              key={feature.id}
              id={feature.id}
              title={feature.title}
              description={feature.desc}
              icon={feature.icon}
              stack={feature.stack}
              delay={idx * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

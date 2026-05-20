import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  Database, 
  Layers, 
  Compass, 
  Boxes, 
  Workflow, 
  Activity, 
  Terminal,
  ArrowRight
} from 'lucide-react';

const TOPICS = [
  { name: 'Middleware', path: '/docs/core-concepts/architecture#middleware', icon: Layers },
  { name: 'Validation', path: '/docs/core-concepts/architecture#request-validation', icon: Shield },
  { name: 'Authentication', path: '/docs/auth/security', icon: Compass },
  { name: 'ORM', path: '/docs/database/persistence#why-the-orm-is-generic', icon: Database },
  { name: 'Migrations', path: '/docs/database/persistence#migrations', icon: Boxes },
  { name: 'HTTP Context', path: '/docs/core-concepts/architecture#http-context', icon: Zap },
  { name: 'Testing', path: '/docs/production/testing', icon: Activity },
  { name: 'Deployment', path: '/docs/production/deployment', icon: Workflow }
];

export const DocsTopicSearch = () => {
  return (
    <section className="mt-32 pt-20 border-t border-(--t-border)/50">
      <header className="mb-12">
        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-(--t-accent) mb-4">Quick Navigation</h4>
        <h2 className="text-3xl font-display font-black tracking-tight text-(--t-text)">Deep Dive by Topic</h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TOPICS.map((topic, idx) => {
          const Icon = topic.icon;
          return (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link 
                to={topic.path}
                className="group flex flex-col p-6 rounded-2xl border border-(--t-border) bg-(--t-bg-secondary)/20 hover:bg-(--t-accent)/5 hover:border-(--t-accent)/30 transition-all h-full"
              >
                <div className="w-10 h-10 rounded-xl bg-(--t-accent)/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-(--t-accent)/70 group-hover:text-(--t-accent)" />
                </div>
                
                <div className="flex items-center justify-between mt-auto">
                    <span className="text-[13px] font-bold text-(--t-text-secondary) group-hover:text-(--t-text) transition-colors">
                        {topic.name}
                    </span>
                    <ArrowRight size={14} className="text-(--t-text-muted) opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-16 p-8 rounded-3xl border border-dashed border-(--t-border) flex flex-col md:flex-row items-center justify-between gap-6 bg-(--t-bg-secondary)/10">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-(--t-accent)/10 flex items-center justify-center">
                <Terminal size={20} className="text-(--t-accent)" />
            </div>
            <div>
                <h5 className="text-sm font-bold">Can't find what you're looking for?</h5>
                <p className="text-[12px] text-(--t-text-muted)">Try the global search or check the full index.</p>
            </div>
        </div>
        <button className="px-6 py-3 rounded-xl bg-(--t-text) text-(--t-bg) text-[11px] font-black uppercase tracking-widest hover:scale-105 transition-all">
            Full API Index
        </button>
      </div>
    </section>
  );
};

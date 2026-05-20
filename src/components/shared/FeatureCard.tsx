import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useTheme';
import { BalancedText } from './BalancedText';

interface FeatureCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  stack: string;
  delay?: number;
  className?: string;
}

export const FeatureCard = ({ 
  id, 
  title, 
  description, 
  icon: Icon, 
  stack, 
  delay = 0,
  className 
}: FeatureCardProps) => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      viewport={{ once: true }}
      className={cn(
        "p-8 md:p-12 border-b border-white/10 md:border-r group cursor-default transition-colors",
        isGlass
          ? "hover:bg-white/5 backdrop-blur-sm"
          : "hover:bg-white/5",
        className
      )}
    >
      <div className="flex justify-between items-start mb-12">
        <span className="text-xs font-mono text-[#8A8A8A]">{id}</span>
        <Icon className="text-white group-hover:scale-110 transition-transform" size={24} />
      </div>
      <h3 className="text-2xl mb-4 group-hover:translate-x-2 transition-transform">{title}</h3>
      <BalancedText className="text-sm text-[#8A8A8A] leading-relaxed group-hover:text-white transition-colors mb-6">
        {description}
      </BalancedText>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 rounded-full bg-green-500" />
        <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest">{stack}</span>
      </div>
    </motion.div>
  );
};

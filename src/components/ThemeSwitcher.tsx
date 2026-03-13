import { Sun, Moon, Droplets } from 'lucide-react';
import { useTheme, type Theme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: 'light', icon: Sun, label: 'Light' },
  { value: 'dark', icon: Moon, label: 'Dark' },
  { value: 'liquid-glass', icon: Droplets, label: 'Glass' },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="relative flex items-center gap-1 p-1.5 rounded-full border border-[var(--t-border-strong)] bg-[var(--t-surface)] shadow-sm overflow-hidden">
      <motion.div
        className="absolute inset-0 theme-switcher-glow"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {themes.map(({ value, icon: Icon, label }) => (
        <motion.button
          key={value}
          onClick={() => setTheme(value)}
          className={cn(
            "relative p-2.5 rounded-full transition-all duration-300 z-10",
            theme === value
              ? "text-[var(--t-accent-text)] scale-110"
              : "text-[var(--t-text-muted)] hover:text-[var(--t-text)] hover:scale-105"
          )}
          whileHover={{ scale: theme === value ? 1.1 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={label}
          aria-label={`Switch to ${label} theme`}
        >
          <AnimatePresence mode="wait">
            {theme === value && (
              <motion.div
                layoutId="theme-bg"
                className="absolute inset-0 rounded-full bg-[var(--t-accent)] shadow-lg"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
          </AnimatePresence>
          <motion.div
            animate={theme === value ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <Icon size={16} strokeWidth={2.5} />
          </motion.div>
        </motion.button>
      ))}
    </div>
  );
};

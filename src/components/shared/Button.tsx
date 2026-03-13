import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  external?: boolean;
}

export const Button = ({ 
  children, 
  href, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  className,
  external = false
}: ButtonProps) => {
  const baseClasses = "font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-[var(--t-accent)] text-[var(--t-accent-text)] hover:bg-[var(--t-accent-hover)] hover:text-[var(--t-accent-hover-text)]",
    secondary: "border-2 border-[var(--t-text)] hover:bg-[var(--t-text)] hover:text-[var(--t-bg)]",
    ghost: "hover:bg-[var(--t-surface-hover)] text-[var(--t-text-secondary)] hover:text-[var(--t-text)]"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-8 py-4 text-base",
    lg: "px-12 py-6 text-xl"
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    className
  );

  const motionProps = {
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring" as const, stiffness: 400, damping: 30 }
  };

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        {...motionProps}
        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      className={classes}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

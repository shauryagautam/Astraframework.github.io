import React, { useLayoutEffect, useRef, useState } from 'react';
import { prepare, layout } from '@chenglou/pretext';

interface BalancedTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

/**
 * BalancedText uses @chenglou/pretext to ensure that text lines are balanced
 * in length, avoiding "orphans" and creating a premium editorial look.
 */
export const BalancedText = ({ 
  children, 
  className = '', 
  as: Component = 'div' 
}: BalancedTextProps) => {
  const containerRef = useRef<HTMLElement>(null);
  const [balancedWidth, setBalancedWidth] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || typeof children !== 'string') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (balancedWidth !== null) setBalancedWidth(null);
      return;
    }

    // Get the computed font and current width
    const style = window.getComputedStyle(el);
    const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const initialWidth = el.offsetWidth;
    const lineHeightStr = style.lineHeight;
    const lineHeight = parseFloat(lineHeightStr) || (parseFloat(style.fontSize) * 1.2);

    // 1. Prepare the text with Pretext
    const prepared = prepare(children, font);

    // 2. Measure the height (line count) at full width
    const fullLayout = layout(prepared, initialWidth, lineHeight);
    const targetLineCount = fullLayout.lineCount;

    // If it's just one line, no balancing needed
    if (targetLineCount <= 1) {
      if (balancedWidth !== null) setBalancedWidth(null);
      return;
    }

    // 3. Binary search for the smallest width that keeps the same line count
    let min = 0;
    let max = initialWidth;
    let bestWidth = initialWidth;

    for (let i = 0; i < 10; i++) {
        const mid = (min + max) / 2;
        const currentLayout = layout(prepared, mid, lineHeight);
        
        if (currentLayout.lineCount <= targetLineCount) {
            bestWidth = mid;
            max = mid;
        } else {
            min = mid;
        }
    }

    if (Math.abs((balancedWidth || 0) - bestWidth) > 1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setBalancedWidth(bestWidth);
    }
  }, [children, balancedWidth]);

  const Tag = Component as any;

  return (
    <Tag 
      ref={containerRef}
      className={className} 
      style={{ 
        maxWidth: balancedWidth ? `${balancedWidth + 1}px` : 'none',
        display: Component === 'span' ? 'inline-block' : 'block'
      }}
    >
      {children}
    </Tag>
  );
};

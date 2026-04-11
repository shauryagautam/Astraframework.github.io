import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';
import { CopyButton } from './CopyButton';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({ 
  code: rawCode, 
  language = 'text', 
  filename,
  className,
  showLineNumbers = false
}: CodeBlockProps) => {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';
  
  const code = rawCode.trim();

  return (
    <div className={cn(
      "group relative rounded-xl border overflow-hidden my-8 shadow-2xl transition-all duration-300",
      isGlass ? "glass-panel-strong border-white/10" : "bg-[#050505] border-(--t-border-strong)",
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-2.5 border-b border-white/5 bg-white/[0.03] backdrop-blur-3xl">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5 opacity-20">
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white" />
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
          {filename && (
            <span className="text-[10px] font-mono tracking-wider text-white/40 group-hover:text-white/70 transition-colors">
              {filename}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-mono tracking-[0.2em] font-black uppercase text-white/20 group-hover:text-white/50 transition-all duration-500">
              {language}
           </span>
           <div className="w-px h-3 bg-white/10 mx-1" />
           <CopyButton
             text={code}
             className="border-none bg-transparent hover:bg-white/5 p-1.5 h-auto text-white/30 hover:text-white/90"
             iconSize={14}
           />
        </div>
      </div>

      <div className="relative">
        {/* Code Content */}
        <div className="p-6 overflow-x-auto font-mono text-[13px] sm:text-[14px] leading-relaxed custom-scrollbar">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            showLineNumbers={showLineNumbers}
            lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1.5em', color: 'rgba(255,255,255,0.15)', textAlign: 'right', userSelect: 'none' }}
            customStyle={{
              background: 'transparent',
              padding: 0,
              margin: 0,
            }}
            codeTagProps={{
              style: {
                fontFamily: 'var(--font-mono, ui-mono, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace)',
                background: 'transparent',
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

import { Routes, Route } from 'react-router-dom'
import { Hero } from './components/Hero'
import { FeatureGrid } from './components/FeatureGrid'
import { GettingStarted } from './components/GettingStarted'
import { CodeExample } from './components/CodeExample'
import { useTheme } from './context/ThemeContext'
import { DocsPage } from './pages/DocsPage'
import { DocsLanding } from './pages/DocsLanding'

import { MarketingLayout } from './layouts/MarketingLayout'
import { ScrollToHashElement } from './components/ScrollToHashElement'

function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      
      <div className="py-12 border-y border-[var(--t-border)] bg-[var(--t-bg-secondary)] overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-marquee">
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">High Performance</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Go Framework</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Full-stack</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Type-safe</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Modern DX</span>
        </div>
        <div className="inline-block animate-marquee">
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">High Performance</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Go Framework</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Full-stack</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Type-safe</span>
          <span className="text-4xl font-display font-extrabold mx-8 opacity-20 uppercase tracking-tighter italic">Modern DX</span>
        </div>
      </div>

      <GettingStarted />
      <FeatureGrid />
      <CodeExample />

      <section className="px-6 py-40 flex flex-col items-center justify-center text-center bg-[var(--t-bg)] relative overflow-hidden">
        <div className="grid-background absolute inset-0 opacity-10" />
        <h2 className="text-[60px] xs:text-[80px] sm:text-[15vw] lg:text-[12vw] leading-[0.8] mb-12 relative z-10">START<br />BUILDING.</h2>
        <a 
          href="https://github.com/shauryagautam/Astra#readme" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-[var(--t-accent)] text-[var(--t-accent-text)] text-xl px-12 py-6 font-bold uppercase tracking-[0.2em] hover:scale-105 transition-transform relative z-10 inline-block"
        >
          Get Started Now
        </a>
      </section>
    </MarketingLayout>
  );
}

function App() {
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  return (
    <>
      <ScrollToHashElement />
      {isGlass && (
        <div className="liquid-glass-bg" aria-hidden="true">
          <div className="liquid-glass-orb-1" />
          <div className="liquid-glass-orb-2" />
        </div>
      )}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/docs" element={<DocsLanding />} />
        <Route path="/docs/:categoryId/:sectionId" element={<DocsPage />} />
      </Routes>
    </>
  )
}

export default App

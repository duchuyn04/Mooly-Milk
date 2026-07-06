import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMediaQuery } from './hooks/useMediaQuery';
import { IntroOverlay } from './components/IntroOverlay/IntroOverlay';
import { Nav } from './components/Nav/Nav';
import { HeroSection } from './components/HeroSection/HeroSection';
import { FlavorsSection } from './components/FlavorsSection/FlavorsSection';
import { BenefitsSection } from './components/BenefitsSection/BenefitsSection';
import { Footer } from './components/Footer/Footer';
import { SmoothScroll } from './components/SmoothScroll/SmoothScroll';
import { Agentation } from 'agentation';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [introDone, setIntroDone] = useState(false);
  const heroRef = useRef(null);
  const prefersReducedMotion = false;
  const isTouch = useMediaQuery('(pointer: coarse)');
  const isNarrow = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    if (isTouch) {
      document.body.classList.add('is-touch');
    } else {
      document.body.classList.remove('is-touch');
    }
    return () => document.body.classList.remove('is-touch');
  }, [isTouch]);

  useEffect(() => {
    // Refresh ScrollTrigger after fonts and images load
    const handleLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }
    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const handleIntroComplete = () => {
    setIntroDone(true);
  };

  return (
    <SmoothScroll>
      <a href="#main-content" className="skip-link">Bỏ qua nội dung</a>
      <IntroOverlay
        prefersReducedMotion={prefersReducedMotion}
        onComplete={handleIntroComplete}
      />
      <Nav />
      <main id="main-content">
        <HeroSection
          ref={heroRef}
          prefersReducedMotion={prefersReducedMotion}
          play={introDone}
        />
        <FlavorsSection
          prefersReducedMotion={prefersReducedMotion}
          isTouch={isTouch}
          isNarrow={isNarrow}
        />
        <BenefitsSection
          prefersReducedMotion={prefersReducedMotion}
          isTouch={isTouch}
          isNarrow={isNarrow}
        />
      </main>
      <Footer />
      {import.meta.env.DEV && <Agentation endpoint="http://localhost:4747" />}
    </SmoothScroll>
  );
}

export default App;

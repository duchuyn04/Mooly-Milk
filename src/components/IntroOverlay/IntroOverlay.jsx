import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useGSAP } from '@gsap/react';
import { flavors } from '../../data/flavors';
import { SplitText } from '../../utils/SplitText';
import styles from './IntroOverlay.module.css';

gsap.registerPlugin(MotionPathPlugin);

const introFlavorIndices = [0, 4, 3, 5];
const introCanPositions = [
  { top: '18%', left: '12%' },
  { bottom: '18%', left: '15%' },
  { top: '22%', right: '18%' },
  { bottom: '20%', right: '14%' },
];

function streamPath(i) {
  const spreadX = 45 + i * 16 + gsap.utils.random(-12, 12);
  const spreadY = -75 - i * 12 + gsap.utils.random(-18, 12);
  const cpX = spreadX * 0.35 + gsap.utils.random(-15, 15);
  const cpY = spreadY * 0.4 + gsap.utils.random(-10, 10);
  return `M0,0 Q${cpX},${cpY} ${spreadX},${spreadY}`;
}


export function IntroOverlay({ prefersReducedMotion, onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const cansRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
  const waveRef = useRef(null);
  const dropletsRef = useRef(null);
  const logoMaskRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const [hasSeenIntro, setHasSeenIntro] = useState(false);

  useEffect(() => {
    try {
      setHasSeenIntro(sessionStorage.getItem('moolyIntroSeen') === '1');
    } catch (e) {
      setHasSeenIntro(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      document.body.classList.add('intro-locked');
    } else {
      document.body.classList.remove('intro-locked');
    }
    return () => document.body.classList.remove('intro-locked');
  }, [visible]);

  useGSAP(
    () => {
      if (!visible || hasSeenIntro || prefersReducedMotion) {
        finishIntro();
        return;
      }

      const overlay = overlayRef.current;
      const logo = logoRef.current;
      const progressBar = progressBarRef.current;
      const progressText = progressTextRef.current;
      const wave = waveRef.current;
      const droplets = dropletsRef.current;
      const logoMask = logoMaskRef.current;
      const dropletEls = droplets.querySelectorAll(`.${styles.droplet}`);
      const streamSvgs = overlay.querySelectorAll(`.${styles.milkStreamSvg}`);

      const introTl = gsap.timeline({
        onComplete: () => {
          finishIntro();
          try {
            sessionStorage.setItem('moolyIntroSeen', '1');
          } catch (e) {}
        },
      });

      // Initial states
      gsap.set(wave, { yPercent: 100 });
      gsap.set(logoMask, { clipPath: 'inset(50% 50% 50% 50% round 50%)' });
      gsap.set(logo.querySelectorAll('.char'), { opacity: 0 });
      gsap.set(`.${styles.introCan}`, {
        y: '120vh',
        opacity: 0,
        scale: 0.6,
        rotation: () => gsap.utils.random(-35, 35),
      });
      gsap.set(dropletEls, { scale: 0, opacity: 0, x: 0, y: 0 });

      // 1. Milk wave rises then recedes
      introTl.to(wave, { yPercent: 0, duration: 1.0, ease: 'power2.inOut' });
      introTl.to(wave, { yPercent: 100, duration: 0.9, ease: 'power2.inOut' }, 1.1);

      // 2. Logo reveals through a droplet-shaped clip-path as wave recedes
      introTl.to(
        logo.querySelectorAll('.char'),
        { opacity: 1, duration: 0.4, stagger: 0.04 },
        1.0
      );
      introTl.to(
        logoMask,
        {
          clipPath: 'inset(0% 0% 0% 0% round 0%)',
          duration: 0.9,
          ease: 'power3.out',
        },
        1.05
      );

      // 3. Cans float up from the wave and settle into corners
      introTl.to(
        `.${styles.introCan}`,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: () => gsap.utils.random(-8, 8),
          duration: 1.0,
          stagger: 0.12,
          ease: 'back.out(1.4)',
        },
        1.0
      );

      // 3.5 Milk streams spray from carton straws
      const allStreamPaths = [];
      const allStreamDrops = [];
      streamSvgs.forEach((svg) => {
        const paths = svg.querySelectorAll(`.${styles.streamCore}, .${styles.streamWisp}`);
        const drops = svg.querySelectorAll(`.${styles.streamDrop}`);
        paths.forEach((path) => {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 });
        });
        gsap.set(drops, { opacity: 0, scale: 0 });
        allStreamPaths.push(...paths);
        allStreamDrops.push({ paths, drops });
      });

      introTl.to(
        allStreamPaths,
        {
          strokeDashoffset: 0,
          opacity: (i) => (i % 4 < 2 ? 0.95 : 0.35),
          duration: 0.55,
          stagger: { each: 0.03, from: 'random' },
          ease: 'power2.out',
        },
        1.7
      );

      allStreamDrops.forEach(({ paths, drops }, canIndex) => {
        drops.forEach((drop, i) => {
          const path = paths[i % paths.length];
          const delay = 1.75 + canIndex * 0.06 + i * 0.03;
          introTl.to(
            drop,
            {
              duration: 0.5,
              ease: 'power2.out',
              motionPath: {
                path,
                align: true,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
                end: 0.55 + Math.random() * 0.25,
              },
              opacity: 1,
              scale: 0.7 + Math.random() * 0.5,
            },
            delay
          );
          introTl.to(
            drop,
            {
              opacity: 0,
              scale: 0,
              duration: 0.25,
              ease: 'power1.in',
            },
            delay + 0.35
          );
        });
      });

      introTl.to(
        allStreamPaths,
        {
          opacity: 0,
          duration: 0.45,
          stagger: { each: 0.03, from: 'random' },
          ease: 'power1.in',
        },
        2.4
      );

      // 4. Fake progress loader
      const progressObj = { val: 0 };
      introTl.to(
        progressObj,
        {
          val: 100,
          duration: 2.0,
          ease: 'power2.inOut',
          onUpdate: () => {
            const p = Math.round(progressObj.val);
            if (progressBar) progressBar.style.width = p + '%';
            if (progressText) progressText.textContent = p + '%';
          },
        },
        0.4
      );

      // 5. Wave bursts into droplets
      introTl.to(
        dropletEls,
        {
          scale: () => gsap.utils.random(0.6, 1.4),
          opacity: 1,
          x: () => `${gsap.utils.random(-38, 38)}vw`,
          y: () => `${gsap.utils.random(-38, 38)}vh`,
          duration: 0.75,
          stagger: 0.02,
          ease: 'power2.out',
        },
        2.7
      );

      // 6. Droplets fade, overlay exits through circular clip
      introTl.to(dropletEls, { opacity: 0, duration: 0.35, ease: 'power2.in' }, 3.2);
      introTl.fromTo(
        overlay,
        { clipPath: 'circle(150% at 50% 50%)' },
        { clipPath: 'circle(0% at 50% 50%)', duration: 1.0, ease: 'power3.inOut' },
        3.0
      );

      const handleClick = () => {
        introTl.kill();
        finishIntro();
      };
      overlay.addEventListener('click', handleClick, { once: true });

      return () => {
        overlay.removeEventListener('click', handleClick);
      };
    },
    { scope: overlayRef, dependencies: [visible, hasSeenIntro, prefersReducedMotion] }
  );

  const finishIntro = () => {
    setVisible(false);
    document.body.classList.remove('intro-locked');
    onComplete?.();
  };

  if (!visible) return null;

  return (
    <div ref={overlayRef} className={styles.introOverlay} aria-hidden="true">
      <div ref={waveRef} className={styles.milkWave}>
        <div className={styles.milkWaveCurve} />
      </div>

      <div ref={dropletsRef} className={styles.droplets}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} className={styles.droplet} />
        ))}
      </div>

      <div ref={cansRef} className={styles.introCans}>
        {introFlavorIndices.map((flavorIndex, i) => (
          <div
            key={flavorIndex}
            className={styles.introCan}
            style={introCanPositions[i]}
          >
            <img
              className="can-svg"
              src={flavors[flavorIndex].img}
              alt=""
              width="1254"
              height="1254"
              loading="lazy"
            />
            <div className={styles.canSpray}>
              <svg
                className={styles.milkStreamSvg}
                viewBox="0 0 140 180"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient
                    id={`streamFade-${flavorIndex}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="var(--milk)" stopOpacity="0.98" />
                    <stop offset="55%" stopColor="var(--milk)" stopOpacity="0.55" />
                    <stop offset="100%" stopColor="var(--milk)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g className={styles.streamGroup}>
                  {Array.from({ length: 2 }).map((_, i) => (
                    <path
                      key={`core-${i}`}
                      className={styles.streamCore}
                      d={streamPath(i)}
                      stroke={`url(#streamFade-${flavorIndex})`}
                    />
                  ))}
                  {Array.from({ length: 2 }).map((_, i) => (
                    <path
                      key={`wisp-${i}`}
                      className={styles.streamWisp}
                      d={streamPath(i + 2)}
                      stroke={`url(#streamFade-${flavorIndex})`}
                    />
                  ))}
                </g>
                <g className={styles.dropGroup}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <circle
                      key={`drop-${i}`}
                      className={styles.streamDrop}
                      r={2 + Math.random() * 2}
                    />
                  ))}
                </g>
              </svg>
            </div>
          </div>
        ))}
      </div>
      <div ref={logoRef} className={styles.introLogo}>
        <div ref={logoMaskRef} className={styles.logoMask}>
          <SplitText>MooLy</SplitText>
        </div>
      </div>
      <div className={styles.introProgress}>
        <div ref={progressBarRef} className={styles.introProgressBar} />
        <span ref={progressTextRef} className={styles.introProgressText}>
          0%
        </span>
      </div>
    </div>
  );
}

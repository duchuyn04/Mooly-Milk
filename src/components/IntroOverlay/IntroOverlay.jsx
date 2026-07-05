import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { flavors } from '../../data/flavors';
import { SplitText } from '../../utils/SplitText';
import styles from './IntroOverlay.module.css';

const introFlavorIndices = [0, 4, 3]; // matcha, strawberry, chocolate
const introCanPositions = [
  { top: '18%', left: '12%' },
  { top: '62%', right: '14%' },
  { top: '22%', right: '18%' },
];

export function IntroOverlay({ prefersReducedMotion, onComplete }) {
  const overlayRef = useRef(null);
  const logoRef = useRef(null);
  const cansRef = useRef(null);
  const progressBarRef = useRef(null);
  const progressTextRef = useRef(null);
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

      const introTl = gsap.timeline({
        onComplete: () => {
          finishIntro();
          try {
            sessionStorage.setItem('moolyIntroSeen', '1');
          } catch (e) {}
        },
      });

      introTl.fromTo(
        logo.querySelectorAll('.char'),
        { y: 100, opacity: 0, rotation: () => gsap.utils.random(-25, 25), scale: 0.6 },
        {
          y: 0,
          opacity: 1,
          rotation: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.06,
          ease: 'back.out(1.6)',
        }
      );

      introTl.fromTo(
        `.${styles.introCan}`,
        { scale: 0, opacity: 0, rotation: -90 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'back.out(1.7)',
        },
        0.2
      );
      introTl.to(`.${styles.introCan}`, { rotation: 360, duration: 2.5, ease: 'none' }, 0.8);

      const progressObj = { val: 0 };
      introTl.to(
        progressObj,
        {
          val: 100,
          duration: 2.2,
          ease: 'power2.inOut',
          onUpdate: () => {
            const p = Math.round(progressObj.val);
            if (progressBar) progressBar.style.width = p + '%';
            if (progressText) progressText.textContent = p + '%';
          },
        },
        0.4
      );

      introTl.fromTo(
        overlay,
        { clipPath: 'circle(150% at 50% 50%)' },
        { clipPath: 'circle(0% at 50% 50%)', duration: 1.0, ease: 'power3.inOut' },
        '-=0.2'
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
          </div>
        ))}
      </div>
      <div ref={logoRef} className={styles.introLogo}>
        <SplitText>MooLy</SplitText>
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

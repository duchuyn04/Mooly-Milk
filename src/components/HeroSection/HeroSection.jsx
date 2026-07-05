import { useRef, forwardRef, useImperativeHandle } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { flavors } from '../../data/flavors';
import { asset } from '../../utils/asset';
import { SplitText } from '../../utils/SplitText';
import { Button } from '../Button/Button';
import styles from './HeroSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const mainCan = flavors[4];
const leftCan = flavors[3];
const rightCan = flavors[5];

export const HeroSection = forwardRef(function HeroSection(
  { prefersReducedMotion, play },
  ref
) {
  const sectionRef = useRef(null);
  const copyRef = useRef(null);
  const clusterRef = useRef(null);
  const heroTlRef = useRef(null);
  const hasPlayedRef = useRef(false);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      heroTlRef.current = gsap.timeline({
        defaults: { ease: 'power3.out' },
        paused: true,
      });

      const heroTl = heroTlRef.current;
      const copy = copyRef.current;
      const cluster = clusterRef.current;

      if (cluster) {
        const canMain = cluster.querySelector(`.${styles.canMain}`);
        const canLeft = cluster.querySelector(`.${styles.canLeft}`);
        const canRight = cluster.querySelector(`.${styles.canRight}`);
        const floating = cluster.querySelectorAll(`.${styles.floating}`);

        heroTl.set(
          [canMain, canLeft, canRight, ...floating].filter(Boolean),
          { transformOrigin: '50% 60%' },
          0
        );

        if (canLeft) {
          heroTl.fromTo(
            canLeft,
            { x: -420, y: 90, opacity: 0, scale: 0.7, rotation: -38 },
            { x: 0, y: 0, opacity: 1, scale: 1, rotation: -13, duration: 1.05 },
            0.06
          );
        }

        if (canRight) {
          heroTl.fromTo(
            canRight,
            { x: 420, y: 70, opacity: 0, scale: 0.7, rotation: 38 },
            { x: 0, y: 0, opacity: 1, scale: 1, rotation: 14, duration: 1.05 },
            0.14
          );
        }

        if (canMain) {
          heroTl.fromTo(
            canMain,
            { y: 250, opacity: 0, scale: 0.45, rotation: -28 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: -8,
              duration: 1.15,
              ease: 'back.out(1.35)',
            },
            0.2
          );
        }

        if (floating.length) {
          heroTl.fromTo(
            floating,
            {
              x: (i) => [-220, 260, 300, -120, 160][i] || 0,
              y: (i) => [-150, -170, 150, -110, 130][i] || 0,
              opacity: 0,
              scale: 0.65,
              rotation: (i) => [-28, 24, 38, -18, 28][i] || 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 1,
              stagger: 0.05,
            },
            0.28
          );
        }

        const canImages = [canLeft, canMain, canRight]
          .filter(Boolean)
          .map((can) => can.querySelector('img'))
          .filter(Boolean);

        if (canImages.length) {
          gsap.to(canImages, {
            yPercent: (i) => [-10, -18, -8][i] || -10,
            xPercent: (i) => [-3, 0, 3][i] || 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.8,
            },
          });
        }

        const floatingImages = [...floating]
          .map((item) => item.querySelector('img'))
          .filter(Boolean);

        if (floatingImages.length) {
          gsap.to(floatingImages, {
            yPercent: (i) => [-26, -18, -30][i] || -22,
            xPercent: (i) => [8, -6, 10][i] || 0,
            rotate: (i) => [8, -6, 10][i] || 5,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1,
            },
          });
        }
      }

      if (copy) {
        const badge = copy.querySelector(`.${styles.heroBadge}`);
        const title = copy.querySelector(`.${styles.heroTitle}`);
        const sub = copy.querySelector(`.${styles.heroSub}`);
        const desc = copy.querySelector(`.${styles.heroDesc}`);
        const cta = copy.querySelector(`.${styles.heroCta}`);

        heroTl.fromTo(
          badge,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35 },
          0.25
        );

        if (title) {
          heroTl.fromTo(
            title.querySelectorAll('.char'),
            { y: '115%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.62,
              stagger: 0.012,
              ease: 'back.out(1.25)',
            },
            0.35
          );
        }

        heroTl.fromTo(
          sub,
          { y: 28, opacity: 0, rotation: -2 },
          { y: 0, opacity: 1, rotation: -2, duration: 0.55 },
          0.58
        );
        heroTl.fromTo(
          desc,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          0.92
        );
        heroTl.fromTo(
          cta,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45 },
          1.05
        );
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion] }
  );

  const playHero = () => {
    if (prefersReducedMotion) {
      const els = sectionRef.current?.querySelectorAll(
        `.${styles.heroBadge}, .${styles.heroTitle} .char, .${styles.heroSub}, .${styles.heroDesc}, .${styles.heroCta}, .${styles.can}, .${styles.floating}`
      );
      if (els) {
        gsap.set(els, { clearProps: 'all' });
        gsap.set(els, { opacity: 1, y: 0, x: 0, scale: 1, rotation: 0 });
      }
    } else {
      heroTlRef.current?.play();
    }
  };

  useImperativeHandle(ref, () => ({ playHero }));

  useGSAP(
    () => {
      if (play && !hasPlayedRef.current) {
        hasPlayedRef.current = true;
        playHero();
      }
    },
    { scope: sectionRef, dependencies: [play, prefersReducedMotion] }
  );

  return (
    <section id="hero" className={styles.hero} ref={sectionRef}>
      <div className={styles.heroInner}>
        <div ref={copyRef} className={styles.heroCopy}>
          <div className={styles.heroBadge}>Sữa tươi MooLy</div>
          <h1 className={`${styles.heroTitle} reveal-text`}>
            <span className="visually-hidden">TƯƠI MÁT ĐẬM VỊ</span>
            <SplitText>TƯƠI MÁT ĐẬM VỊ</SplitText>
          </h1>
          <p className={styles.heroSub}>SỮA + HƯƠNG VỊ</p>
          <p className={styles.heroDesc}>
            Mát lạnh, béo nhẹ, ngọt vừa cho bữa sáng, giờ nghỉ và những lúc thèm sữa.
          </p>
          <div className={styles.heroCta}>
            <Button href="#flavors" variant="primary" size="lg">
              THỬ MỘT HỘP
            </Button>
          </div>
        </div>

        <div className={styles.heroVisual} aria-hidden="true">
          <div ref={clusterRef} className={styles.productCluster}>
            <div className={`${styles.can} ${styles.canLeft}`}>
              <img className="can-svg" src={leftCan.img} alt="" width="1254" height="1254" loading="eager" />
            </div>
            <div className={`${styles.can} ${styles.canMain}`}>
              <img className="can-svg" src={mainCan.img} alt={`Hộp sữa MooLy vị ${mainCan.displayName}`} width="1254" height="1254" loading="eager" fetchpriority="high" />
            </div>
            <div className={`${styles.can} ${styles.canRight}`}>
              <img className="can-svg" src={rightCan.img} alt="" width="1254" height="1254" loading="eager" />
            </div>

            <div className={`${styles.floating} ${styles.objCan} ${styles.objCan1}`}>
              <img className="can-svg" src={asset('assets/orange-milk.png')} alt="" width="1254" height="1254" loading="lazy" />
            </div>
            <div className={`${styles.floating} ${styles.objCan} ${styles.objCan2}`}>
              <img className="can-svg" src={asset('assets/green-milk.png')} alt="" width="1254" height="1254" loading="lazy" />
            </div>
            <div className={`${styles.floating} ${styles.objCan} ${styles.objCan3}`}>
              <img className="can-svg" src={asset('assets/blue-milk.png')} alt="" width="1254" height="1254" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

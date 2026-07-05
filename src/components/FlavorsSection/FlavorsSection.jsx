import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { flavors } from '../../data/flavors';
import { Button } from '../Button/Button';
import styles from './FlavorsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const proofItems = [
  {
    value: '6 vị',
    label: 'Dâu tây, sô cô la, vani, matcha, cam và việt quất',
  },
  {
    value: '200 ml',
    label: 'Một hộp nhỏ gọn cho mỗi lần uống',
  },
  {
    value: 'Ít ngọt',
    label: 'Vị sữa rõ, nhẹ bụng, ngon nhất khi uống lạnh',
  },
  {
    value: 'Dễ chọn',
    label: 'Nhìn màu là biết vị, phù hợp mua nhanh',
  },
];

const featuredFlavor = flavors[4];

const shelfRows = [
  {
    flavor: flavors[3],
    name: 'Sô cô la',
    desc: 'Đậm vị, hợp bữa sáng',
    tag: 'Béo nhẹ',
  },
  {
    flavor: flavors[5],
    name: 'Vani',
    desc: 'Thơm mềm, dễ uống',
    tag: 'Êm vị',
  },
  {
    flavor: flavors[0],
    name: 'Matcha',
    desc: 'Thanh hơn cho buổi chiều',
    tag: 'Mới lạ',
  },
  {
    flavor: flavors[2],
    name: 'Việt quất',
    desc: 'Trái cây nhẹ, màu nổi bật',
    tag: 'Tươi',
  },
];

export function FlavorsSection({ prefersReducedMotion, isTouch, isNarrow }) {
  const sectionRef = useRef(null);
  const proofRef = useRef(null);
  const featureRef = useRef(null);
  const rowsRef = useRef(null);
  const spinRef = useRef(null);
  const isFirstRender = useRef(true);
  const [activeFlavor, setActiveFlavor] = useState(featuredFlavor);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (prefersReducedMotion || !spinRef.current) return;

    gsap.fromTo(
      spinRef.current,
      { rotation: -180, scale: 0.85 },
      {
        rotation: 0,
        scale: 1,
        duration: 0.65,
        ease: 'back.out(1.2)',
      }
    );
  }, [activeFlavor, prefersReducedMotion]);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const proofCards = gsap.utils.toArray(`.${styles.proofItem}`);
      if (proofCards.length) {
        gsap.fromTo(
          proofCards,
          { y: 34, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.72,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: proofRef.current,
              start: 'top 82%',
            },
          }
        );
      }

      const rows = gsap.utils.toArray(`.${styles.flavorRow}`);
      if (rows.length) {
        gsap.fromTo(
          rows,
          {
            x: isTouch || isNarrow ? 0 : 46,
            y: isTouch || isNarrow ? 26 : 0,
            opacity: 0,
            rotation: isTouch || isNarrow ? 0 : 1.5,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.72,
            stagger: 0.09,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rowsRef.current,
              start: 'top 78%',
            },
          }
        );
      }

      const productShot = featureRef.current?.querySelector(`.${styles.productShot}`);
      if (productShot && !isTouch && !isNarrow) {
        gsap.fromTo(
          productShot,
          { y: 80, opacity: 0, scale: 0.88, rotation: -14 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 6,
            duration: 1,
            ease: 'back.out(1.25)',
            scrollTrigger: {
              trigger: featureRef.current,
              start: 'top 76%',
            },
          }
        );

        gsap.to(productShot, {
          yPercent: -10,
          rotate: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: featureRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      }
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, isTouch, isNarrow] }
  );

  return (
    <section id="flavors" className={styles.flavors} ref={sectionRef}>
      <div className={styles.proof} ref={proofRef} aria-label="Dải tin cậy">
        <div className={styles.proofGrid}>
          {proofItems.map((item) => (
            <article className={styles.proofItem} key={item.value}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.shelf}>
        <div className={styles.shelfInner}>
          <div className={styles.sectionHead}>
            <div>
              <span className={styles.eyebrow}>Kệ sản phẩm</span>
              <h2>Chọn vị theo tâm trạng</h2>
            </div>
            <p>
              Kệ sản phẩm MooLy Milk đặt một vị nổi bật cạnh danh sách vị rõ ràng để người xem chọn nhanh hơn trên mọi kích thước màn hình.
            </p>
          </div>

          <div className={styles.productGrid}>
            <article className={styles.featureProduct} ref={featureRef}>
              <div className={styles.productCopy}>
                <span className={styles.eyebrow}>Vị đang nổi bật</span>
                <h3>{activeFlavor.displayName} mát lạnh</h3>
                <p>MooLy Milk vị {activeFlavor.displayName.toLowerCase()} có {activeFlavor.desc.toLowerCase()}</p>
                <Button href="#footer" variant="primary">
                  Chọn vị này
                </Button>
              </div>
              <div className={styles.productVisual} aria-hidden="true">
                <div ref={spinRef} className={styles.productShotWrap}>
                  <img
                    className={styles.productShot}
                    src={activeFlavor.img}
                    alt={`Hộp sữa MooLy vị ${activeFlavor.displayName}`}
                    width="1254"
                    height="1254"
                    loading="lazy"
                  />
                </div>
              </div>
            </article>

            <aside className={styles.flavorList} ref={rowsRef} aria-label="Danh sách vị sữa">
              {shelfRows.map((row) => (
                <article
                  className={styles.flavorRow}
                  key={row.name}
                  tabIndex={0}
                  role="button"
                  aria-label={`Chọn vị ${row.name}`}
                  onMouseEnter={() => setActiveFlavor(row.flavor)}
                  onMouseLeave={() => setActiveFlavor(featuredFlavor)}
                  onFocus={() => setActiveFlavor(row.flavor)}
                  onBlur={() => setActiveFlavor(featuredFlavor)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveFlavor(row.flavor);
                    }
                  }}
                >
                  <img src={row.flavor.img} alt={`Hộp sữa MooLy vị ${row.name}`} width="1254" height="1254" loading="lazy" />
                  <div>
                    <b>{row.name}</b>
                    <span>{row.desc}</span>
                  </div>
                  <em>{row.tag}</em>
                </article>
              ))}
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}

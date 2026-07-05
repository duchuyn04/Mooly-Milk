import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { asset } from '../../utils/asset';
import styles from './BenefitsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const moments = [
  {
    eyebrow: 'Buổi sáng',
    title: 'Bỏ túi\ntrước khi\nra cửa',
    text: 'Hộp nhỏ dễ mang theo cùng bữa sáng, sách vở hoặc túi làm việc.',
    imgs: [asset('assets/vani-milk.png')],
    alts: ['Hộp sữa MooLy vị vani'],
  },
  {
    eyebrow: 'Giờ nghỉ',
    title: 'Nạp\nlại nhẹ\nnhàng',
    text: 'Vị sữa mát giúp đoạn nghỉ giữa ngày có cảm giác dễ chịu hơn.',
    imgs: [asset('assets/pink-milk.png'), asset('assets/orange-milk.png')],
    alts: ['Hộp sữa MooLy vị dâu tây', 'Hộp sữa MooLy vị cam'],
  },
  {
    eyebrow: 'Buổi chiều',
    title: 'Đổi vị cho\nđỡ chán',
    text: 'Mỗi màu là một vị riêng, hợp những lúc muốn uống gì đó nhẹ mà vẫn vui.',
    imgs: [asset('assets/green-milk.png')],
    alts: ['Hộp sữa MooLy vị matcha'],
  },
];

const qualityItems = [
  {
    number: '01',
    title: 'Sữa tươi dễ uống',
    text: 'Diễn giải rõ về nền sữa, vị béo và độ ngọt để người mua không phải đoán.',
  },
  {
    number: '02',
    title: 'Hương vị dễ nhận biết',
    text: 'Mỗi màu gắn với một vị để người dùng chọn nhanh ngay từ kệ sản phẩm.',
  },
  {
    number: '03',
    title: 'Đóng gói tiện mang theo',
    text: 'Nhấn vào kích thước, ống hút và thói quen dùng hằng ngày.',
  },
];

export function BenefitsSection({ prefersReducedMotion, isTouch, isNarrow }) {
  const sectionRef = useRef(null);
  const storyRef = useRef(null);
  const storyHeadRef = useRef(null);
  const wipeRef = useRef(null);
  const momentsRef = useRef(null);
  const momentsHeadRef = useRef(null);
  const qualityRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      if (wipeRef.current) {
        gsap.fromTo(
          wipeRef.current,
          { scaleX: 0, opacity: 0.08 },
          {
            scaleX: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: storyRef.current,
              start: 'top 74%',
              end: 'bottom 32%',
              scrub: 0.8,
            },
          }
        );
      }

      const storyPanels = gsap.utils.toArray(`.${styles.storyPanel}`);
      if (storyPanels.length) {
        gsap.fromTo(
          storyPanels,
          { y: 84, opacity: 0, rotation: (i) => [-2, 1.4][i] || 0 },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: storyRef.current,
              start: 'top 68%',
            },
          }
        );
      }

      const momentCards = gsap.utils.toArray(`.${styles.momentCard}`);
      if (momentCards.length) {
        gsap.fromTo(
          momentCards,
          {
            y: (i) => (isTouch || isNarrow ? 44 : 110 - i * 28),
            opacity: 0,
            rotation: (i) => (isTouch || isNarrow ? 0 : [-4, 3, -2][i] || 0),
            scale: (i) => (isTouch || isNarrow ? 1 : 1 - i * 0.035),
          },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.13,
            ease: 'back.out(1.18)',
            scrollTrigger: {
              trigger: momentsRef.current,
              start: 'top 70%',
            },
          }
        );
      }

      const qualityRows = gsap.utils.toArray(`.${styles.qualityItem}`);
      if (qualityRows.length) {
        gsap.fromTo(
          qualityRows,
          { x: isTouch || isNarrow ? 0 : 54, y: isTouch || isNarrow ? 24 : 0, opacity: 0 },
          {
            x: 0,
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: qualityRef.current,
              start: 'top 72%',
            },
          }
        );
      }

      // Story section header reveal
      if (storyHeadRef.current) {
        const storyEyebrow = storyHeadRef.current.querySelector(`.${styles.eyebrow}`);
        const storyTitle = storyHeadRef.current.querySelector('h2');
        const storyIntro = storyHeadRef.current.querySelector('p');

        const storyHeadTl = gsap.timeline({
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top 72%',
          },
        });

        if (storyEyebrow) {
          storyHeadTl.fromTo(
            storyEyebrow,
            { y: 18, opacity: 0, letterSpacing: '0.04em' },
            {
              y: 0,
              opacity: 1,
              letterSpacing: '0.08em',
              duration: 0.5,
              ease: 'power3.out',
            },
            0
          );
        }

        if (storyTitle) {
          storyHeadTl.fromTo(
            storyTitle,
            { y: '110%', opacity: 0, rotation: isTouch || isNarrow ? 0 : 3 },
            {
              y: '0%',
              opacity: 1,
              rotation: 0,
              duration: 0.7,
              ease: 'power3.out',
            },
            0.05
          );
        }

        if (storyIntro) {
          storyHeadTl.fromTo(
            storyIntro,
            { y: isTouch || isNarrow ? 14 : 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
            },
            0.25
          );
        }
      }

      // Story panel inner content
      storyPanels.forEach((panel) => {
        const panelH3 = panel.querySelector('h3');
        const panelP = panel.querySelector('p');
        const panelLis = panel.querySelectorAll('li');

        const panelTl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            start: 'top 76%',
          },
        });

        if (panelH3) {
          panelTl.fromTo(
            panelH3,
            {
              y: isTouch || isNarrow ? 18 : 30,
              opacity: 0,
              rotation: isTouch || isNarrow ? 0 : -1.5,
            },
            {
              y: 0,
              opacity: 1,
              rotation: 0,
              duration: 0.55,
              ease: 'power3.out',
            },
            0
          );
        }

        if (panelP) {
          panelTl.fromTo(
            panelP,
            { y: isTouch || isNarrow ? 12 : 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power3.out',
            },
            0.1
          );
        }

        if (panelLis.length) {
          panelTl.fromTo(
            panelLis,
            {
              x: isTouch || isNarrow ? 0 : -16,
              y: isTouch || isNarrow ? 10 : 14,
              opacity: 0,
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.45,
              stagger: 0.08,
              ease: 'power3.out',
            },
            0.15
          );
        }
      });

      // Stacked cartons pop-in
      const stackedCartons = sectionRef.current.querySelector(`.${styles.stackedCartons}`);
      if (stackedCartons) {
        const cartonImgs = stackedCartons.querySelectorAll('img');
        if (cartonImgs.length) {
          gsap.fromTo(
            cartonImgs,
            {
              scale: isTouch || isNarrow ? 1 : 0.7,
              opacity: 0,
              rotation: isTouch || isNarrow ? 0 : (i) => [-18, 22][i] || 0,
              y: isTouch || isNarrow ? '1.4rem' : '3rem',
            },
            {
              scale: 1,
              opacity: 1,
              rotation: (i) => [-7, 8][i] || 0,
              y: (i) => ['0.9rem', '-1rem'][i] || '0rem',
              duration: 0.85,
              stagger: 0.12,
              ease: 'back.out(1.35)',
              scrollTrigger: {
                trigger: stackedCartons.closest(`.${styles.storyPanelLarge}`),
                start: 'top 74%',
              },
            }
          );
        }
      }

      // Moments section header reveal
      if (momentsHeadRef.current) {
        const momentsEyebrow = momentsHeadRef.current.querySelector(`.${styles.eyebrow}`);
        const momentsTitle = momentsHeadRef.current.querySelector('h2');
        const momentsIntro = momentsHeadRef.current.querySelector('p');

        const momentsHeadTl = gsap.timeline({
          scrollTrigger: {
            trigger: momentsRef.current,
            start: 'top 74%',
          },
        });

        if (momentsEyebrow) {
          momentsHeadTl.fromTo(
            momentsEyebrow,
            { y: 18, opacity: 0, letterSpacing: '0.04em' },
            {
              y: 0,
              opacity: 1,
              letterSpacing: '0.08em',
              duration: 0.5,
              ease: 'power3.out',
            },
            0
          );
        }

        if (momentsTitle) {
          momentsHeadTl.fromTo(
            momentsTitle,
            { y: '110%', opacity: 0, rotation: isTouch || isNarrow ? 0 : 3 },
            {
              y: '0%',
              opacity: 1,
              rotation: 0,
              duration: 0.7,
              ease: 'power3.out',
            },
            0.05
          );
        }

        if (momentsIntro) {
          momentsHeadTl.fromTo(
            momentsIntro,
            { y: isTouch || isNarrow ? 14 : 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
            },
            0.25
          );
        }
      }

      // Moment card inner content
      momentCards.forEach((card) => {
        const cardEyebrow = card.querySelector(`.${styles.eyebrow}`);
        const cardTitleLines = card.querySelectorAll(`.${styles.titleLine}`);
        const cardP = card.querySelector('p');
        const cardVisual = card.querySelector(`.${styles.momentVisual}`);
        const cardImgs = cardVisual ? cardVisual.querySelectorAll('img') : [];

        const cardTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 76%',
          },
        });

        if (cardEyebrow) {
          cardTl.fromTo(
            cardEyebrow,
            { y: 12, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.45,
              ease: 'power3.out',
            },
            0
          );
        }

        if (cardTitleLines.length) {
          cardTl.fromTo(
            cardTitleLines,
            { y: '105%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              duration: 0.55,
              stagger: 0.06,
              ease: 'power3.out',
            },
            0.05
          );
        }

        if (cardP) {
          cardTl.fromTo(
            cardP,
            { y: isTouch || isNarrow ? 10 : 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power3.out',
            },
            0.15
          );
        }

        if (cardImgs.length) {
          cardTl.fromTo(
            cardImgs,
            {
              scale: isTouch || isNarrow ? 1 : 0.65,
              opacity: 0,
              rotation: isTouch || isNarrow ? 0 : (i) => [-22, 26][i] || 0,
              y: isTouch || isNarrow ? '1.4rem' : '3rem',
            },
            {
              scale: 1,
              opacity: 1,
              rotation: (i) => [-7, 8][i] || 0,
              y: (i) => ['0rem', '0.5rem'][i] || '0rem',
              duration: 0.8,
              stagger: 0.1,
              ease: 'back.out(1.35)',
            },
            0.1
          );
        }
      });
    },
    { scope: sectionRef, dependencies: [prefersReducedMotion, isTouch, isNarrow] }
  );

  return (
    <section id="benefits" className={styles.benefits} ref={sectionRef}>
      <div className={styles.story} ref={storyRef}>
        <div className={styles.storyBg} aria-hidden="true"></div>
        <div className={styles.creamWipe} ref={wipeRef} aria-hidden="true"></div>
        <div className={styles.frame}>
          <div className={`${styles.sectionHead} ${styles.sectionHeadDark}`} ref={storyHeadRef}>
            <div>
              <span className={styles.eyebrow}>Lý do tin</span>
              <h2 className={styles.sectionTitle}>
                Không chỉ là hộp sữa dễ thương
              </h2>
            </div>
            <p>
              Phần lợi ích được kể như một câu chuyện thương hiệu, có nhịp đọc rõ hơn và bớt cảm giác ba card mặc định.
            </p>
          </div>

          <div className={styles.storyGrid}>
            <article className={styles.storyPanel}>
              <h3>Vị sữa rõ</h3>
              <p>
                Sữa có độ béo nhẹ, ngọt vừa, đủ thơm để trẻ thích và đủ gọn để phụ huynh chọn nhanh.
              </p>
              <ul>
                <li>Uống lạnh ngon hơn</li>
                <li>Hộp nhỏ dễ mang theo</li>
                <li>Màu vị nhận diện nhanh</li>
              </ul>
            </article>

            <article className={`${styles.storyPanel} ${styles.storyPanelLarge}`}>
              <div>
                <h3>Thiết kế để được cầm lên</h3>
                <p>
                  Khu vực này giúp sản phẩm có đời sống hơn, như đang nằm trong tủ lạnh, túi xách hoặc trên bàn ăn hằng ngày.
                </p>
              </div>
              <div className={styles.stackedCartons} aria-hidden="true">
                <img src={asset('assets/orange-milk.png')} alt="Hộp sữa MooLy vị cam" width="1254" height="1254" loading="lazy" />
                <img src={asset('assets/blue-milk.png')} alt="Hộp sữa MooLy vị việt quất" width="1254" height="1254" loading="lazy" />
              </div>
            </article>
          </div>
        </div>
      </div>

      <div className={styles.moments} ref={momentsRef}>
        <div className={styles.frame}>
          <div className={styles.sectionHead} ref={momentsHeadRef}>
            <div>
              <span className={styles.eyebrow}>Ngữ cảnh dùng</span>
              <h2 className={styles.sectionTitle}>
                Uống lúc nào cũng hợp
              </h2>
            </div>
            <p>
              Thêm các tình huống dùng thật để trang không chỉ nói về vị, mà còn cho người xem thấy sản phẩm xuất hiện trong ngày của họ.
            </p>
          </div>

          <div className={styles.momentGrid}>
            {moments.map((moment) => (
              <article className={styles.momentCard} key={moment.title}>
                <div>
                  <span className={styles.eyebrow}>{moment.eyebrow}</span>
                  <h3 className={styles.momentTitle}>
                    {moment.title.split('\n').map((line, i, arr) => (
                      <span key={i} className={styles.titleLine}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </h3>
                </div>
                <div className={styles.momentVisual} aria-hidden="true">
                  {moment.imgs.map((img, idx) => (
                    <div className={styles.milkWrap} key={img}>
                      <img src={img} alt={moment.alts[idx] || ''} width="1254" height="1254" loading="lazy" />
                    </div>
                  ))}
                </div>
                <p>{moment.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.quality} ref={qualityRef}>
        <div className={styles.frame}>
          <div className={styles.qualityGrid}>
            <article className={styles.qualityPanel}>
              <span className={styles.eyebrow}>Chất lượng</span>
              <h2>Rõ ràng ngay trên trang</h2>
              <p>
                Đưa thông tin quan trọng vào một vùng chắc chắn hơn để người mua hiểu nhanh vì sao nên chọn MooLy.
              </p>
            </article>

            <div className={styles.qualityList}>
              {qualityItems.map((item) => (
                <article className={styles.qualityItem} key={item.number}>
                  <strong>{item.number}</strong>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

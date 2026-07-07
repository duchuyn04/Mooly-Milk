import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Button } from '../Button/Button';
import { asset } from '../../utils/asset';
import styles from './Footer.module.css';

gsap.registerPlugin(ScrollTrigger);

export function Footer() {
  const footerRef = useRef(null);

  useGSAP(
    () => {
      const cans = footerRef.current?.querySelectorAll(`.${styles.footerCan}`);
      if (!cans?.length) return;

      gsap.fromTo(
        cans,
        {
          x: (i) => [-180, 0, 180][i] || 0,
          y: (i) => [90, 140, 80][i] || 90,
          opacity: 0,
          scale: 0.82,
          rotation: (i) => [-18, 8, 20][i] || 0,
        },
        {
          x: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          rotation: (i) => [-9, 4, 10][i] || 0,
          duration: 1.1,
          stagger: 0.08,
          ease: 'back.out(1.35)',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 76%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    },
    { scope: footerRef }
  );

  return (
    <footer id="footer" className={styles.footer} ref={footerRef}>
      <div className={styles.footerMarquee} aria-hidden="true">
        <span>MooLy MooLy MooLy MooLy MooLy MooLy</span>
      </div>

      <div className={styles.footerInner}>
        <section className={styles.footerPanel} aria-label="Kêu gọi mua hàng">
          <div className={styles.footerCopy}>
            <h2>Chọn vị đầu tiên của bạn</h2>
            <p>
              CTA cuối trang gom lại lựa chọn chính để người xem quay về kệ sản phẩm hoặc xem thêm lý do chọn MooLy.
            </p>
            <div className={styles.buttonRow}>
              <Button href="#flavors" variant="primary" size="lg">
                Xem các vị
              </Button>
              <Button href="#benefits" variant="secondary">
                Xem lý do chọn
              </Button>
            </div>
          </div>

          <div className={styles.footerProducts} aria-hidden="true">
            <img className={styles.footerCan} src={asset('assets/pink-milk.png')} alt="" width="1254" height="1254" loading="lazy" />
            <img className={styles.footerCan} src={asset('assets/vani-milk.png')} alt="" width="1254" height="1254" loading="lazy" />
            <img className={styles.footerCan} src={asset('assets/green-milk.png')} alt="" width="1254" height="1254" loading="lazy" />
          </div>
        </section>

        <div className={styles.footerBottom}>
          <span className={styles.logo}>MooLy</span>
          <nav className={styles.footerLinks} aria-label="Liên kết cuối trang">
            <a href="#flavors">Vị sữa</a>
            <a href="#benefits">Lý do chọn</a>
            <a href="/Mooly-Milk/mooly-milk/">MooLy Milk là gì</a>
            <a href="#footer">Mua hàng</a>
          </nav>
          <small>© 2026 MooLy.</small>
        </div>
      </div>
    </footer>
  );
}

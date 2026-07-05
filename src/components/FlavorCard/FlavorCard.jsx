import { useRef } from 'react';
import styles from './FlavorCard.module.css';

export function FlavorCard({ flavor, index }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
  };

  return (
    <div
      ref={cardRef}
      className={styles.flavorCard}
      style={{ background: flavor.bg }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.flavorCan}>
        <img
          className="can-svg"
          src={flavor.img}
          alt={`Hộp sữa ${flavor.name}`}
          loading="lazy"
        />
      </div>
      <div className={styles.flavorMeta}>
        <h3 style={{ color: flavor.textColor || '#FFF8F0' }}>{flavor.name}</h3>
        <p style={{ color: flavor.textColor || '#FFF8F0' }}>{flavor.sub}</p>
      </div>
    </div>
  );
}

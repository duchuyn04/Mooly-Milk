import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Ingredient, ingredientTypes } from '../Ingredients/Ingredients';
import styles from './FloatingIngredients.module.css';

const ingredientCount = 10;

function overlapsTextZone(x, y) {
  // Avoid headline area
  const inHeadline = x > 28 && x < 72 && y > 22 && y < 58;
  // Avoid CTA area
  const inCta = x > 32 && x < 68 && y > 62 && y < 92;
  return inHeadline || inCta;
}

function generatePosition(attempt = 0) {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  if (overlapsTextZone(x, y) && attempt < 20) {
    return generatePosition(attempt + 1);
  }
  return { x, y };
}

export function FloatingIngredients({ prefersReducedMotion }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(`.${styles.item}`);
    items.forEach((item) => {
      const duration = gsap.utils.random(3, 6);
      const yMove = gsap.utils.random(10, 30);
      const rotation = gsap.utils.random(8, 25);
      const delay = gsap.utils.random(0, 2);

      gsap.to(item, {
        y: `+=${yMove}`,
        rotation: `+=${rotation}`,
        duration,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay,
      });
    });

    return () => {
      items.forEach((item) => gsap.killTweensOf(item));
    };
  }, [prefersReducedMotion]);

  const ingredients = [];
  for (let i = 0; i < ingredientCount; i++) {
    const type = ingredientTypes[i % ingredientTypes.length];
    const size = 28 + Math.random() * 44;
    const { x, y } = generatePosition();
    const rotation = Math.random() * 360;
    const zIndex = Math.random() > 0.5 ? 3 : 1;

    ingredients.push(
      <div
        key={i}
        className={styles.item}
        style={{
          left: `${x}%`,
          top: `${y}%`,
          transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
          zIndex,
        }}
      >
        <Ingredient type={type} size={size} />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.floatingIngredients} aria-hidden="true">
      {ingredients}
    </div>
  );
}

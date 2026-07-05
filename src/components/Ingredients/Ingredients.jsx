import styles from './Ingredients.module.css';

const ingredientPaths = {
  strawberry: {
    color: '#E85D5D',
    viewBox: '0 0 60 70',
    path: (
      <>
        <path
          d="M30 8 C20 8 8 18 8 35 C8 52 20 62 30 62 C40 62 52 52 52 35 C52 18 40 8 30 8 Z"
          fill="#E85D5D"
        />
        <path
          d="M30 8 C25 2 15 2 12 8 C18 10 24 10 30 8 Z"
          fill="#6B8E23"
        />
        <path
          d="M30 8 C35 2 45 2 48 8 C42 10 36 10 30 8 Z"
          fill="#6B8E23"
        />
        <circle cx="22" cy="32" r="2" fill="#F4A0A0" opacity="0.6" />
        <circle cx="38" cy="28" r="2" fill="#F4A0A0" opacity="0.6" />
        <circle cx="32" cy="45" r="2" fill="#F4A0A0" opacity="0.6" />
      </>
    ),
  },
  orange: {
    color: '#F5A76A',
    viewBox: '0 0 60 60',
    path: (
      <>
        <circle cx="30" cy="30" r="26" fill="#F5A76A" />
        <circle cx="30" cy="30" r="23" fill="#F5A76A" stroke="#E8944A" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M30 4 L30 8" stroke="#6B8E23" strokeWidth="3" strokeLinecap="round" />
        <path d="M30 4 L34 10" stroke="#6B8E23" strokeWidth="2" strokeLinecap="round" />
      </>
    ),
  },
  matcha: {
    color: '#A8C66C',
    viewBox: '0 0 60 60',
    path: (
      <>
        <ellipse cx="30" cy="30" rx="24" ry="20" fill="#A8C66C" />
        <path d="M12 30 C12 30 22 18 30 18 C38 18 48 30 48 30" fill="none" stroke="#7FA14C" strokeWidth="2" />
        <path d="M12 30 C12 30 22 42 30 42 C38 42 48 30 48 30" fill="none" stroke="#7FA14C" strokeWidth="2" />
      </>
    ),
  },
  blueberry: {
    color: '#7FAED8',
    viewBox: '0 0 50 50',
    path: (
      <>
        <circle cx="25" cy="25" r="20" fill="#7FAED8" />
        <circle cx="20" cy="20" r="4" fill="#5A8AB8" opacity="0.5" />
        <circle cx="32" cy="22" r="3" fill="#5A8AB8" opacity="0.5" />
        <circle cx="25" cy="33" r="3" fill="#5A8AB8" opacity="0.5" />
      </>
    ),
  },
  chocolate: {
    color: '#A06845',
    viewBox: '0 0 60 50',
    path: (
      <>
        <rect x="5" y="10" width="50" height="30" rx="4" fill="#A06845" />
        <rect x="10" y="15" width="18" height="20" rx="2" fill="#8A5A3D" />
        <rect x="32" y="15" width="18" height="20" rx="2" fill="#8A5A3D" />
      </>
    ),
  },
  vanilla: {
    color: '#D4B87A',
    viewBox: '0 0 60 60',
    path: (
      <>
        <ellipse cx="30" cy="30" rx="22" ry="18" fill="#F8EEC8" />
        <path d="M14 30 C14 30 22 16 30 16 C38 16 46 30 46 30" fill="none" stroke="#D4B87A" strokeWidth="2" />
        <path d="M14 30 C14 30 22 44 30 44 C38 44 46 30 46 30" fill="none" stroke="#D4B87A" strokeWidth="2" />
        <circle cx="30" cy="16" r="3" fill="#D4B87A" />
        <circle cx="30" cy="44" r="3" fill="#D4B87A" />
      </>
    ),
  },
};

export function Ingredient({ type, size = 40, style = {} }) {
  const ingredient = ingredientPaths[type];
  if (!ingredient) return null;

  return (
    <div
      className={styles.ingredient}
      style={{ width: size, height: size, ...style }}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox={ingredient.viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        {ingredient.path}
      </svg>
    </div>
  );
}

export const ingredientTypes = Object.keys(ingredientPaths);

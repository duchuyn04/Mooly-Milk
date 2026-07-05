import styles from './MilkDrip.module.css';

export function MilkDrip({ variant = 'milk' }) {
  const isMilk = variant === 'milk';

  return (
    <div className={`${styles.milkDrip} ${isMilk ? styles.milk : styles.cream}`} aria-hidden="true">
      <svg
        className={styles.dripSvg}
        viewBox={isMilk ? '0 0 1440 160' : '0 0 1440 120'}
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id={isMilk ? 'milkWave' : 'milkWave2'}
            x="0"
            y="0"
            width="1440"
            height={isMilk ? '160' : '120'}
            patternUnits="userSpaceOnUse"
          >
            {isMilk ? (
              <>
                <path
                  d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,160 L0,160 Z"
                  fill="var(--milk)"
                />
                <circle cx="360" cy="115" r="9" fill="var(--milk)" />
                <circle cx="720" cy="100" r="12" fill="var(--milk)" />
                <circle cx="1080" cy="110" r="8" fill="var(--milk)" />
              </>
            ) : (
              <path
                d="M0,50 C240,0 480,110 720,50 C960,0 1200,110 1440,50 L1440,120 L0,120 Z"
                fill="var(--cream-dark)"
              />
            )}
          </pattern>
        </defs>
        <rect className={styles.waveRect} width="200%" height={isMilk ? '160' : '120'} fill={`url(#${isMilk ? 'milkWave' : 'milkWave2'})`} />
      </svg>
    </div>
  );
}

import styles from './Nav.module.css';

export function Nav() {
  return (
    <nav className={styles.nav} aria-label="Điều hướng chính">
      <a href="#hero" className={styles.logo}>
        <svg
          className={styles.logoIcon}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M20 4C12 4 6 10 6 18C6 28 14 36 20 36C26 36 34 28 34 18C34 10 28 4 20 4Z"
            fill="var(--caramel)"
          />
          <circle cx="14" cy="16" r="2.5" fill="var(--milk)"/>
          <circle cx="26" cy="16" r="2.5" fill="var(--milk)"/>
          <path
            d="M14 26C16 28 24 28 26 26"
            stroke="var(--milk)"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="20" cy="32" r="2" fill="var(--milk)"/>
        </svg>
        MooLy
      </a>
      <div className={styles.navLinks}>
        <a href="#flavors">Sản phẩm</a>
        <a href="#benefits">Dinh dưỡng</a>
        <a href="#footer">Liên hệ</a>
      </div>
    </nav>
  );
}

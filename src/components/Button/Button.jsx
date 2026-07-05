import styles from './Button.module.css';

export function Button({
  variant = 'primary',
  size,
  href,
  children,
  className = '',
  ...props
}) {
  const classes = [
    styles.btn,
    variant === 'primary' && styles.primary,
    variant === 'secondary' && styles.secondary,
    variant === 'light' && styles.light,
    size === 'lg' && styles.lg,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}

export function ButtonArrow({ children }) {
  return <span className={styles.btnArrow} aria-hidden="true">{children}</span>;
}

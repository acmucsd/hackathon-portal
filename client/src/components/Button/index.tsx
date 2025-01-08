import styles from './style.module.scss';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

interface ButtonProps {
  /**
   * Primary buttons are filled blue, secondary buttons are filled white, and
   * tertiary buttons are outlined blue.
   *
   * Default: `primary`.
   */
  variant?: 'primary' | 'secondary' | 'tertiary';
  href?: string;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  variant = 'primary',
  href,
  onClick,
  className = '',
  children,
}: PropsWithChildren<ButtonProps>) => {
  const props = {
    className: `${styles.button} ${className}`,
    'data-variant': variant,
    onClick,
    children,
  };
  return href ? <Link href={href} {...props} /> : <button type="submit" {...props} />;
};

export default Button;

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
  /** Default: `button`. Doesn't do anything if `href` is set. */
  type?: 'button' | 'submit';
  formAction?: (formData: FormData) => void;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const Button = ({
  variant = 'primary',
  type = 'button',
  formAction,
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
  return href ? (
    <Link href={href} {...props} />
  ) : (
    <button type={type} formAction={formAction} {...props} />
  );
};

export default Button;

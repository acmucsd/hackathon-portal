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
  for?: string;
  submit?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  variant = 'primary',
  href,
  for: htmlFor,
  submit = false,
  onClick,
  disabled,
  className = '',
  children,
}: PropsWithChildren<ButtonProps>) => {
  const props = {
    className: `${styles.button} ${className}`,
    'data-variant': variant,
    onClick,
    disabled,
    children,
  };
  return htmlFor ? (
    <label htmlFor={htmlFor} {...props} />
  ) : href ? (
    <Link href={href} {...props} />
  ) : (
    <button type={submit ? 'submit' : 'button'} {...props} />
  );
};

export default Button;

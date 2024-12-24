import styles from './style.module.scss';
import Link, { LinkProps } from 'next/link';
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
}

const Button = ({ variant, href, onClick, children }: PropsWithChildren<ButtonProps>) => {
  const props = { className: styles.button, 'data-variant': variant, onClick, children };
  return href ? <Link href={href} {...props} /> : <button type="button" {...props} />;
};

export default Button;

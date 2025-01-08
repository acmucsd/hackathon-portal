import styles from './style.module.scss';
import { PropsWithChildren } from 'react';

interface CardProps {
  gap: 0 | 1 | 1.5 | 2;
  className?: string;
  formAction?: (formData: FormData) => void;
}

const Card = ({ gap, className = '', formAction, children }: PropsWithChildren<CardProps>) => {
  return formAction ? (
    <form
      className={`${styles.container} ${className}`}
      style={{ gap: `${gap}rem` }}
      action={formAction}
    >
      {children}
    </form>
  ) : (
    <div className={`${styles.container} ${className}`} style={{ gap: `${gap}rem` }}>
      {children}
    </div>
  );
};

export default Card;

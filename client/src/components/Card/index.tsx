import styles from './style.module.scss';
import { PropsWithChildren, SyntheticEvent } from 'react';

interface CardProps {
  gap: 0 | 1 | 1.5 | 2;
  className?: string;
  onSubmit?: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
}

const Card = ({ gap, className = '', onSubmit, children }: PropsWithChildren<CardProps>) => {
  return onSubmit ? (
    <form
      className={`${styles.container} ${className}`}
      style={{ gap: `${gap}rem` }}
      onSubmit={onSubmit}
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

import styles from './style.module.scss';
import { PropsWithChildren } from 'react';

interface CardProps {
  gap: 0 | 1 | 1.5 | 2;
  className?: string;
}

const Card = ({ gap, className = '', children }: PropsWithChildren<CardProps>) => {
  return (
    <div className={`${styles.container} ${className}`} style={{ gap: `${gap}rem` }}>
      {children}
    </div>
  );
};

export default Card;

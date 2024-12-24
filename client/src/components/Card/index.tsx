import styles from './style.module.scss';
import { PropsWithChildren } from 'react';

interface CardProps {
  gap: 0 | 1 | 1.5 | 2;
}

const Card = ({ gap, children }: PropsWithChildren<CardProps>) => {
  return (
    <div className={styles.container} style={{ gap: `${gap}rem` }}>
      {children}
    </div>
  );
};

export default Card;

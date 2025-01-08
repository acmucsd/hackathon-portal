import styles from './style.module.scss';
import { MutableRefObject, PropsWithChildren, SyntheticEvent } from 'react';

interface CardProps {
  gap: 0 | 1 | 1.5 | 2 | 2.5;
  className?: string;
  onSubmit?: (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => void;
  formRef?: MutableRefObject<HTMLFormElement | null>;
}

const Card = ({
  gap,
  className = '',
  onSubmit,
  formRef,
  children,
}: PropsWithChildren<CardProps>) => {
  return onSubmit ? (
    <form
      className={`${styles.container} ${className}`}
      style={{ gap: `${gap}rem` }}
      onSubmit={onSubmit}
      ref={formRef}
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

import styles from './style.module.scss';
import { PropsWithChildren } from 'react';

interface HeadingProps {
  centered?: boolean;
}

/**
 * Unlike `Typography`, the text size for the heading shrinks on mobile.
 */
const Heading = ({ centered, children }: PropsWithChildren<HeadingProps>) => {
  return <h1 className={`${styles.heading} ${centered ? styles.centered : ''}`}>{children}</h1>;
};

export default Heading;

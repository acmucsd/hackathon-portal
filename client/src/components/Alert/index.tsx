import styles from './style.module.scss';
import Error from '../../../public/assets/error.svg';
import { PropsWithChildren } from 'react';

interface AlertProps {
  marginBottom: 0 | 1 | 1.5 | 2;
}

const Alert = ({ marginBottom, children }: PropsWithChildren<AlertProps>) => {
  return (
    <div className={styles.alert} style={{ marginBottom: `${marginBottom}rem` }}>
      <div className='error'>
        <Error />
      </div>

      {children}
    </div>
  );
};

export default Alert;

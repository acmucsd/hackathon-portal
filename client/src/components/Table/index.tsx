import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

const Table = ({ children, className }: PropsWithChildren<TableProps>) => {
  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.table} ${className}`}>{children}</table>
    </div>
  );
};

export default Table;

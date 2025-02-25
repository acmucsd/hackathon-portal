import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

const TableRow = ({ children, className }: PropsWithChildren<TableRowProps>) => {
  return <tr className={`${styles.rowContainer} ${className}`}>{children}</tr>;
};

export default TableRow;

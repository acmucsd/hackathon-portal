import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  type?: 'th' | 'td';
}

const TableCell = ({ children, className, type = 'td' }: PropsWithChildren<TableCellProps>) => {
  const Component = type;
  return <Component className={`${styles.cellContainer} ${className}`}>{children}</Component>;
};

export default TableCell;

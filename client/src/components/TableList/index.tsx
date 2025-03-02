import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TableListProps {
  children: React.ReactNode;
  className?: string;
}

const TableList = ({ children, className }: PropsWithChildren<TableListProps>) => {
  return <div className={`${styles.tableList} ${className}`}>{children}</div>;
};

export default TableList;

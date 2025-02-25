import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

const TableHeader = ({ children, className }: PropsWithChildren<TableHeaderProps>) => {
  return <tr className={`${styles.rowContainer} ${className}`}>{children}</tr>;
};

export default TableHeader;

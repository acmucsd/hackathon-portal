import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  type?: 'th' | 'td';
  colSpan?: number;
}

const TableCell = ({
  children,
  className,
  type = 'td',
  colSpan,
}: PropsWithChildren<TableCellProps>) => {
  const Component = type;
  return (
    <Component colSpan={colSpan} className={`${styles.cellContainer} ${className}`}>
      {children}
    </Component>
  );
};

export default TableCell;

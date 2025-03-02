import Button from '@/components/Button';
import Typography from '@/components/Typography';
import styles from './style.module.scss';

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPrevious,
  onNext,
}: PaginationProps) => {
  const startIndex = currentPage * itemsPerPage + 1;
  const endIndex = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  return (
    <div className={styles.pagination}>
      <Typography variant="label/small">
        {`${startIndex} - ${endIndex} of ${totalItems}`}
      </Typography>
      <Button className={styles.pageButton} onClick={onPrevious} disabled={currentPage <= 0}>
        {'<'}
      </Button>
      <Button className={styles.pageButton} onClick={onNext} disabled={endIndex >= totalItems}>
        {'>'}
      </Button>
    </div>
  );
};

export default Pagination;

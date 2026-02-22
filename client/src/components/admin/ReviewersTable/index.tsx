'use client';
import { useState } from 'react';
import Typography from '@/components/Typography';
import Search from '@/components/Search';
import Table from '@/components/Table';
import TableHeader from '@/components/TableHeader';
import TableCell from '@/components/TableCell';
import TableRow from '@/components/TableRow';
import Button from '@/components/Button';
import styles from './style.module.scss';

interface ReviewerStats {
  completed: { count: number; total: number };
  accepted: { count: number; total: number };
  rejected: { count: number; total: number };
  waitlisted: { count: number; total: number };
}

interface Reviewer {
  id: string;
  name: string;
  stats: ReviewerStats;
}

// HARD CODED FOR NOW
const hardCodedReviewers: Reviewer[] = [
  {
    id: '1',
    name: 'Sophia Grace',
    stats: {
      completed: { count: 35, total: 40 },
      accepted: { count: 15, total: 40 },
      rejected: { count: 5, total: 40 },
      waitlisted: { count: 10, total: 40 },
    },
  },
  {
    id: '2',
    name: 'Liam James',
    stats: {
      completed: { count: 20, total: 40 },
      accepted: { count: 10, total: 40 },
      rejected: { count: 5, total: 40 },
      waitlisted: { count: 5, total: 40 },
    },
  },
  {
    id: '3',
    name: 'Olivia Rose',
    stats: {
      completed: { count: 10, total: 40 },
      accepted: { count: 5, total: 40 },
      rejected: { count: 3, total: 40 },
      waitlisted: { count: 2, total: 40 },
    },
  },
  {
    id: '4',
    name: 'Noah Alexander',
    stats: {
      completed: { count: 15, total: 40 },
      accepted: { count: 10, total: 40 },
      rejected: { count: 3, total: 40 },
      waitlisted: { count: 2, total: 40 },
    },
  },
  {
    id: '5',
    name: 'Ava Marie',
    stats: {
      completed: { count: 25, total: 40 },
      accepted: { count: 10, total: 40 },
      rejected: { count: 5, total: 40 },
      waitlisted: { count: 10, total: 40 },
    },
  },
];

const getPercentage = (count: number, total: number) => {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
};

interface ProgressBarProps {
  count: number;
  total: number;
  color: string;
}

const ProgressBar = ({ count, total, color }: ProgressBarProps) => {
  const percentage = getPercentage(count, total);
  return (
    <div className={styles.progressContainer}>
      <div className={styles.percentageRow}>
        <span className={styles.percentage}>{percentage}%</span>
      </div>
      <div className={styles.progressBarWrapper}>
        <div
          className={styles.progressBar}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      <span className={styles.count}>
        {count} of {total}
      </span>
    </div>
  );
};

const ReviewersTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredReviewers = hardCodedReviewers
    .filter(reviewer => reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)));

  const headers = ['Reviewer Name', 'Completed', 'Accepted', 'Rejected', 'Waitlisted'];

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <Typography variant="label/large">
          Total Number of Reviewers: {filteredReviewers.length}
        </Typography>
        <Search query={searchQuery} setQuery={setSearchQuery} />
      </div>
      <div className={styles.titleRow}>
        <Typography variant="headline/heavy/small">Reviewers List</Typography>
        <Button variant="secondary" className={styles.downloadButton}>
          ⬇ Download .CSV
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            {headers.map(header => (
              <th key={header}>
                {header === 'Reviewer Name' ? (
                  <span className={styles.sortable} onClick={() => setSortAsc(!sortAsc)}>
                    {header} {sortAsc ? '↑' : '↓'}
                  </span>
                ) : (
                  header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredReviewers.map(reviewer => (
            <tr key={reviewer.id}>
              <td>{reviewer.name}</td>
              <td>
                <ProgressBar
                  count={reviewer.stats.completed.count}
                  total={reviewer.stats.completed.total}
                  color="#3498db"
                />
              </td>
              <td>
                <ProgressBar
                  count={reviewer.stats.accepted.count}
                  total={reviewer.stats.accepted.total}
                  color="#e74c3c"
                />
              </td>
              <td>
                <ProgressBar
                  count={reviewer.stats.rejected.count}
                  total={reviewer.stats.rejected.total}
                  color="#27ae60"
                />
              </td>
              <td>
                <ProgressBar
                  count={reviewer.stats.waitlisted.count}
                  total={reviewer.stats.waitlisted.total}
                  color="#f39c12"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ReviewersTable;

'use client';
import { useState, useEffect, useMemo } from 'react';
import Typography from '@/components/Typography';
import Search from '@/components/Search';
import Table from '@/components/Table';
import { PrivateProfile, FullProfile, ReviewAssignment } from '@/lib/types/apiResponses';
import TableHeader from '@/components/TableHeader';
import TableCell from '@/components/TableCell';
import TableRow from '@/components/TableRow';
import Button from '@/components/Button';
import styles from './style.module.scss';
import { getAllAssignments } from '@/lib/api/AdminAPI';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';

interface ReviewersTableProps {
  assignments: ReviewAssignment[];
}
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

const ReviewersTable = ({ assignments }: ReviewersTableProps) => {
  console.log('Assignments:', assignments);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAsc, setSortAsc] = useState(false);
  const reviewers = useMemo<Reviewer[]>(() => {
    const reviewerMap = new Map<
      string,
      {
        id: string;
        name: string;
        total: number;
        completed: number;
        accepted: number;
        rejected: number;
        waitlisted: number;
      }
    >();
    assignments.forEach(({ reviewer, applicant }) => {
      if (!reviewer) return;

      const id = reviewer.id;
      const name = reviewer.firstName + ' ' + reviewer.lastName;
      if (!reviewerMap.has(id)) {
        reviewerMap.set(id, {
          id,
          name,
          total: 0,
          completed: 0,
          accepted: 0,
          rejected: 0,
          waitlisted: 0,
        });
      }
      const row = reviewerMap.get(id)!;
      if (row) {
        row.total += 1;
        const decision = String(applicant.applicationDecision);
        if (decision && decision !== 'NO_DECISION') {
          row.completed += 1;
          if (decision === 'ACCEPT') {
            row.accepted += 1;
          }
          if (decision === 'REJECT') {
            row.rejected += 1;
          }
          if (decision === 'WAITLIST') {
            row.waitlisted += 1;
          }
        }
      }
    });
    return Array.from(reviewerMap.values()).map(
      ({ id, name, total, completed, accepted, rejected, waitlisted }) => ({
        id,
        name,
        stats: {
          completed: { count: completed, total },
          accepted: { count: accepted, total },
          rejected: { count: rejected, total },
          waitlisted: { count: waitlisted, total },
        },
      })
    );
  }, [assignments]);

  const filteredReviewers = reviewers
    .filter(reviewer => reviewer.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortAsc) {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

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
                  color="#27ae60"
                />
              </td>
              <td>
                <ProgressBar
                  count={reviewer.stats.rejected.count}
                  total={reviewer.stats.rejected.total}
                  color="#e74c3c"
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

'use client';
import ApplicationRow from '../ApplicationRow';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import { ResponseModel } from '@/lib/types/apiResponses';
import { useState } from 'react';
import styles from './style.module.scss';

interface ApplicationTableProps {
  applications: ResponseModel[];
}

const ApplicationTable = ({ applications }: ApplicationTableProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 0));
  };

  const handleNext = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages - 1));
  };

  const startIndex = currentPage * itemsPerPage;
  const currentApplications = applications.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <table className={styles.appTable}>
          <thead>
            <tr className={styles.tableHeader}>
              <th>Applicant Name</th>
              <th>Status</th>
              <th>Submission Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentApplications.map((app, index) => (
              <ApplicationRow key={index} application={app} />
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <Typography variant="label/small">
          {startIndex + 1}-{startIndex + itemsPerPage} of {applications.length}
        </Typography>
        <Button className={styles.pageButton} onClick={handlePrevious}>{'<'}</Button>
        <Button className={styles.pageButton} onClick={handleNext}>{'>'}</Button>
      </div>
    </div>
  );
};

export default ApplicationTable;

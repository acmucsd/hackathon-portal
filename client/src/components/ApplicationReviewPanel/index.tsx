'use client';

import { useState } from 'react';
import styles from './style.module.scss';

import StatusTag from '@/components/StatusTag';
import StatusDropdown from '@/components/StatusDropdown';

// interface ApplicationReviewPanel {
//   application: ResponseModel;
//   applicationStatus: ApplicationStatus;
// }

// const ApplicationReviewPanel = ({ application, applicationStatus }: ApplicationCardProps) => {
const ApplicationReviewPanel = () => {
  const [status, setStatus] = useState<string | undefined>();

  // TODO: add API calls

  return (
    <div className={styles.container}>
      {/* stats */}
      <div className={styles.top}>
        <p>
          <span className={styles.number}> XX </span> Accepted |
          <span className={styles.number}> XX </span> Rejected |
          <span className={styles.number}> XX </span> Waitlisted
        </p>
        <p>
          Remaining: <span className={styles.number}> X out of XX </span> | Total % of accepted:{' '}
          <span className={styles.number}> XX% </span>
        </p>
      </div>
      {/* review */}
      <div className={styles.middleTop}>
        <h1 className={styles.sectionTitle}> Application Review </h1>
        <p className={styles.label}>
          {' '}
          Application Name:
          <span className={styles.name}> FirstName LastName</span>
        </p>
        <p className={styles.label}>
          {' '}
          Reviewer Name:
          <span className={styles.name}> FirstName LastName</span>
        </p>
        <p className={`${styles.label} ${styles.lastLabel}`}>
          {' '}
          Final Decision:
          <span className={styles.decision}>
            {/* TODO: make status bubble accurate */}
            <StatusTag status={status || 'NO_DECISION'} />
          </span>
        </p>
      </div>
      {/* decision */}
      <div className={styles.middleBottom}>
        <h1 className={styles.sectionTitle}>Application Decision</h1>
        <StatusDropdown value={status} onChange={setStatus} />
        <div className={styles.addNotes}>
          <p className={styles.subtitle}>Additional Notes</p>
          <textarea
            name="addNotes"
            id="addNotes"
            placeholder="List any reasonings for the decision, opinions, etc."
            className={styles.textarea}
          ></textarea>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.resetBtn}> Reset </button>
          <button className={styles.saveBtn}> Save Response </button>
        </div>
      </div>
      {/* which applicant */}
      <div className={styles.bottom}>
        {/* TODO: replace with button SVGs */}
        {/* TODO: gray out a button when beginning/end reached */}
        <button className={styles.btn}> ← </button>
        <p>Applicant XX/XX</p>
        <button className={styles.btn}> →</button>
      </div>
    </div>
  );
};

export default ApplicationReviewPanel;

'use client';
import styles from './style.module.scss';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import { useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';

interface SuperAdminToolsProps {
  user?: { firstName: string };
}

const SuperAdminTools = ({ user }: SuperAdminToolsProps) => {
  const [reviewersAssigned, setReviewersAssigned] = useState(false);
  const [releaseStep, setReleaseStep] = useState(0);

  const getReleaseButtonText = () => {
    switch (releaseStep) {
      case 0:
        return 'Release Application Results';
      case 1:
        return 'ARE YOU SURE?';
      case 2:
        return `${user?.firstName || 'Admin'}, ARE YOU REALLY SURE? (last chance)`;
      default:
        return "Applications Released (it's over)";
    }
  };
  const getReleaseButtonClass = () => {
    if (releaseStep >= 3) return styles.grayButton;
    return styles.redButton;
  };
  return (
    <div className={styles.container}>
    <h1>Super Admin Tools</h1>
    <div className={styles.toolRow}>
      <span className={styles.label}>Assign Reviewers</span>
      <Button
          className={reviewersAssigned ? styles.grayButton : styles.greenButton}
          onClick={() => setReviewersAssigned(true)}
          disabled={reviewersAssigned}
        >
          <GroupIcon style={{ marginRight: 8 }} />
          {reviewersAssigned
            ? `Reviewers assigned (great job ${user?.firstName || 'bonga'}!)`
            : 'Assign Reviewers'}
        </Button>
    </div>
    <div className={styles.toolRow}>
      <span className={styles.label}>Release Applications</span>
      <Button
          className={getReleaseButtonClass()}
          onClick={() => {
            if (releaseStep < 3) setReleaseStep(prev => prev + 1);
          }}
          disabled={releaseStep >= 3}
        >
          <SendIcon style={{ marginRight: 8 }} />
          {getReleaseButtonText()}
        </Button>
    </div>
  </div>
  )

}

export default SuperAdminTools;
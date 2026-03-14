'use client';
import styles from './style.module.scss';
import Button from '@/components/Button';
import { useState } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import SendIcon from '@mui/icons-material/Send';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import {
  randomizeAssignments,
  releaseDecisions,
  setAcceptanceDeadlinePassed,
} from '@/lib/api/AdminAPI';
import showToast from '@/lib/showToast';

interface SuperAdminToolsProps {
  user?: { firstName: string };
  token: string;
}

const SuperAdminTools = ({ user, token }: SuperAdminToolsProps) => {
  const [reviewersAssigned, setReviewersAssigned] = useState(false);
  const [releaseStep, setReleaseStep] = useState(0);
  const [acceptanceDeadlineStep, setAcceptanceDeadlineStep] = useState(0);
  const [acceptanceDeadlineUpdatedCount, setAcceptanceDeadlineUpdatedCount] = useState<
    number | null
  >(null);
  const handleAssignReviewers = async () => {
    try {
      await randomizeAssignments(token);
      setReviewersAssigned(true);
    } catch (error) {
      showToast('Error assigning reviewers', String(error));
    }
  };
  const handleReleaseDecisions = async () => {
    if (releaseStep < 2) {
      setReleaseStep(prev => prev + 1);
    } else if (releaseStep === 2) {
      try {
        await releaseDecisions(token);
        setReleaseStep(3);
      } catch (error) {
        showToast('Error releasing decisions', String(error));
      }
    }
  };
  const handleSetAcceptanceDeadlinePassed = async () => {
    if (acceptanceDeadlineStep < 1) {
      setAcceptanceDeadlineStep(prev => prev + 1);
      return;
    }

    try {
      const updatedCount = await setAcceptanceDeadlinePassed(token);
      setAcceptanceDeadlineUpdatedCount(updatedCount);
      setAcceptanceDeadlineStep(2);
      showToast('Acceptance deadline update complete', `${updatedCount} users updated.`);
    } catch (error) {
      showToast('Error updating accepted users', String(error));
    }
  };
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

  const getAcceptanceDeadlineButtonText = () => {
    switch (acceptanceDeadlineStep) {
      case 0:
        return 'Set Accepted Users to Deadline Passed';
      case 1:
        return 'ARE YOU SURE?';
      default:
        return `Updated ${acceptanceDeadlineUpdatedCount ?? 0} users`;
    }
  };

  const getAcceptanceDeadlineButtonClass = () => {
    if (acceptanceDeadlineStep >= 2) return styles.grayButton;
    return styles.redButton;
  };

  return (
    <div className={styles.container}>
      <h1>Super Admin Tools</h1>
      <div className={styles.toolRow}>
        <span className={styles.label}>Assign Reviewers</span>
        <Button
          className={reviewersAssigned ? styles.grayButton : styles.greenButton}
          onClick={handleAssignReviewers}
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
          onClick={handleReleaseDecisions}
          disabled={releaseStep >= 3}
        >
          <SendIcon style={{ marginRight: 8 }} />
          {getReleaseButtonText()}
        </Button>
      </div>
      <div className={styles.toolRow}>
        <span className={styles.label}>Close Acceptances</span>
        <Button
          className={getAcceptanceDeadlineButtonClass()}
          onClick={handleSetAcceptanceDeadlinePassed}
          disabled={acceptanceDeadlineStep >= 2}
        >
          <AlarmOnIcon style={{ marginRight: 8 }} />
          {getAcceptanceDeadlineButtonText()}
        </Button>
      </div>
    </div>
  );
};

export default SuperAdminTools;

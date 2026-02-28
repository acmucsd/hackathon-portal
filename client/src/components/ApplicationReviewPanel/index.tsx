'use client';

import Image from 'next/image';
import styles from './style.module.scss';

import StatusDropdown from '@/components/StatusDropdown';
import showToast from '@/lib/showToast';

import type { Application } from '@/lib/types/application';
import type { PublicProfile } from '@/lib/types/apiResponses';
import type { ApplicationDecision } from '@/lib/types/enums';

export interface ApplicationReviewPanelProps {
  applicant: PublicProfile;
  reviewer: PublicProfile;

  currentIndex: number;
  totalApplicants: number;

  decision: ApplicationDecision;
  onDecisionChange: (d: ApplicationDecision) => void;

  notes: string;
  onNotesChange: (notes: string) => void;

  onPrev: () => void;
  onNext: () => void;

  onReset: () => void;
  onSave: () => Promise<void> | void;

  isSaving?: boolean;
}

// const ApplicationReviewPanel = ({ application, applicationStatus }: ApplicationCardProps) => {
const ApplicationReviewPanel = ({
  applicant,
  reviewer,
  currentIndex,
  totalApplicants,
  decision,
  onDecisionChange,
  notes,
  onNotesChange,
  onPrev,
  onNext,
  onReset,
  onSave,
  isSaving,
}: ApplicationReviewPanelProps) => {
  const applicantNumber = currentIndex + 1;
  const isAtStart = currentIndex <= 0;
  const isAtEnd = currentIndex >= totalApplicants - 1;

  // keep StatusDropdown usage the same; only fix setStatus
  const status = decision;
  const setStatus = (value: any) => onDecisionChange(value as ApplicationDecision);
  return (
    <div className={styles.container}>
      {/* which applicant - only show when there are multiple applicants */}
      {totalApplicants > 1 && (
        <div className={styles.top}>
          <button
            className={`${styles.btn} ${isAtStart ? styles.btnDisabled : ''}`}
            onClick={onPrev}
            disabled={isAtStart}
          >
            <Image width={21} height={21} src="/assets/arrow-left.svg" alt="←" />
          </button>
          <p className={styles.numApplicants}>
            {applicantNumber}/{totalApplicants}
          </p>
          <button
            className={`${styles.btn} ${isAtEnd ? styles.btnDisabled : ''}`}
            onClick={onNext}
            disabled={isAtEnd}
          >
            <Image width={21} height={21} src="/assets/arrow-right.svg" alt="→" />
          </button>
        </div>
      )}
      {/* decision */}
      <div className={styles.decisionSection}>
        <h1 className={styles.sectionTitle}>Application Decision</h1>
        <StatusDropdown value={status} onChange={setStatus} />
        <div className={styles.nameSection}>
          <p className={styles.label}>
            {' '}
            Applicant:
            <span className={styles.name}>
              {' '}
              {applicant.firstName} {applicant.lastName}
            </span>
          </p>
          <p className={styles.label}>
            {' '}
            Reviewer:
            <span className={styles.name}>
              {' '}
              {reviewer ? reviewer.firstName + ' ' + reviewer.lastName : 'No Reviewer Assigned'}
            </span>
          </p>
        </div>

        {/* notes */}
        <div className={styles.addNotes}>
          <p className={styles.subtitle}>Additional Notes</p>
          <textarea
            name="addNotes"
            id="addNotes"
            placeholder="List any reasonings for the decision, opinions, etc."
            className={styles.textarea}
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
          ></textarea>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.resetBtn} onClick={onReset}>
            {' '}
            Reset{' '}
          </button>
          <button className={styles.saveBtn} onClick={onSave} disabled={isSaving}>
            {' '}
            Save Response{' '}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewPanel;

'use client';

import Image from 'next/image';
import styles from './style.module.scss';

import StatusDropdown from '@/components/StatusDropdown';
import showToast from '@/lib/showToast';

import { Application } from '@/lib/types/application';
import { PublicProfile } from '@/lib/types/apiResponses';
import { ApplicationDecision } from '@/lib/types/enums';

export interface ApplicationReviewPanelProps {
  applicant: Application;
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

  async function handleSave() {
    try {
      await onSave();
      showToast('Saved successfully!', 'Your responses have been saved!');
    } catch (e) {
      showToast('Save failed', 'Could not save your response.');
    }
  }

  return (
    <div className={styles.container}>
      {/* which applicant */}
      <div className={styles.top}>
        {/* TODO: gray out a button when beginning/end reached */}
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
              {reviewer.firstName} {reviewer.lastName}
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
          <button className={styles.saveBtn} onClick={handleSave} disabled={isSaving}>
            {' '}
            Save Response{' '}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationReviewPanel;

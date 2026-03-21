'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import Typography from '../Typography';
import showToast from '@/lib/showToast';
import { updateFetchAiHandle } from '@/lib/api/UserAPI';
import { OnboardingTask } from '../Dashboard/onboardingTasks';
import styles from './style.module.scss';

interface OnboardingTaskCardProps {
  task: OnboardingTask;
}

const OnboardingTaskCard = ({ task }: OnboardingTaskCardProps) => {
  const router = useRouter();
  const {
    image,
    imageAlt,
    title,
    subtitle,
    subtitleLink,
    href,
    buttonLabel,
    variant,
    openNewTab,
    required,
    completed,
    isFetchAi,
    points,
  } = task;

  const isDone = Boolean(completed);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(isDone);

  useEffect(() => {
    if (isFetchAi) setIsVerified(Boolean(completed));
  }, [isFetchAi, completed]);

  const handleVerify = async () => {
    const link = inputValue.trim();
    if (!link) {
      setError('Please enter a valid link');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await updateFetchAiHandle(link);
      showToast('Success', 'Fetch.ai link verified.');
      setIsVerified(true);
      setInputValue('');
      router.refresh();
    } catch {
      setError('Failed to validate link');
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = isFetchAi ? isVerified : isDone;
  const fetchAiButtonLabel = isLoading ? 'Verifying...' : isVerified ? 'Verified' : buttonLabel;

  return (
    <div className={`${styles.onboardingTaskCard} ${!isComplete ? styles.notDone : ''}`}>
      <div className={styles.badgeRow}>
        <span className={required ? styles.badgeRequired : styles.badgeOptional}>
          {required ? 'Required' : 'Optional'}
        </span>
        {points && (
          <div className={`${styles.points} ${isVerified ? styles.pointsVerified : ''}`}>
            <span className={isVerified ? styles.checkmark : styles.plus}>
              {isVerified ? '✓' : '+'}
            </span>
            <span>{points} pts</span>
          </div>
        )}
      </div>

      <Image className={styles.onboardingImage} src={image} alt={imageAlt} />

      <Typography className={styles.onboardingTitle} variant="body/large" component="h3">
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body/small" component="p">
          {subtitleLink ? (
            <Link href={subtitleLink} className="link" target="_blank">
              {subtitle}
            </Link>
          ) : (
            subtitle
          )}
        </Typography>
      )}

      {isFetchAi && !isVerified && (
        <>
          <input
            type="text"
            placeholder="Paste agent link"
            value={inputValue}
            onChange={e => {
              setInputValue(e.target.value);
              setError(null);
            }}
            className={`${styles.input} ${error ? styles.inputError : ''}`}
            disabled={isLoading}
          />
          {error && (
            <Typography variant="body/small" className={styles.error}>
              {error}
            </Typography>
          )}
        </>
      )}

      <Button
        href={isFetchAi ? undefined : isComplete ? undefined : href}
        onClick={
          isFetchAi
            ? () => {
                void handleVerify();
              }
            : undefined
        }
        disabled={isFetchAi ? isVerified || isLoading : isComplete}
        variant={isComplete ? undefined : (variant ?? 'primary')}
        className={isComplete ? styles.successButton : ''}
        openNewTab={openNewTab}
      >
        {isFetchAi ? fetchAiButtonLabel : isComplete ? 'All Done!' : buttonLabel}
      </Button>
    </div>
  );
};

export default OnboardingTaskCard;

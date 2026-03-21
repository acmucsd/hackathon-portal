'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../Card';
import Typography from '../Typography';
import Button from '../Button';
import showToast from '@/lib/showToast';
import { SponsorTask } from '../Dashboard/sponsorTasks';
import styles from './style.module.scss';
import { updateFetchAiHandle } from '@/lib/api/SponsorAPI';

interface SponsorTaskCardProps {
  task: SponsorTask;
}

const SponsorTaskCard = ({ task }: SponsorTaskCardProps) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFetchAiTask = task.id === 'fetch-ai';

  const [isVerified, setIsVerified] = useState(isFetchAiTask ? Boolean(task.completed) : false);

  useEffect(() => {
    if (isFetchAiTask) {
      setIsVerified(Boolean(task.completed));
    }
  }, [isFetchAiTask, task.completed]);

  const handleFetchAiVerify = async () => {
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

  const imageVariantClass = task.title.includes('Qualcomm')
    ? styles.imageQualcomm
    : task.title.includes('Fetch')
      ? styles.imageFetch
      : styles.imageBrowser;

  return (
    <Card
      gap={1}
      className={`${styles.sponsorTaskCard} ${isFetchAiTask && !isVerified ? styles.notDone : ''}`}
    >
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          <Image
            src={task.image}
            alt={task.imageAlt}
            fill
            sizes="(max-width: 768px) 160px, 220px"
            className={`${styles.image} ${imageVariantClass}`}
          />
        </div>
        {isFetchAiTask && (
          <div className={styles.points}>
          {isFetchAiTask && isVerified ? (
            <>
              <span className={styles.checkmark}>✓</span>
              <span>{task.points} pts</span>
            </>
          ) : (
            <>
              <span className={styles.plus}>+</span>
              <span>{task.points} pts</span>
            </>
          )}
        </div>
        )}

      </div>

      <Typography variant="label/medium" component="h3" className={styles.title}>
        {task.title}
      </Typography>

      <Typography variant="body/small" component="p" className={styles.subtitle}>
        {task.subtitle === 'View Instructions' ? (
          <Link href={task.instructionsLink || ''} className="link" target="_blank">
            View Instructions
          </Link>
        ) : (
          task.subtitle
        )}
      </Typography>

      {isFetchAiTask && task.variant === 'input' && !isVerified && (
        <>
          <input
            type="text"
            placeholder="paste link"
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
        onClick={() => {
          if (task.variant === 'input' && !isVerified && isFetchAiTask) {
            void handleFetchAiVerify();
            return;
          }
          if (task.href && task.href !== '#') window.open(task.href, '_blank');
        }}
        disabled={isFetchAiTask ? isVerified || isLoading : false}
        variant={isFetchAiTask && isVerified ? 'secondary' : 'primary'}
        className={styles.button}
      >
        {isFetchAiTask
          ? isLoading
            ? 'Verifying...'
            : isVerified
              ? 'Verified'
              : task.buttonLabel
          : task.buttonLabel}
      </Button>
    </Card>
  );
};

export default SponsorTaskCard;

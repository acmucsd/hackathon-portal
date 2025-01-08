'use client';

import ApplicationStep from '@/components/ApplicationStep';
import { appQuestions } from '@/config';
import styles from '../page.module.scss';
import { useSearchParams } from 'next/navigation';
import ApplicationReview from '@/components/ApplicationReview';
import Progress from '@/components/Progress';

export default function Application() {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') ?? 1);

  return (
    <main className={styles.main}>
      <Progress
        steps={[...appQuestions.map(({ shortName }) => shortName), 'Review']}
        step={step - 1}
      />
      {step <= appQuestions.length ? (
        <ApplicationStep
          step={appQuestions[step - 1]}
          prev={step === 1 ? '/' : `?step=${step - 1}`}
          next={`?step=${step + 1}`}
        />
      ) : (
        <ApplicationReview responses={{}} prev={`?step=${appQuestions.length}`} next="/submitted" />
      )}
    </main>
  );
}

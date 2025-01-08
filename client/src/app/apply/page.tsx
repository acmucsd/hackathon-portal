'use client';

import ApplicationStep from '@/components/ApplicationStep';
import { appQuestions } from '@/config';
import styles from '../page.module.scss';
import { useSearchParams } from 'next/navigation';

export default function Application() {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') ?? 1);

  return (
    <main className={styles.main}>
      <ApplicationStep
        step={appQuestions[step - 1]}
        prev={step === 1 ? '/' : `?=${step - 1}`}
        next={`?step=${step + 1}`}
      />
    </main>
  );
}

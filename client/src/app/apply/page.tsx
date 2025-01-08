'use client';

import ApplicationStep from '@/components/ApplicationStep';
import { appQuestions } from '@/config';
import styles from '../page.module.scss';

export default function Application() {
  return (
    <main className={styles.main}>
      <ApplicationStep step={appQuestions[1]} />
    </main>
  );
}

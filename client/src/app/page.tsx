import { QUESTIONS, TIMELINE } from '@/config';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className={styles.main}>
      <Dashboard name="User" faq={QUESTIONS} status="not-started" timeline={TIMELINE} />
    </main>
  );
}

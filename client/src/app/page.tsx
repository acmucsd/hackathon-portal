import { FAQ_QUESTIONS, TIMELINE } from '@/config';
import Dashboard from '@/components/Dashboard';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.main}>
      <Dashboard name="User" faq={FAQ_QUESTIONS} status="not-started" timeline={TIMELINE} />
    </main>
  );
}

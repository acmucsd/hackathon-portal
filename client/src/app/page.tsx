import { QUESTIONS, TIMELINE } from '@/config';
import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className={styles.main}>
      <Dashboard faq={QUESTIONS} timeline={TIMELINE} />
    </main>
  );
}

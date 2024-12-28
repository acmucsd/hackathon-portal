import styles from './page.module.scss';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className={styles.main}>
      <Dashboard />
    </main>
  );
}

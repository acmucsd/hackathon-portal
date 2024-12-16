import styles from './page.module.scss';
import Image from 'next/image';

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <Image src="/acm-logo.png" width={100} height={100} alt="ACM Logo" />
      </div>
      <div>
        <h1>Welcome to ACM&apos;s static site template!</h1>
      </div>
    </main>
  );
}

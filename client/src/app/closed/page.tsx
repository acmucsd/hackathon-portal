import Card from '@/components/Card';
import Heading from '@/components/Heading';
// import Peakers from '../../../public/assets/heistscene.svg';
import Closed from '../../../public/assets/Closed2026.svg';

import styles from './page.module.scss';

export default async function ClosedPage() {
  return (
    <main className={styles.main}>
      <Card gap={0} className={styles.message}>
        <Heading centered>
          DiamondHacks portal is closed. <br></br>See you next year!
        </Heading>
      </Card>
      <div className={styles.imageWrapper}>
        <Closed />
      </div>
    </main>
  );
}

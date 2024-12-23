import Card from '@/components/Card';
import styles from './page.module.scss';
import Heading from '@/components/Heading';
import Button from '@/components/Button';

export default function Home() {
  return (
    <main className={styles.main}>
      <Card gap={1}>
        <Heading centered>Hello gamers</Heading>
        <p>Once upon a time, in a galaxy far far away</p>
        <div className={styles.buttonRow}>
          <Button variant="tertiary">Discard Changes</Button>
          <Button variant="secondary" href="/">
            Save Changes
          </Button>
          <Button variant="primary">Next</Button>
        </div>
      </Card>
    </main>
  );
}

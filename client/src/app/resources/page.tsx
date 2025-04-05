import ResourceCarousel from '@/components/ResourceCarousel';
import { RESOURCES } from './resources';
import ResourceBanner from '@/../public/assets/resources.svg';
import styles from './page.module.scss';
import Typography from '@/components/Typography';

export default function ResourcePage() {
  return (
    <main className={styles.main}>
      <div className={styles.bannerContainer}>
        <ResourceBanner className={`${styles.banner}, ${styles.desktop}`} />

        <Typography variant="headline/heavy/medium" className={styles.mobile}>
          Hackathon Resources
        </Typography>
      </div>
      <ResourceCarousel
        title="Starter Packs"
        resources={RESOURCES.filter(r => r.resource_type === 'starter_pack')}
      />
      <ResourceCarousel
        title="Tutorials"
        resources={RESOURCES.filter(r => r.resource_type === 'tutorial')}
      />
    </main>
  );
}

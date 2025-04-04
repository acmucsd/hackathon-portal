import ResourceCarousel from '@/components/ResourceCarousel';
import {
  API_RESOURCES,
  BACKEND_RESOURCES,
  FRONTEND_RESOURCES,
} from '@/sections/Resources/resources';
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
        title="Frontend"
        resources={FRONTEND_RESOURCES}
        placeholder={'No Resources Here!'}
        link="frontend"
      />
      <ResourceCarousel
        title="Backend"
        resources={BACKEND_RESOURCES}
        placeholder={'No Resources Here!'}
        link="backend"
      />
      <ResourceCarousel
        title="APIs"
        resources={API_RESOURCES}
        placeholder={'No Resources Here!'}
        link="api"
      />
    </main>
  );
}

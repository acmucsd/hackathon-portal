import ResourceCarousel from '@/components/ResourceCarousel';
import { API_RESOURCES, BACKEND_RESOURCES, FRONTEND_RESOURCES } from '@/sections/Resources/resources';
import ResourceBanner from '@/../public/assets/resources.svg';
import styles from './page.module.scss';

export default function ResourcePage() {
  return (
    <main className={styles.main}>
      <ResourceBanner className={styles.banner} />
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

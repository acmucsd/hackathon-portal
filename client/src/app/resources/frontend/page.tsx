import ResourceCarousel from '@/components/ResourceCarousel';
import { FRONTEND_RESOURCES } from '@/sections/Resources/resources';
import Typography from '@/components/Typography';
import DiamondFriends from '@/../../public/assets/diamond-friends.svg';

import styles from './page.module.scss';
import ResourceCard from '@/components/ResourceCard';

export default function FrontendResourcePage() {
  return (
    <main className={styles.main}>
      <Typography variant="headline/heavy/small">All Frontend Resources</Typography>
      {FRONTEND_RESOURCES.length > 0 ? (
        <div className={styles.wrapper}>
          {FRONTEND_RESOURCES.map(resource => (
            <ResourceCard className={styles.card} key={resource.title} resource={resource} />
          ))}
        </div>
      ) : (
        <div className={styles.noEvents}>
          <DiamondFriends />
          <Typography variant="label/medium">{'No Resources Here!'}</Typography>
        </div>
      )}
    </main>
  );
}

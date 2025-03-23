import ResourceCarousel from '@/components/ResourceCarousel';
import { FRONTEND_RESOURCES } from '@/sections/Resources/resources';
import Typography from '@/components/Typography';
import DiamondFriends from '@/../../public/assets/diamond-friends.svg';

import styles from './page.module.scss';
import ResourceCard from '@/components/ResourceCard';
import ResourcesAll from '@/components/ResourcesAll';

export default function FrontendResourcePage() {
  return (
    <main className={styles.main}>
      <ResourcesAll title={'All Frontend Resources'} resources={FRONTEND_RESOURCES} placeholder='No Resources Here!' />
    </main>
  );
}

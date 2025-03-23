import { BACKEND_RESOURCES } from '@/sections/Resources/resources';

import styles from './page.module.scss';
import ResourcesAll from '@/components/ResourcesAll';

export default function BackendResourcePage() {
  return (
    <main className={styles.main}>
      <ResourcesAll title={'All Backend Resources'} resources={BACKEND_RESOURCES} placeholder='No Resources Here!' />
    </main>
  );
}

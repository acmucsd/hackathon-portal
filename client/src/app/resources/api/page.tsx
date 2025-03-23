import { API_RESOURCES, BACKEND_RESOURCES } from '@/sections/Resources/resources';

import styles from './page.module.scss';
import ResourcesAll from '@/components/ResourcesAll';

export default function BackendResourcePage() {
  return (
    <main className={styles.main}>
      <ResourcesAll title={'All API Resources'} resources={API_RESOURCES} placeholder='No Resources Here!' />
    </main>
  );
}


import ResourceCarousel from '@/components/ResourceCarousel';
import { FRONTEND_RESOURCES } from '@/sections/Resources/resources';
import ResourceBanner from '@/../public/assets/resources.svg';
import styles from './page.module.scss';

export default function ResourcePage() {
  return (
    <main className={styles.main}>
      <ResourceBanner className={styles.banner} />
      <ResourceCarousel title="Frontend" resources={FRONTEND_RESOURCES} placeholder={'No Resources Here!'}/>
      <ResourceCarousel title="Backend" resources={FRONTEND_RESOURCES} placeholder={'No Resources Here!'}/>
      <ResourceCarousel title="APIs" resources={FRONTEND_RESOURCES} placeholder={'No Resources Here!'}/>
    </main>
  )
}

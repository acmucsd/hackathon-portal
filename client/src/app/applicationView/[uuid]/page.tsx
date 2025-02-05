import { UserAPI, AdminAPI } from '@/lib/api';
import styles from './page.module.scss';

interface ApplicationReviewPageProps {
  params: Promise<{ uuid: string }>;
}

export default async function ApplicationReviewPage({ params }: ApplicationReviewPageProps) {
  const user = Number((await params).uuid);
  const fetchedUser = await (accessToken)

  return (
    <main className={styles.main}>

    </main>
  )
}
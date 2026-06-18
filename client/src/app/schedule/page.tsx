import { EventAPI } from '@/lib/api';
import DayOfTimelineItem from '@/components/DayOfTimelineItem';
import { redirect } from 'next/navigation';
import styles from './page.module.scss';
import Link from 'next/link';
import { headers } from 'next/headers';
import config from '@/lib/config';

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const headersList = await headers();
  const accessToken = headersList.get(config.header.accessToken)!;

  const { day } = await searchParams;
  const selectedDate = day ?? 'SATURDAY';

  try {
    const fetchedEvents = await EventAPI.getPublishedEvents(accessToken);
    const fetchedFilteredEvents = fetchedEvents
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
      .filter(event => event.day === selectedDate);
    return (
      <main className={styles.main}>
        <div className={styles.buttonContainer}>
          <Link
            href="?day=SATURDAY"
            className={`${styles.button} ${selectedDate === 'SATURDAY' ? styles.active : ''}`}
          >
            Saturday
          </Link>
          <Link
            href="?day=SUNDAY"
            className={`${styles.button} ${selectedDate === 'SUNDAY' ? styles.active : ''}`}
          >
            Sunday
          </Link>
        </div>
        <div className={styles.timelineItemWrapper}>
          {fetchedFilteredEvents.map((event, i) => (
            <DayOfTimelineItem
              event={event}
              key={i}
              ongoing={false}
              last={i === fetchedFilteredEvents.length - 1}
            />
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error(error);
    redirect('/');
  }
}

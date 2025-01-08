import { FAQ_QUESTIONS, TIMELINE } from '@/config';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return <Dashboard name="User" faq={FAQ_QUESTIONS} status="not-started" timeline={TIMELINE} />;
}

import { QUESTIONS, TIMELINE } from '@/config';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  return <Dashboard name="User" faq={QUESTIONS} status="not-started" timeline={TIMELINE} />;
}

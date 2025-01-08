'use client';

import ApplicationStep from '@/components/ApplicationStep';
import { appQuestions } from '@/config';

export default function Application() {
  return <ApplicationStep step={appQuestions[1]} />;
}

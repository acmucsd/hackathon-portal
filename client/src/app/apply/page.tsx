'use client';

import ApplicationStep from '@/components/ApplicationStep';
import { appQuestions } from '@/config';
import styles from './page.module.scss';
import { useSearchParams } from 'next/navigation';
import ApplicationReview from '@/components/ApplicationReview';
import Progress from '@/components/Progress';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import PartyPopper from '@/../public/assets/party-popper.svg';

export default function Application() {
  const searchParams = useSearchParams();
  const step = Number(searchParams.get('step') ?? 1);

  return (
    <main className={styles.main}>
      <Progress
        steps={[...appQuestions.map(({ shortName }) => shortName), 'Review']}
        step={step - 1}
      />
      {appQuestions[step - 1] ? (
        <ApplicationStep
          step={appQuestions[step - 1]}
          prev={step === 1 ? '/' : `?step=${step - 1}`}
          next={`?step=${step + 1}`}
        />
      ) : step === appQuestions.length + 1 ? (
        <ApplicationReview
          responses={{}}
          prev={`?step=${appQuestions.length}`}
          next={`?step=${appQuestions.length + 2}`}
        />
      ) : step === appQuestions.length + 2 ? (
        <Card gap={2.5} className={styles.submitted}>
          <PartyPopper />
          <Typography variant="headline/heavy/large">
            Woohooo!! You successfully submitted your DiamondHacks application! Check back for
            updates on the dashboard.
          </Typography>
          <Button href="/">Return to Dashboard</Button>
        </Card>
      ) : null}
    </main>
  );
}

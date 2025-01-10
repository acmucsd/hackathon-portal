import ApplicationStep from '@/components/ApplicationStep';
import { appQuestions } from '@/config';
import styles from './page.module.scss';
import ApplicationReview from '@/components/ApplicationReview';
import Progress from '@/components/Progress';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import PartyPopper from '@/../public/assets/party-popper.svg';
import { redirect } from 'next/navigation';
import { ResponseAPI } from '@/lib/api';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { AxiosError } from 'axios';

const STEP_REVIEW = appQuestions.length + 1;
const STEP_SUBMITTED = appQuestions.length + 2;

type ApplicationPageProps = {
  params: Promise<{ step: string }>;
};

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  const step = Number((await params).step);

  // For now, prohibit user from editing application
  if (step < STEP_SUBMITTED) {
    let exists = false;
    try {
      await ResponseAPI.getApplication(accessToken);
      exists = true;
    } catch (error) {
      if (!(error instanceof AxiosError && error.status === 404)) {
        console.log(error);
        redirect('/login');
      }
    }
    if (exists) {
      // If it exists, they've submitted their application
      // NOTE: Cannot redirect inside try-catch
      redirect(`/apply/${STEP_SUBMITTED}`);
    }
  }

  return (
    <main className={styles.main}>
      <Progress
        steps={[...appQuestions.map(({ shortName }) => shortName), 'Review']}
        step={step - 1}
      />
      {appQuestions[step - 1] ? (
        <ApplicationStep
          step={appQuestions[step - 1]}
          prev={step === 1 ? '/' : `/apply/${step - 1}`}
          next={`/apply/${step + 1}`}
        />
      ) : step === STEP_REVIEW ? (
        <ApplicationReview
          accessToken={accessToken}
          prev={`/apply/${appQuestions.length}`}
          next={`/apply/${STEP_SUBMITTED}`}
        />
      ) : step === STEP_SUBMITTED ? (
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

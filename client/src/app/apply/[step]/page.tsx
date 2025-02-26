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
import { CookieType, Yes, YesOrNo } from '@/lib/types/enums';
import { AxiosError } from 'axios';
import { ResponseModel } from '@/lib/types/apiResponses';
import { applicationToResponses } from '@/lib/responses';

const STEP_REVIEW = appQuestions.length + 1;
const STEP_SUBMITTED = appQuestions.length + 2;

type ApplicationPageProps = {
  params: Promise<{ step: string }>;
};

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);
  const step = Number((await params).step);

  let response: ResponseModel | null = null;
  if (step < STEP_SUBMITTED) {
    try {
      response = await ResponseAPI.getApplication(accessToken);
    } catch (error) {
      if (!(error instanceof AxiosError && error.status === 404)) {
        redirect('/login');
      }
    }
  }
  const application = response ? applicationToResponses(response.data) : undefined;

  return (
    <main className={styles.main}>
      <Progress
        steps={[...appQuestions.map(({ shortName }) => shortName), 'Review']}
        step={step - 1}
      />
      {appQuestions[step - 1] ? (
        <ApplicationStep
          submittedResponses={application}
          step={appQuestions[step - 1]}
          prev={step === 1 ? '/' : `/apply/${step - 1}`}
          next={`/apply/${step + 1}`}
        />
      ) : step === STEP_REVIEW ? (
        <ApplicationReview
          submittedResponses={application}
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
          <div className={styles.buttons}>
            <Button variant="secondary" href={`/apply/${STEP_REVIEW}`}>
              View Application
            </Button>
            <Button href="/">Return to Dashboard</Button>
          </div>
        </Card>
      ) : null}
    </main>
  );
}

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
import { Application } from '@/lib/types/application';

type ApplicationPageProps = {
  params: Promise<{ step: string }>;
};

export default async function ApplicationPage({ params }: ApplicationPageProps) {
  const accessToken = await getCookie(CookieType.ACCESS_TOKEN);

  let application: Application;
  try {
    console.log(await ResponseAPI.getResponsesForCurrentUser(accessToken));
    const { data } = await ResponseAPI.getApplication(accessToken);
    application = data;
  } catch (error) {
    if (error instanceof AxiosError && error.status === 404) {
      // Try creating an application if it doesn't exist
      try {
        await ResponseAPI.submitApplication(
          accessToken,
          {
            phoneNumber: '',
            age: '',
            university: '',
            levelOfStudy: '',
            country: '',
            linkedin: '',
            gender: '',
            pronouns: '',
            orientation: [],
            ethnicity: [],
            dietary: [],
            interests: [],
            major: '',
            referrer: [],
            resumeLink: '',
            willAttend: '',
            mlhCodeOfConduct: '',
            mlhAuthorization: '',
            mlhEmailAuthorization: '',
            additionalComments: '',
          },
          new File([], 'hello')
        );
      } catch (error) {
        console.log(error.response.data);
        console.log(error.response.data.error.errors);
        return null;
      }
      const { data } = await ResponseAPI.getApplication(accessToken);
      application = data;
    } else {
      console.log(error);
      redirect('/login');
    }
  }

  const step = Number((await params).step);

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
      ) : step === appQuestions.length + 1 ? (
        <ApplicationReview
          responses={{}}
          prev={`/apply/${appQuestions.length}`}
          next={`/apply/${appQuestions.length + 2}`}
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

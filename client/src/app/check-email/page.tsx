import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import styles from './page.module.scss';

interface CheckEmailProps {
  searchParams: { email?: string };
}

const CheckEmail = ({ searchParams }: CheckEmailProps) => {

  const email = searchParams.email;

  return (
    <main className={styles.main}>
      <div className={styles.check_email}>
        <Card gap={2}>
          <Heading centered>Verify your account</Heading>
          <Typography variant="label/medium">We’ve sent an email to <b>{email}</b> to verify your email address and activate your account</Typography>
          <Button variant="primary" href='/login'>
            Return to Log In
          </Button>
        </Card>
      </div>
    </main>
  );
};

export default CheckEmail;
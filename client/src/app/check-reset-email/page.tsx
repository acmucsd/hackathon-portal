import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import styles from './page.module.scss';

interface CheckEmailProps {
  email: string
}

const CheckEmail = async (props: CheckEmailProps) => {
  const email = props.email;

  return (
    <main className={styles.main}>
      <div className={styles.check_email}>
        <Card gap={2}>
          <Heading centered>Reset Email</Heading>
          <Typography variant="label/medium">
            We’ve sent an email to <b>{email}</b> with a link to reset your password
          </Typography>
          <Button variant="primary" href="/login">
            Return to Log In
          </Button>
        </Card>
      </div>
    </main>
  );
};

export default CheckEmail;

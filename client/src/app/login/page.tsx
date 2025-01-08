import Card from '@/components/Card';
import styles from '../page.module.scss';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import TextField from '@/components/TextField';
import Link from 'next/link';
import Alert from '@/components/Alert';
import Binary from '@/../public/assets/binary.png';

export default function LoginPage() {
  return (
    <main className={`${styles.main}`}>
      <div className={`${styles.login}`}>
        <Card gap={1}>
          <Heading centered>Log In</Heading>

          <Alert marginBottom={0}>
            <p>Oops, incorrect email or password.</p>
          </Alert>

          <TextField
            id="outlined-basic"
            variant="outlined"
            label={'Email Address'}
            defaultText={'Enter Email Address'}
          />

          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Password"
            defaultText={'Enter Password'}
          />

          <Link href="/forgot-password">Forgot your password?</Link>

          <Button variant="primary">Apply Now</Button>

          <Typography variant="label/medium" component="p">
            Don&rsquo;t have an account?{' '}
            <Link href="/register" className="link">
              {' '}
              Sign up!
            </Link>{' '}
          </Typography>
        </Card>
      </div>
    </main>
  );
}

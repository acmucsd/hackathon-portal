import Card from '@/components/Card';
import styles from '../page.module.scss';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';

export default function LoginPage() {
  return (
    <main className={styles.main}>
      <Card gap={1}>

        <Alert severity="error" variant='outlined'>
          Oops! Incorrect email or password.
        </Alert>

        <Heading centered>Log In</Heading>
        <Typography variant="title/medium" component="p">
          Email Address
        </Typography>

        <TextField id="outlined-basic" variant="outlined" label={"Enter Email Address"} />

        <Typography variant="title/medium" component="p">
          Password
        </Typography>

        <TextField
          id="outlined-basic"
          variant="outlined"
          label={"Enter Password"}
        />

        <Link href="/forgot-password">
          Forgot your password?
        </Link>

        <Button variant="primary">Apply Now</Button>

        <Typography variant="label/medium" component="p">
          Don't have an account? <Link href="/register"> Sign up!</Link>
        </Typography>

        {/* <div className={styles.buttonRow}>
          <Button variant="tertiary">Discard Changes</Button>
          <Button variant="secondary" href="/">
            Save Changes
          </Button>
          <Button variant="primary">Next</Button>
        </div> */}
      </Card>
    </main>
  );
}

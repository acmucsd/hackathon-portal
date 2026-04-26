'use client';

import Card from '@/components/Card';
import styles from './page.module.scss';
import Heading from '@/components/Heading';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import TextField from '@/components/TextField';
import Link from 'next/link';
import Alert from '@/components/Alert';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { AuthAPI } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getSession } from '@/lib/actions/session';

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>(undefined);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();

  const onSubmit: SubmitHandler<LoginValues> = async credentials => {
    try {
      await AuthAPI.login(credentials.email, credentials.password);
      router.replace('/');
    } catch (authError) {
      console.error(authError);
      setError(getErrorMessage(authError));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await AuthAPI.loginWithGoogle();
      router.replace('/');
    } catch (authError) {
      // Don't show error if user cancelled the popup
      const errorMessage = getErrorMessage(authError);
      if (
        errorMessage.includes('user-cancelled') ||
        errorMessage.includes('popup-closed-by-user')
      ) {
        return;
      }
      console.error(authError);
      setError(errorMessage);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session.authenticated) {
        router.replace('/');
      }
    };

    checkSession();
  }, [router]);

  return (
    <main className={styles.main}>
      <div className={`${styles.login}`}>
        <Card gap={1} className={styles.loginCard}>
          <Heading centered>Log In</Heading>
          {error ? (
            <Alert marginBottom={0}>
              <p>{error}</p>
            </Alert>
          ) : null}

          <TextField
            variant="vertical"
            id="email"
            label="Email Address"
            error={errors.email}
            formRegister={register('email', {
              required: 'Enter your email',
            })}
            type="email"
            autoComplete="email"
            defaultText="Enter Email Address"
          />
          <TextField
            variant="vertical"
            id="password"
            label="Password"
            error={errors.password}
            formRegister={register('password', {
              required: 'Enter your password',
            })}
            type="password"
            autoComplete="current-password"
            defaultText="Enter Password"
          />
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Login
          </Button>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <Button variant="secondary" onClick={handleGoogleLogin} className={styles.googleButton}>
            <Image src="assets/icons/google-logo.svg" alt="Google logo" width={20} height={20} />
            Login with Google
          </Button>

          <Typography variant="label/small" component="p">
            Don&rsquo;t have an account?{' '}
            <Link href="/register" className="link">
              Sign up!
            </Link>
          </Typography>
          <Link href="/forgot-password" className="link">
            Forgot Password?
          </Link>
        </Card>
      </div>
    </main>
  );
}

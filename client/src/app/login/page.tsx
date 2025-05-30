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
import { login } from './login';
import { CookieType } from '@/lib/types/enums';
import { redirect } from 'next/navigation';
import { getCookie } from 'cookies-next';

interface LoginValues {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();

  const onSubmit: SubmitHandler<LoginValues> = async credentials => {
    // If successful, the page will redirect and the rest of this function will
    // not run
    const error = await login(credentials.email, credentials.password);

    setError(error);
    redirect('/api/logout');
  };

  useEffect(() => {
    const userCookie = getCookie(CookieType.USER);

    // Send the user to the dashboard page if they already have a valid cookie
    if (userCookie) {
      redirect('/');
    }
  }, []);

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
          {/* <Link href="/forgot-password">Forgot your password?</Link> */}
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Login
          </Button>
          <Typography variant="label/small" component="p">
            Don&rsquo;t have an account?{' '}
            <Link href="/register" className="link">
              {' '}
              Sign up!
            </Link>{' '}
          </Typography>
          <Link href="/forgot-password" className="link">
            {' '}
            Forgot Password?
          </Link>{' '}
        </Card>
      </div>
    </main>
  );
}

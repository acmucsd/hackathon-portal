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
import { UserAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getErrorMessage } from '@/lib/utils';

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
      await UserAPI.login(credentials.email, credentials.password);
      router.push('/');
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <main className={styles.main}>
      <div className={`${styles.login}`}>
        <Card gap={1}>
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

          <Link href="/forgot-password">Forgot your password?</Link>

          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Login
          </Button>

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

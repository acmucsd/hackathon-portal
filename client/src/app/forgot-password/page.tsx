'use client';

import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { AuthManager } from '@/lib/managers';
import type { ForgotPasswordRequest } from '@/lib/types/apiRequests';
import { reportError } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import styles from './page.module.scss';

interface ResetPasswordValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ResetPasswordValues>();

  const router = useRouter();

  const onSubmit: SubmitHandler<ForgotPasswordRequest> = req => {
    AuthManager.resetPassword({
      ...req,
      onSuccessCallback: () => {
        router.push(`/check-email?email=${encodeURIComponent(req.email)}`);
      },
      onFailCallback: error => {
        reportError('Error resetting password!', error);
      },
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.register}>
        <Card gap={2}>
          <Heading centered>Reset Password</Heading>

          <TextField
            id="email"
            label="University Email"
            defaultText="Enter your Email"
            error={errors.email}
            formRegister={register('email', {
              required: 'Missing input/field.',
              validate: {
                isValidEmail: value => isEmail(value) || 'Invalid email',
                isEduDomain: value =>
                  value?.endsWith('.edu') ||
                  value?.endsWith('.ca') ||
                  value?.endsWith('.mx') ||
                  'Please enter a university email address.',
              },
            })}
            type="email"
            autoComplete="email"
          />

          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Reset Password
          </Button>
          <Typography variant="body/small" className={styles.loginPrompt}>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              {' '}
              Log In!
            </Link>{' '}
          </Typography>
        </Card>
      </div>
    </main>
  );
}

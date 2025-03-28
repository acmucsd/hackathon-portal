'use client';

import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import { AuthManager } from '@/lib/managers';
import type { UserRegistration } from '@/lib/types/apiRequests';
import type { PrivateProfile } from '@/lib/types/apiResponses';
import { reportError } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import styles from './page.module.scss';

interface RegisterFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const router = useRouter();

  const onSubmit: SubmitHandler<UserRegistration> = userRegistration => {
    AuthManager.register({
      ...userRegistration,
      onSuccessCallback: (user: PrivateProfile) => {
        router.push(`/check-email?email=${encodeURIComponent(user.email)}`);
      },
      onFailCallback: error => {
        reportError('Error with registration!', error);
      },
    });
  };

  return (
    <main className={styles.main}>
      <div className={styles.register}>
        <Card gap={2}>
          <Heading centered>Sign Up</Heading>
          <TextField
            id="firstName"
            label="First Name"
            defaultText="Enter your First Name"
            error={errors.firstName}
            formRegister={register('firstName', {
              required: 'Missing input/field.',
            })}
            type="text"
            autoComplete="given-name"
          />
          <TextField
            id="lastName"
            label="Last Name"
            defaultText="Enter your Last Name"
            error={errors.lastName}
            formRegister={register('lastName', {
              required: 'Missing input/field.',
            })}
            type="text"
            autoComplete="family-name"
          />
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
                  'Please enter a university email address.',
              },
            })}
            type="email"
            autoComplete="email"
          />
          <TextField
            id="password"
            label="Password"
            defaultText="Enter your password"
            error={errors.password}
            formRegister={register('password', {
              required: 'Missing input/field.',
              minLength: {
                value: 8,
                message: 'Minimum 8 characters.',
              },
            })}
            type="password"
            autoComplete="new-password"
          />
          <TextField
            id="confirmPassword"
            label="Confirm Password"
            defaultText="Re-enter your password"
            error={errors.confirmPassword}
            formRegister={register('confirmPassword', {
              required: 'Missing input/field.',
              validate: {
                matchesPassword: value =>
                  value === getValues('password') || 'Passwords do not match',
              },
            })}
            type="password"
            autoComplete="new-password"
          />
          <Button variant="primary" onClick={handleSubmit(onSubmit)}>
            Sign Up
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

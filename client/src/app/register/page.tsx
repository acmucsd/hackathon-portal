'use client';

import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import Typography from '@/components/Typography';
import universities from '../../utils/universities';
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
  university: string;
}

export default function RegisterPage() {
  const {
    register,
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      university: universities[0],
    },
  });

  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterFormValues> = data => {
    console.log(data);
    router.push(`/check-email?email=${encodeURIComponent('placeholder@ucsd.edu')}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.register}>
        <Card gap={2}>
          <Heading centered>Sign Up</Heading>
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="First Name"
            defaultText="Enter your First Name"
            error={errors.firstName}
            formRegister={register('firstName', {
              required: 'Missing input/field.',
            })}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Last Name"
            defaultText="Enter your Last Name"
            error={errors.lastName}
            formRegister={register('lastName', {
              required: 'Missing input/field.',
            })}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="University Email (.edu)"
            defaultText="Enter your Email"
            error={errors.email}
            formRegister={register('email', {
              required: 'Missing input/field.',
              validate: {
                isValidEmail: value => isEmail(value) || 'Invalid email',
                isEduDomain: value =>
                  value?.endsWith('.edu') || 'Please enter an .edu email address.',
              },
            })}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
            label="Password"
            defaultText="Enter your password"
            error={errors.password}
            formRegister={register('password', {
              required: 'Missing input/field.',
              minLength: {
                value: 12,
                message: 'Minimum 12 characters.',
              },
            })}
          />
          <TextField
            id="outlined-basic"
            variant="outlined"
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
          />
          <Controller
            name="university"
            control={control}
            render={({ field }) => (
              <Dropdown
                name="universityOptions"
                ariaLabel="Select an university"
                options={universities}
                value={field.value}
                onChange={field.onChange}
                className={styles.dropdown}
              />
            )}
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

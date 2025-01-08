'use client';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import CloseIcon from '../../../public/assets/icons/close.svg';
import EditIcon from '../../../public/assets/icons/edit.svg';
import { UserAPI } from '@/lib/api';
import { reportError } from '@/lib/utils';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import styles from './page.module.scss';

interface UpdateProfileValues {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfilePage() {
  const size = useWindowSize();
  const isMobile = (size.width ?? 0) <= 870;
  const [editProfile, setEditProfile] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const onSubmit: SubmitHandler<UpdateProfileValues> = async updateProfile => {
    try {
      const updatedUser = await UserAPI.updateCurrentUserProfile(updateProfile);
      setEditProfile(prevState => !prevState);
      reset(updatedUser);
    } catch (error) {
      reportError('Changes failed to save', error);
    }
  };

  const clearFields = () => {
    reset();
    setEditProfile(prevState => !prevState);
  };

  const fetchUser = async () => {
    try {
      const fetchedUser = await UserAPI.getCurrentUser();
      reset(fetchedUser);
    } catch (error) {
      reportError('Cannot find user', error);
      router.push('/login');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.profile}>
        <Card gap={2}>
          <div className={styles.profileHeader}>
            <Heading>Your Profile</Heading>
            {isMobile && editProfile ? (
              <CloseIcon style={{ cursor: 'pointer' }} onClick={() => clearFields()} />
            ) : (
              <EditIcon style={{ cursor: 'pointer' }} onClick={() => clearFields()} />
            )}
          </div>
          <div className={styles.profileContent}>
            <TextField
              variant="horizontal"
              id="firstName"
              label="First Name"
              error={errors.firstName}
              formRegister={register('firstName', {
                required: 'Missing input/field.',
              })}
              type="text"
              autoComplete="given-name"
              disabled={!editProfile}
            />
            <TextField
              variant="horizontal"
              id="lastName"
              label="Last Name"
              error={errors.lastName}
              formRegister={register('lastName', {
                required: 'Missing input/field.',
              })}
              type="text"
              autoComplete="given-name"
              disabled={!editProfile}
            />
            {/* Disabled email change */}
            <TextField
              variant="horizontal"
              id="email"
              label="Email Address"
              error={errors.email}
              formRegister={register('email', {
                required: 'Missing input/field.',
                validate: {
                  isValidEmail: value => isEmail(value) || 'Invalid email',
                  isEduDomain: value =>
                    value?.endsWith('.edu') || 'Please enter an .edu email address.',
                },
              })}
              type="text"
              autoComplete="given-name"
              disabled
            />
          </div>
          {editProfile && (
            <div className={styles.buttonGroup}>
              <Button
                className={styles.discardButton}
                onClick={() => clearFields()}
                variant="tertiary"
              >
                Discard Changes
              </Button>
              <Button
                className={styles.saveButton}
                onClick={handleSubmit(onSubmit)}
                variant="primary"
              >
                Save
              </Button>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}

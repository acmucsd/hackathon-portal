'use client';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import CloseIcon from '../../../public/assets/icons/close.svg';
import EditIcon from '../../../public/assets/icons/edit.svg';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import styles from './page.module.scss';

interface UpdateFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

export default function ProfilePage() {
  const [editProfile, setEditProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 870);
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
    },
  });

  const onSubmit: SubmitHandler<UpdateFormValues> = updateProfile => {
    console.log(updateProfile);
  };

  const clearFields = () => {
    reset();
    setEditProfile(prevState => !prevState);
  };

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
              defaultText="Jane"
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
              defaultText="Doe"
              error={errors.lastName}
              formRegister={register('lastName', {
                required: 'Missing input/field.',
              })}
              type="text"
              autoComplete="given-name"
              disabled={!editProfile}
            />
            <TextField
              variant="horizontal"
              id="email"
              label="Email Address"
              defaultText="janedoe@gmail.com"
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

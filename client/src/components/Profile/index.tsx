'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/Button';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import CloseIcon from '../../../public/assets/icons/close.svg';
import EditIcon from '../../../public/assets/icons/edit.svg';
import { UserAPI } from '@/lib/api';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import isEmail from 'validator/lib/isEmail';
import styles from './style.module.scss';
import logout from './logout';
import showToast from '@/lib/showToast';

interface UpdateProfileValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileClientProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const Profile = ({ user }: ProfileClientProps) => {
  const size = useWindowSize();
  const isMobile = (size.width ?? 0) <= 870;
  const [editProfile, setEditProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    defaultValues: currentUser,
  });

  const onSubmit: SubmitHandler<UpdateProfileValues> = async updateProfile => {
    const updatedUser = await UserAPI.updateCurrentUserProfile(updateProfile);
    if (typeof updatedUser === 'string') {
      showToast('Changes failed to save', updatedUser);
    } else {
      setCurrentUser(updatedUser);
      setEditProfile(prevState => !prevState);
      reset(updatedUser);
    }
  };

  const clearFields = () => {
    reset(currentUser);
    setEditProfile(prevState => !prevState);
  };

  return (
    <main className={styles.main}>
      <div className={styles.profile}>
        <Card gap={2}>
          <div className={styles.profileHeader}>
            <Heading>Your Profile</Heading>
            {isMobile && editProfile ? (
              <CloseIcon className={styles.closeBtn} onClick={() => clearFields()} />
            ) : (
              <EditIcon className={styles.editBtn} onClick={() => clearFields()} />
            )}
            {!editProfile ? (
              <Button variant="tertiary" onClick={() => logout()} className={styles.logoutBtn}>
                Log out
              </Button>
            ) : null}
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
                    value?.endsWith('.edu') ||
                    value?.endsWith('.ca') ||
                    'Please enter a university email address.',
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
};

export default Profile;

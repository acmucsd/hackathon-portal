'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/Button';
import Image from 'next/image';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import CloseIcon from '../../../public/assets/icons/close.svg';
import EditIcon from '../../../public/assets/icons/edit.svg';
import { houseAssets } from '@/lib/constants/houseAssets';
import { UserAPI } from '@/lib/api';
import { useWindowSize } from '@/lib/hooks/useWindowSize';
import isEmail from 'validator/lib/isEmail';
import styles from './style.module.scss';
import logout from './logout';
import showToast from '@/lib/showToast';
import { PrivateProfile } from '@/lib/types/apiResponses';

interface UpdateProfileValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface ProfileCardProps {
  user: PrivateProfile;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const size = useWindowSize();
  const isMobile = (size.width ?? 0) <= 870;
  const [editProfile, setEditProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  const house = houseAssets[user.house];

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
    <Card gap={2}>
      <div className={styles.profileHeader}>
        <Heading>Your Profile</Heading>
        {isMobile && editProfile ? (
          <CloseIcon className={styles.closeBtn} onClick={() => clearFields()} />
        ) : (
          <EditIcon className={styles.editBtn} onClick={() => clearFields()} />
        )}
        {!editProfile ? (
          <Button
            variant="tertiary"
            onClick={() => logout()}
            className={`${styles.logoutBtn} ${user.house === 'UNASSIGNED' && styles.noHouse}`}
          >
            Log out
          </Button>
        ) : null}
      </div>
      <div className={`${styles.profileContent} ${user.house === 'UNASSIGNED' && styles.noHouse}`}>
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
                value?.endsWith('.mx') ||
                'Please enter a university email address.',
            },
          })}
          type="text"
          autoComplete="given-name"
          disabled
        />
        {user.house !== 'UNASSIGNED' && !isMobile && (
          <div className={`${styles.house} ${editProfile && styles.editing}`}>
            <Image src={house.books} alt="Books" quality={100} className={styles.books} />
            <Image src={house.badge} alt="Badge" quality={100} className={styles.badge} />
          </div>
        )}
      </div>
      {editProfile && (
        <div className={styles.buttonGroup}>
          <Button className={styles.discardButton} onClick={() => clearFields()} variant="tertiary">
            Discard Changes
          </Button>
          <Button className={styles.saveButton} onClick={handleSubmit(onSubmit)} variant="primary">
            Save
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ProfileCard;

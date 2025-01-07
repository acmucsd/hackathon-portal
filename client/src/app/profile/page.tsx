'use client';

import Button from '@/components/Button';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import CloseIcon from '../../../public/assets/icons/close.svg';
import EditIcon from '../../../public/assets/icons/edit.svg';
import { UserAPI } from '@/lib/api';
import { CookieService } from '@/lib/services';
import { CookieType } from '@/lib/types/enums';
import { reportError } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import isEmail from 'validator/lib/isEmail';
import styles from './page.module.scss';

interface UpdateProfileValues {
  firstName: string;
  lastName: string;
  email: string;
}

const getUser = async () => {
  const authToken = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);
  const user = await UserAPI.getCurrentUser(authToken);
  return user;
};

export default function ProfilePage() {
  const [editProfile, setEditProfile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 870);
    CookieService.setClientCookie(
      CookieType.ACCESS_TOKEN,
      'eyJhbGciOiJSUzI1NiIsImtpZCI6ImMwYTQwNGExYTc4ZmUzNGM5YTVhZGU5NTBhMjE2YzkwYjVkNjMwYjMiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiQW5nZWxhIEh1IiwiaXNzIjoiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL2hhY2thdGhvbi1wb3J0YWwtMmJlZWEiLCJhdWQiOiJoYWNrYXRob24tcG9ydGFsLTJiZWVhIiwiYXV0aF90aW1lIjoxNzM2MjQ2NDQ2LCJ1c2VyX2lkIjoiUmxmN0pHTFlHVFlxZ21xUzI5S0FwOXI5dTBlMiIsInN1YiI6IlJsZjdKR0xZR1RZcWdtcVMyOUtBcDlyOXUwZTIiLCJpYXQiOjE3MzYyNDY0NDYsImV4cCI6MTczNjI1MDA0NiwiZW1haWwiOiJhNGh1QHVjc2QuZWR1IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiYTRodUB1Y3NkLmVkdSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.nrvedJqQi1C-5Tt2uOmsMYGe0EIpNoGZ_yzhDB_j_j9NLPkW1qbPRUsXKRrzDdKSve1I--MoT-eP-OXumQ4YAJZV5nLJ_MtLn_udU5MCvZ9S-kYgAKyTVbM5mqkKVK060lOxBxEJRaP7v2nsBQa1f4LuMpda5ARuUlqmM5QSd9cyNcaNkB18csC3Osj8egTeB_zFFXsNW7i6ZCu3wr7M4ETWuV3D2OW-16pOQLvxrkIwlWa8Ls8FNA7JayKli4H_RzjRyIy2DoxNZ6FvIEEgGI_gBDGtmIvR4g_i9hgEnotOIDB1G6t76L_9Gkv3Q13RosJ5rXWBdO-dyiIn5_1hAQ'
    );
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser();
        console.log(fetchedUser);
        reset(fetchedUser);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

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
    const authToken = CookieService.getClientCookie(CookieType.ACCESS_TOKEN);

    try {
      const updatedUser = await UserAPI.updateCurrentUserProfile(authToken, updateProfile);
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

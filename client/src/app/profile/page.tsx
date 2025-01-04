'use client';

import Card from '@/components/Card';
import Heading from '@/components/Heading';
import TextField from '@/components/TextField';
import Typography from '@/components/Typography';
import EditIcon from '../../../public/assets/icons/edit.svg';
import { useState } from 'react';
import styles from './page.module.scss';

export default function ProfilePage() {
  const [editProfile, setEditProfile] = useState(false);

  return (
    <main className={styles.main}>
      <div className={styles.profile}>
        <Card gap={2}>
          <div className={styles.profileHeader}>
            <Heading>Your Profile</Heading>
            <EditIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setEditProfile(prevState => !prevState)}
            />
          </div>
          <div className={styles.profileContent}>
            <Typography variant="label/medium">First Name</Typography>
            <Typography variant="label/medium">Last Name</Typography>
            <Typography variant="label/medium">Email Address</Typography>
          </div>
        </Card>
      </div>
    </main>
  );
}

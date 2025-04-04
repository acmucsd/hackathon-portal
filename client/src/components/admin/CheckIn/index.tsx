'use client';

import Heading from '@/components/Heading';
import Scanner from '../Scanner';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './style.module.scss';
import { useCallback, useState } from 'react';
import { getUser } from '@/lib/api/UserAPI';
import showToast from '@/lib/showToast';
import { PublicProfile } from '@/lib/types/apiResponses';
import Typography from '@/components/Typography';
import Image from 'next/image';

interface CheckInProps {}

const CheckIn = ({}: CheckInProps) => {
  const [scannedUser, setScannedUser] = useState<PublicProfile | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleScan = useCallback(async (data: string) => {
    setSuccess(null);
    setScannedUser(null);
    const user = await getUser(data);
    if (typeof user === 'string') {
      showToast('Invalid QR Code.', user);
      new Audio('/assets/sounds/bad user (TEMP).wav').play();
      setSuccess(false);
      return;
    }
    setScannedUser(user);
    setSuccess(true);
    new Audio('/assets/sounds/scan-success (TEMPORARY!!!).mp3').play();
  }, []);

  return (
    <Card gap={1.5}>
      <Heading>QR Code Check-in</Heading>
      <Scanner onScan={handleScan} />
      <Button variant="secondary" href="/admin">
        Close
      </Button>
      {success !== null ? (
        success ? (
          <Image
            src="/assets/icons/success.svg"
            alt="Success"
            width={80}
            height={80}
            className={styles.icon}
          />
        ) : (
          <Image
            src="/assets/icons/fail.svg"
            alt="Fail"
            width={80}
            height={80}
            className={styles.icon}
          />
        )
      ) : null}
      {scannedUser ? (
        <div className={styles.info}>
          <Typography variant="headline/heavy/medium">
            {scannedUser.firstName} {scannedUser.lastName}
          </Typography>
          <Typography variant="body/medium">Event name</Typography>
          <Typography variant="body/medium">Time</Typography>
        </div>
      ) : null}
    </Card>
  );
};

export default CheckIn;

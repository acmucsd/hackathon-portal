'use client';

import Heading from '@/components/Heading';
import Scanner from '../Scanner';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './style.module.scss';
import { useCallback, useEffect, useState } from 'react';
import { getUser } from '@/lib/api/UserAPI';
import showToast from '@/lib/showToast';
import { PublicEvent, PublicProfile } from '@/lib/types/apiResponses';
import Typography from '@/components/Typography';
import Image from 'next/image';
import Dropdown from '@/components/Dropdown';
import { attendEvent } from '@/lib/api/AdminAPI';
import { reportError } from '@/lib/utils';

interface CheckInProps {
  token: string;
  events: PublicEvent[];
}

const CheckIn = ({ token, events }: CheckInProps) => {
  const [scannedUser, setScannedUser] = useState<PublicProfile | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [event, setEvent] = useState<PublicEvent | undefined>(() =>
    events.find(
      event => new Date(event.startTime) <= new Date() && new Date() < new Date(event.endTime)
    )
  );
  const [scanTime, setScanTime] = useState<Date | null>(null);

  const handleScan = useCallback(
    async (data: string) => {
      setSuccess(null);
      setScannedUser(null);
      setScanTime(null);
      if (!event) {
        showToast('Select an event first.');
        setSuccess(false);
        return;
      }
      const user = await getUser(data);
      if (typeof user === 'string') {
        showToast('Invalid QR Code.', user);
        new Audio('/assets/sounds/bad user (TEMP).wav').play();
        setSuccess(false);
        return;
      }
      setScannedUser(user);
      try {
        await attendEvent(token, user.id, event.uuid);
        setScanTime(new Date());
        setSuccess(true);
        new Audio('/assets/sounds/scan-success (TEMPORARY!!!).mp3').play();
      } catch (error) {
        reportError('Failed to check user in', error);
        setSuccess(false);
        new Audio('/assets/sounds/already checked in (FINAL).wav').play();
      }
    },
    [token, event]
  );

  return (
    <Card gap={1.5}>
      <Heading>QR Code Check-in</Heading>
      <Dropdown
        ariaLabel="Select an event"
        name="event"
        value={event?.uuid ?? ''}
        onChange={eventId => setEvent(events.find(evevent => evevent.uuid === eventId))}
        options={[
          { value: '', display: 'Select an event' },
          ...events.map(event => ({ value: event.uuid, display: event.name })),
        ]}
      />
      {event ? <Scanner onScan={handleScan} /> : null}
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
          <Typography variant="body/medium">{event?.name}</Typography>
          <Typography variant="body/medium">
            {scanTime?.toLocaleTimeString('en-US', { timeStyle: 'long' })}
          </Typography>
        </div>
      ) : null}
    </Card>
  );
};

export default CheckIn;

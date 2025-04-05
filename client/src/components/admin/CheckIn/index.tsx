'use client';

import Heading from '@/components/Heading';
import Scanner from '../Scanner';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './style.module.scss';
import { useCallback, useMemo, useRef, useState } from 'react';
import { getUser } from '@/lib/api/UserAPI';
import showToast from '@/lib/showToast';
import { PrivateProfile, PublicEvent, PublicProfile } from '@/lib/types/apiResponses';
import Typography from '@/components/Typography';
import Image from 'next/image';
import Dropdown from '@/components/Dropdown';
import { attendEvent } from '@/lib/api/AdminAPI';
import { reportError } from '@/lib/utils';
import { Autocomplete, TextField } from '@mui/material';
import { ApplicationStatus } from '@/lib/types/enums';

interface CheckInProps {
  token: string;
  events: PublicEvent[];
  users: PrivateProfile[];
}

interface UserOption {
  label: string;
  id: string;
}

const CheckIn = ({ token, events, users }: CheckInProps) => {
  const [scannedUser, setScannedUser] = useState<PublicProfile | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);
  const [event, setEvent] = useState<PublicEvent | undefined>(() =>
    events.find(
      event => new Date(event.startTime) <= new Date() && new Date() < new Date(event.endTime)
    )
  );
  const [scanTime, setScanTime] = useState<Date | null>(null);
  const [searchedUser, setSearchedUser] = useState<UserOption | null>(null);

  const successAudioRef = useRef<HTMLAudioElement>(null);
  const badUserAudioRef = useRef<HTMLAudioElement>(null);
  const checkinFailAudioRef = useRef<HTMLAudioElement>(null);

  const userOptions = useMemo(
    () =>
      users
        .filter(user => user.applicationStatus === ApplicationStatus.CONFIRMED)
        .map(user => ({
          label: `${user.firstName} ${user.lastName}`,
          id: user.id,
        })),
    [users]
  );

  const handleNameCheckin = useCallback(async () => {
    if (searchedUser === null) {
      showToast('Please select a user first.');
      setSuccess(false);
      return;
    }
    handleScan(searchedUser.id);
  }, [token, event, searchedUser]);

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
        setSuccess(false);
        if (badUserAudioRef.current) {
          badUserAudioRef.current.currentTime = 0;
          badUserAudioRef.current.play();
        }
        return;
      }
      setScannedUser(user);
      try {
        await attendEvent(token, user.id, event.uuid);
        setScanTime(new Date());
        setSuccess(true);
        showToast(`${user.firstName} ${user.lastName} checked in!`, `Checked into ${event.name}`);
        if (successAudioRef.current) {
          successAudioRef.current.currentTime = 0;
          successAudioRef.current.play();
        }
      } catch (error) {
        reportError('Failed to check user in', error);
        setSuccess(false);
        if (checkinFailAudioRef.current) {
          checkinFailAudioRef.current.currentTime = 0;
          checkinFailAudioRef.current.play();
        }
      }
    },
    [token, event]
  );

  return (
    <Card gap={1.5}>
      <audio src="/assets/sounds/scan-success (TEMPORARY!!!).mp3" ref={successAudioRef}></audio>
      <audio src="/assets/sounds/bad user (TEMP).wav" ref={badUserAudioRef}></audio>
      <audio src="/assets/sounds/already checked in (FINAL).wav" ref={checkinFailAudioRef}></audio>
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
      {event ? (
        <>
          <Autocomplete
            disablePortal
            options={userOptions}
            renderInput={params => <TextField label="Search by name..." {...params} />}
            value={searchedUser}
            onChange={(event, newValue) => setSearchedUser(newValue)}
            className={styles.autocomplete}
            sx={{
              '& .MuiOutlinedInput-notchedOutline': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
              },
              '& .MuiFormLabel-root': {
                color: '#a1acbd',
              },
              '& .MuiInputBase-root': {
                color: '#a1acbd',
              },
              '& .MuiSvgIcon-root': {
                fill: 'white',
              },
            }}
          />
          <Button onClick={handleNameCheckin}>Check-in by name</Button>
        </>
      ) : null}
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

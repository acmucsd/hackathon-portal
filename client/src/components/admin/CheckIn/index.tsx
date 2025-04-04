'use client';

import Heading from '@/components/Heading';
import Scanner from '../Scanner';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './style.module.scss';
import { useCallback } from 'react';

interface CheckInProps {}

const CheckIn = ({}: CheckInProps) => {
  const handleScan = useCallback((data: string) => {
    console.log(data);
    new Audio('/assets/sounds/scan-success (TEMPORARY!!!).mp3').play();
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  }, []);

  return (
    <Card gap={1.5}>
      <Heading>QR Code Check-in</Heading>
      <Scanner onScan={handleScan} />
      <Button variant="secondary" href="/admin">
        Close
      </Button>
    </Card>
  );
};

export default CheckIn;

'use client';

import Heading from '@/components/Heading';
import Scanner from '../Scanner';
import Card from '@/components/Card';
import Button from '@/components/Button';
import styles from './style.module.scss';

interface CheckInProps {}

const CheckIn = ({}: CheckInProps) => {
  return (
    <Card gap={1.5}>
      <Heading>QR Code Check-in</Heading>
      <Scanner
        onScan={data => {
          console.log(data);
          new Audio('/assets/sounds/scan-success (TEMPORARY!!!).mp3').play();
        }}
      />
      <Button variant="secondary" href="/admin">
        Close
      </Button>
    </Card>
  );
};

export default CheckIn;

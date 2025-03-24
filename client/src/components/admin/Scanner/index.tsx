'use client';

import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import styles from './style.module.scss';

interface ScannerProps {
  onScan: (data: string) => void;
}

const Scanner = ({ onScan }: ScannerProps) => {
  const video = useRef<HTMLVideoElement>(null);
  const scanner = useRef<QrScanner>(null);
  const lastScanned = useRef('');

  useEffect(() => {
    if (video.current && !scanner.current) {
      scanner.current = new QrScanner(
        video.current,
        result => {
          // Prevent scanning the same QR code again
          if (lastScanned.current !== result.data) {
            onScan(result.data);
            lastScanned.current = result.data;
          }
        },
        {}
      );
    }
    return () => {
      scanner.current?.destroy();
    };
  }, [onScan]);

  return (
    <div className={styles.wrapper}>
      <video className={styles.video} ref={video} />
      <svg xmlns="http://www.w3.org/2000/svg" className={styles.svg}>
        <circle cx="50" cy="50" r="40" stroke="currentColor" />
      </svg>
    </div>
  );
};

export default Scanner;

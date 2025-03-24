'use client';

import QrScanner from 'qr-scanner';
import { useEffect, useRef } from 'react';
import styles from './style.module.scss';

interface ScannerProps {
  onScan: (data: string) => void;
}

const Scanner = ({ onScan }: ScannerProps) => {
  const scanner = useRef<QrScanner | null>(null);

  useEffect(() => {
    return () => {
      scanner.current?.destroy();
    };
  }, []);

  return (
    <div className={styles.wrapper}>
      <video
        className={styles.video}
        ref={video => {
          if (video && !scanner.current) {
            scanner.current = new QrScanner(
              video,
              result => {
                onScan(result.data);
              },
              {}
            );
            scanner.current.start();
          }
        }}
      />
    </div>
  );
};

export default Scanner;

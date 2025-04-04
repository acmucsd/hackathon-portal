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
  const [videoSize, setVideoSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const videoElem = video.current;
    if (videoElem && !scanner.current) {
      scanner.current = new QrScanner(
        videoElem,
        result => {
          // Prevent scanning the same QR code again
          if (lastScanned.current !== result.data) {
            onScan(result.data);
            lastScanned.current = result.data;
          }
        },
        {}
      );
      scanner.current.start().then(() => {
        setVideoSize({ width: videoElem.videoWidth, height: videoElem.videoHeight });
      });
    }
    return () => {
      scanner.current?.destroy();
      scanner.current = null;
    };
  }, [onScan]);

  return (
    <div className={styles.wrapper}>
      <video className={styles.video} ref={video} />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        viewBox={`0 0 ${videoSize.width} ${videoSize.height}`}
      >
        <circle
          cx={videoSize.width / 2}
          cy={videoSize.height / 2}
          r={Math.min(videoSize.width / 2, videoSize.height / 2) * (2 / 3)}
        />
      </svg>
    </div>
  );
};

export default Scanner;

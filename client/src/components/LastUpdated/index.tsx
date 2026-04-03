'use client';

import { useState, useEffect } from 'react';
import styles from './style.module.scss';

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LastUpdated() {
  const [date] = useState(() => new Date());
  const [label, setLabel] = useState('0m ago');

  useEffect(() => {
    const id = setInterval(() => setLabel(timeAgo(date)), 1000);
    return () => clearInterval(id);
  }, [date]);

  return <p className={styles.lastUpdated}>Last updated: {label}</p>;
}

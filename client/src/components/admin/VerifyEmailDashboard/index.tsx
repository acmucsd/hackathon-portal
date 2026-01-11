'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import * as AdminAPI from '@/lib/api/AdminAPI';
import showToast from '@/lib/showToast';
import styles from './style.module.scss';

interface VerifyEmailDashboardProps {
  accessToken: string;
}

const VerifyEmailDashboard = ({ accessToken }: VerifyEmailDashboardProps) => {
  const [email, setEmail] = useState('');
  const [verificationLink, setVerificationLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetVerificationLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast('Error', 'Please enter an email address');
      return;
    }

    setIsLoading(true);
    setVerificationLink('');

    try {
      const link = await AdminAPI.getEmailVerificationLink(accessToken, email);
      setVerificationLink(link);
      showToast('Success', 'Email verification link generated!');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get verification link';
      showToast('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!verificationLink) return;

    try {
      await navigator.clipboard.writeText(verificationLink);
      showToast('Success', 'Link copied to clipboard!');
    } catch (error) {
      showToast('Error', 'Failed to copy to clipboard');
    }
  };

  return (
    <div className={styles.container}>
      <Card gap={2}>
        <Heading>Send Email Verification Link</Heading>
        <Typography variant="body/medium">
          Enter a user&apos;s email address to generate an email verification link. This link can be
          sent to users who need to verify their email.
        </Typography>

        <form onSubmit={handleGetVerificationLink} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">
              <Typography variant="body/medium">Email Address</Typography>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              className={styles.input}
              required
            />
          </div>

          <Button submit disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate Verification Link'}
          </Button>
        </form>

        {verificationLink && (
          <div className={styles.resultSection}>
            <Typography variant="body/medium" className={styles.resultLabel}>
              Verification Link:
            </Typography>
            <div className={styles.linkContainer}>
              <input type="text" value={verificationLink} readOnly className={styles.linkInput} />
              <Button onClick={handleCopyLink} variant="secondary">
                Copy Link
              </Button>
            </div>
            <Typography variant="label/small" className={styles.note}>
              Share this link with the user to verify their email address.
            </Typography>
          </div>
        )}

        <Button href="/admin" variant="tertiary">
          Back to Admin Dashboard
        </Button>
      </Card>
    </div>
  );
};

export default VerifyEmailDashboard;

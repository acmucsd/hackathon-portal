'use client';

import { useState } from 'react';
import Card from '@/components/Card';
import Heading from '@/components/Heading';
import Typography from '@/components/Typography';
import Button from '@/components/Button';
import * as AdminAPI from '@/lib/api/AdminAPI';
import showToast from '@/lib/showToast';
import styles from './style.module.scss';

interface ResetPasswordDashboardProps {
  accessToken: string;
}

const ResetPasswordDashboard = ({ accessToken }: ResetPasswordDashboardProps) => {
  const [email, setEmail] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGetResetLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      showToast('Error', 'Please enter an email address');
      return;
    }

    setIsLoading(true);
    setResetLink('');

    try {
      const link = await AdminAPI.getPasswordResetLink(accessToken, email);
      setResetLink(link);
      showToast('Success', 'Password reset link generated!');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || 'Failed to get password reset link';
      showToast('Error', message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (!resetLink) return;

    try {
      await navigator.clipboard.writeText(resetLink);
      showToast('Success', 'Link copied to clipboard!');
    } catch (error) {
      showToast('Error', 'Failed to copy to clipboard');
    }
  };

  return (
    <div className={styles.container}>
      <Card gap={2}>
        <Heading>Generate Password Reset Link</Heading>
        <Typography variant="body/medium">
          Enter a user&apos;s email address to generate a password reset link. This link can be sent
          to users who need to reset their password.
        </Typography>

        <form onSubmit={handleGetResetLink} className={styles.form}>
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
            {isLoading ? 'Generating...' : 'Generate Reset Link'}
          </Button>
        </form>

        {resetLink && (
          <div className={styles.resultSection}>
            <Typography variant="body/medium" className={styles.resultLabel}>
              Password Reset Link:
            </Typography>
            <div className={styles.linkContainer}>
              <input type="text" value={resetLink} readOnly className={styles.linkInput} />
              <Button onClick={handleCopyLink} variant="secondary">
                Copy Link
              </Button>
            </div>
            <Typography variant="label/small" className={styles.note}>
              Share this link with the user to reset their password. The link will expire after a
              certain period.
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

export default ResetPasswordDashboard;

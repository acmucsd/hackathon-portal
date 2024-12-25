// import styles from './page.module.scss';
// import Image from 'next/image';

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       <div>
//         <Image src="/acm-logo.png" width={100} height={100} alt="ACM Logo" />
//       </div>
//       <div>
//         <h1>Welcome to ACM&apos;s static site template!</h1>
//       </div>
//     </main>
//   );
// }

// dummy page to test login with email + password
"use client";

import { useState } from 'react';
import { login } from '@/firebase/FirebaseService';
import styles from './page.module.scss';
import Image from 'next/image';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userCredential = await login(email, password);
      if (userCredential) {
        // Successful login, handle success (e.g., redirect to another page)
        console.log('Logged in successfully', userCredential);
      }
    } catch (error) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div>
        <Image src="/acm-logo.png" width={100} height={100} alt="ACM Logo" />
      </div>
      <div>
        <h1>Welcome to ACM&apos;s static site template!</h1>
      </div>

      <div className={styles.loginContainer}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </main>
  );
}

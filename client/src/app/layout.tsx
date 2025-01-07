import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import '@/styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import styles from './layout.module.scss';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['200', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'DiamondHacks 2025',
  description: "ACM at UCSD's annual hackathon",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <ToastContainer />
        <Navbar />
        <main className={styles.main}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

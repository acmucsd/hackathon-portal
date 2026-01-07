import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import '@/styles/globals.scss';
import 'react-toastify/dist/ReactToastify.css';
import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import { getCookie } from '@/lib/services/CookieService';
import { CookieType } from '@/lib/types/enums';
import { PrivateProfile } from '@/lib/types/apiResponses';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['200', '400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'DiamondHacks 2026',
  description: "ACM at UCSD's annual hackathon",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let user: PrivateProfile | undefined;
  try {
    user = JSON.parse(await getCookie(CookieType.USER));
  } catch {}

  return (
    <html lang="en">
      <body className={dmSans.className}>
        <ToastContainer />
        <Navbar user={user} />
        {children}
        <Footer />
      </body>
    </html>
  );
}

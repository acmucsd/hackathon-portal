'use client';

import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import Typography from '../Typography';
import Image from 'next/image';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { SwipeableDrawer } from '@mui/material';
import { PrivateProfile } from '@/lib/types/apiResponses';
import PersonIcon from '@/../public/assets/icons/person.svg';

interface LinkMetadata {
  name: string;
  href: string;
  external?: boolean;
}

const baseLinks: LinkMetadata[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Schedule', href: '/schedule' },
  { name: 'Resources', href: '/resources' },
  // { name: 'Hacker Guide', href: 'http://acmurl.com/diamondhacks25-guide', external: true },
];

const MOBILE_BREAKPOINT = 870; // Matches $breakpoint-md from vars.scss

interface NavbarProps {
  user?: PrivateProfile;
}
export default function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const links =
    user?.accessType == 'ADMIN' ? [...baseLinks, { name: 'Admin', href: '/admin' }] : baseLinks;

  useEffect(() => {
    // Close mobile menu when screen gets larger than mobile breakpoint
    const handleResize = () => {
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <div className={`${styles.container} `}>
        <Link href="/" className={styles.logo}>
          <Image src="/assets/acm-logo.png" alt="ACM Logo" width={48} height={48} />
          <Typography variant="body/large" className={styles.logoText}>
            <b>diamond</b>
            <br />
            hacks
          </Typography>
        </Link>
        {user ? (
          <>
            <Typography variant="body/large" className={styles.desktopLinks}>
              {links.map(link => (
                <Link
                  href={link.href}
                  className={styles.link}
                  onClick={onLinkClick}
                  key={link.name}
                  rel={link.external ? 'noopener noreferrer' : undefined}
                  target={link.external ? '_blank' : undefined}
                >
                  {link.name}
                </Link>
              ))}
            </Typography>
            <div className={styles.flex} />
            <Typography variant="body/large" className={styles.desktopLinks}>
              <Link href="/profile" className={styles.link} onClick={onLinkClick}>
                <PersonIcon aria-hidden /> {user.firstName} {user.lastName}
              </Link>
            </Typography>
            <div className={styles.mobileIcons}>
              <div className={`${styles.menuIcon} ${mobileMenuOpen ? '' : styles.hidden}`}>
                <CloseIcon onClick={() => setMobileMenuOpen(false)} />
              </div>
              <div className={`${styles.menuIcon} ${mobileMenuOpen ? styles.hidden : ''}`}>
                <MenuIcon onClick={() => setMobileMenuOpen(true)} />
              </div>
            </div>
          </>
        ) : null}
      </div>
      {user ? (
        <SwipeableDrawer
          anchor="top"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          onOpen={() => setMobileMenuOpen(true)}
        >
          <div className={styles.mobileMenu}>
            {links.map(link => (
              <Link href={link.href} className={styles.link} onClick={onLinkClick} key={link.name}>
                {link.name}
              </Link>
            ))}
            <Link href="/profile" className={styles.link} onClick={onLinkClick}>
              <PersonIcon aria-hidden /> {user.firstName} {user.lastName}
            </Link>
          </div>
        </SwipeableDrawer>
      ) : null}
    </>
  );
}

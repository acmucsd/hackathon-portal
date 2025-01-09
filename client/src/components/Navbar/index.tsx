'use client';

import { useEffect, useState } from 'react';
import styles from './style.module.scss';
import Typography from '../Typography';
import Image from 'next/image';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { SwipeableDrawer } from '@mui/material';

interface LinkMetadata {
  name: string;
  href: string;
}

const links: LinkMetadata[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Application', href: '/apply' },
];

const MOBILE_BREAKPOINT = 870; // Matches $breakpoint-md from vars.scss

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onLinkClick = () => {
    setMobileMenuOpen(false);
  };

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
        <Typography variant="body/large" className={styles.desktopLinks}>
          {links.map(link => (
            <Link href={link.href} className={styles.link} onClick={onLinkClick} key={link.name}>
              {link.name}
            </Link>
          ))}
        </Typography>
        <div className={styles.flex} />
        <div className={styles.mobileIcons}>
          <div className={`${styles.menuIcon} ${mobileMenuOpen ? '' : styles.hidden}`}>
            <CloseIcon onClick={() => setMobileMenuOpen(false)} />
          </div>
          <div className={`${styles.menuIcon} ${mobileMenuOpen ? styles.hidden : ''}`}>
            <MenuIcon onClick={() => setMobileMenuOpen(true)} />
          </div>
        </div>
      </div>
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
        </div>
      </SwipeableDrawer>
    </>
  );
}

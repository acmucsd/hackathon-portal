import Typography from '@/components/Typography';
import Image from 'next/image';
import { ComponentType, Fragment, ReactNode } from 'react';
import styles from './style.module.scss';

import type { Resource } from '../../sections/Resources/resources';
import Link from 'next/link';

interface ResourceCardProps {
  resource: Resource;
  className?: string;
  borderless?: boolean;
  hideInfo?: boolean;
  interactive?: boolean;
}

const ResourceCard = ({ resource, className, borderless, hideInfo }: ResourceCardProps) => {
  const { title, link, resource_type, cover_image } = resource;

  const Component = 'div';

  return (
    <>
      <Component
        data-community={'General'}
        data-disabled={borderless}
        className={`${styles.container} ${borderless ? '' : styles.bordered} ${className || ''} `}
      >
        <div className={styles.image}>
          <Image
            src={cover_image}
            alt={`${resource.title} cover image`}
            style={{ objectFit: 'cover' }}
            sizes="20rem"
            fill
          />
        </div>
        {!hideInfo ? (
          <div className={styles.info}>
            <div className={styles.infoText}>
              <Typography
                variant="body/medium"
                style={{ fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {title}
              </Typography>
              <Link href={link} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {link}
              </Link>
            </div>
          </div>
        ) : null}
      </Component>
    </>
  );
};

export default ResourceCard;

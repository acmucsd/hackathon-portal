import Carousel  from '../Carousel';
import Typography from '@/components/Typography';

import DiamondFriends from '@/../../public/assets/diamond-friends.svg';
import Link from 'next/link';
import type { ReactNode } from 'react';
import ResourceCard from '../ResourceCard';
import styles from './style.module.scss';
import type { Resource } from '../../sections/Resources/resources';

interface ResourceCarousel {
  title: string | ReactNode;
  titleClassName?: string;
  resources: Resource[];
  placeholder: string;
  className?: string;
}

const ResourceCarousel = ({
  title,
  resources,
  titleClassName,
  placeholder,
  className = '',
}: ResourceCarousel) => {

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles.header}>
        <div className={styles.headerText}>
          <Typography variant="headline/heavy/small" className={titleClassName}>
            {title}
          </Typography>
        </div>
        <Link
          className={styles.viewToggle}
          href={`/TOIMPLEMENT`}
        >
          See all resources &gt;
        </Link>
      </div>
      {resources.length > 0 ? (
        <Carousel>
          {resources.map(resource => (
            <ResourceCard
              className={styles.card}
              key={resource.title}
              resource={resource}
            />
          ))}
        </Carousel>
      ) : (
        <div className={styles.noEvents}>
          <DiamondFriends />
          <Typography variant="label/medium">{placeholder}</Typography>
        </div>
      )}
    </div>
  );
};

export default ResourceCarousel;

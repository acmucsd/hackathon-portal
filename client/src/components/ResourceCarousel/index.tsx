import Carousel from '../Carousel';
import Typography from '@/components/Typography';

import type { ReactNode } from 'react';
import ResourceCard from '../ResourceCard';
import styles from './style.module.scss';
import type { Resource } from '@/app/resources/resources';

interface ResourceCarousel {
  title: string | ReactNode;
  titleClassName?: string;
  resources: Resource[];
  className?: string;
}

const ResourceCarousel = ({
  title,
  resources,
  titleClassName,
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
      </div>
      <Carousel>
        {resources.map(resource => (
          <ResourceCard className={styles.card} key={resource.title} resource={resource} />
        ))}
      </Carousel>
    </div>
  );
};

export default ResourceCarousel;

import Typography from '@/components/Typography';
import DiamondFriends from '@/../../public/assets/diamond-friends.svg';

import styles from './page.module.scss';
import ResourceCard from '@/components/ResourceCard';
import type { Resource } from '../../sections/Resources/resources';
import { ReactNode } from 'react';

interface ResourcesAllProps {
  title: string | ReactNode;
  titleClassName?: string;
  resources: Resource[];
  placeholder: string;
  className?: string;
}

const ResourcesAll = ({ title, resources, placeholder, className = '' }: ResourcesAllProps) => {
  return (
    <main className={styles.main}>
      <Typography variant="headline/heavy/small">{title}</Typography>
      {resources.length > 0 ? (
        <div className={styles.wrapper}>
          {resources.map(resource => (
            <ResourceCard className={styles.card} key={resource.title} resource={resource} />
          ))}
        </div>
      ) : (
        <div className={styles.noEvents}>
          <DiamondFriends />
          <Typography variant="label/medium">{placeholder}</Typography>
        </div>
      )}
    </main>
  );
};

export default ResourcesAll;

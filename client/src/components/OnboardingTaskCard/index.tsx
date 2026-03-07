import Image from 'next/image';
import Button from '../Button';
import Typography from '../Typography';
import { OnboardingTask } from '../Dashboard/onboardingTasks';
import styles from './style.module.scss';

interface OnboardingTaskCardProps {
  task: OnboardingTask;
  done?: boolean;
}

const OnboardingTaskCard = ({ task, done = false }: OnboardingTaskCardProps) => {
  const { image, imageAlt, title, href, buttonLabel, formType, variant, openNewTab } = task;
  const isDone = !!formType && done;

  return (
    <div className={styles.onboardingTaskCard}>
      <Image className={styles.onboardingImage} src={image} alt={imageAlt} />
      <Typography variant="body/large" component="h3">
        {title}
      </Typography>
      <Button
        href={isDone ? undefined : href}
        disabled={isDone}
        variant={isDone ? undefined : (variant ?? 'primary')}
        className={isDone ? styles.successButton : ''}
        openNewTab={openNewTab}
      >
        {isDone ? 'All Done!' : buttonLabel}
      </Button>
    </div>
  );
};

export default OnboardingTaskCard;

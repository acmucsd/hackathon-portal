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
  const {
    image,
    imageAlt,
    title,
    subtitle,
    href,
    buttonLabel,
    formType,
    variant,
    openNewTab,
    required,
  } = task;
  const isDone = !!formType && done;

  return (
    <div className={`${styles.onboardingTaskCard} ${!isDone ? styles.notDone : ''}`}>
      <span className={required ? styles.badgeRequired : styles.badgeOptional}>
        {required ? 'Required' : 'Optional'}
      </span>
      <Image className={styles.onboardingImage} src={image} alt={imageAlt} />
      <Typography className={styles.onboardingTitle} variant="body/large" component="h3">
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body/small" component="p">
          {subtitle}
        </Typography>
      )}
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

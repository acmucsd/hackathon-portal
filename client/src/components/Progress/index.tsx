import styles from './style.module.scss';
import CheckIcon from '@/../public/assets/icons/check-small.svg';

interface ProgressProps {
  steps: string[];
  step: number;
}

const Progress = ({ steps, step }: ProgressProps) => {
  return (
    <div className={styles.bar}>
      <div className={styles.blueBar} style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
      {steps.map((stepName, i) => (
        <div className={styles.step} key={i} style={{ left: `${(i / (steps.length - 1)) * 100}%` }}>
          <div className={`${styles.ball} ${i <= step ? styles.blueBall : ''}`}>
            {i < step ? <CheckIcon aria-label="Step completed:" /> : null}
          </div>
          <div className={styles.name}>{stepName}</div>
        </div>
      ))}
    </div>
  );
};

export default Progress;

import styles from './style.module.scss';

interface StatusTagProps {
  status: string;
  variant?: string;
}

const StatusTag = ({ status, variant = 'pending' }: StatusTagProps) => (
  <span className={`${styles.status} ${styles[variant]}`}>{status}</span>
);

export default StatusTag;

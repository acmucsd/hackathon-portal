import Typography from '@/components/Typography';
import { CircularProgress } from '@mui/material';
import styles from './style.module.scss';

interface ApplicationCountProps {
  pendingApps: number;
  totalApps: number;
}

const ApplicationCount = ({ pendingApps, totalApps }: ApplicationCountProps) => {
  const progress = (totalApps - pendingApps / totalApps) * 100;

  return (
    <div className={styles.container}>
      <CircularProgress
        size="250px"
        variant="determinate"
        value={progress}
        sx={{
          color: '#DFE2EB',
          thickness: 5,
          borderRadius: '50%',
          boxShadow: `inset 0 0 0 21px #9ECAFF`,
        }}
      />
      <div className={styles.info}>
        <Typography variant="headline/heavy/large">{pendingApps}</Typography>
        <Typography variant="label/small">of {totalApps} applications pending review</Typography>
      </div>
    </div>
  );
};

export default ApplicationCount;

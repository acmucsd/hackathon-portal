import { useState } from 'react';
import Typography from '@/components/Typography';
import styles from './style.module.scss';

interface ToggleProps {
  onToggle?: (state: boolean) => void;
  label?: string;
  checked?: boolean;
}

const ToggleSwitch = ({ onToggle, label, checked = false }: ToggleProps) => {
  const [isOn, setIsOn] = useState(checked);

  const toggle = () => {
    setIsOn(!isOn);
    if (onToggle) {
      onToggle(!isOn);
    }
  };

  return (
    <label className={styles.container}>
      {label && <Typography variant="label/medium">{label}</Typography>}
      <input
        type="checkbox"
        checked={isOn}
        onChange={toggle}
        style={{ opacity: '0', position: 'absolute' }}
      />
      <div className={`${styles.roundedBackground} ${isOn ? styles.onBackground : ''}`}>
        <div className={`${styles.circle} ${isOn ? styles.moveCircle : ''}`}></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;

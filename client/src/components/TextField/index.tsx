import Typography from '../Typography';
import styles from './style.module.scss';
import { PropsWithChildren } from 'react';

interface TextFieldProps {
  variant: 'outlined' | 'filled';
  label: string;
  id: string;
  defaultText?: string;
}

const TextField = ({ id, label, variant, defaultText }: PropsWithChildren<TextFieldProps>) => {
  return (
    <div className={`${styles.textField} ${variant}`}>
      <label htmlFor={id}>
        <Typography variant="label/medium" component="p">
          {label}
        </Typography>
      </label>
      <input id={id} name={id} placeholder={defaultText ? defaultText : ''} />
    </div>
  );
};

export default TextField;

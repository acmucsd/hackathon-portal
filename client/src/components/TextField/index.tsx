import Typography from '../Typography';
import ErrorIcon from '../../../public/assets/error.svg';
import { UseFormRegisterReturn } from 'react-hook-form';
import { PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TextFieldProps {
  variant: 'outlined' | 'filled';
  label: string;
  id: string;
  defaultText?: string;
  formRegister: UseFormRegisterReturn;
  error: any;
}

const TextField = ({
  id,
  label,
  variant,
  defaultText,
  formRegister,
  error,
}: PropsWithChildren<TextFieldProps>) => {
  return (
    <div className={`${styles.textField} ${variant}`}>
      <label htmlFor={id}>
        <Typography variant="label/medium" component="p">
          {label}
        </Typography>
      </label>
      <input id={id} placeholder={defaultText ? defaultText : ''} {...formRegister} />
      <p className={styles.formError}>
        {error && <ErrorIcon />}
        {error?.message}
      </p>
    </div>
  );
};

export default TextField;

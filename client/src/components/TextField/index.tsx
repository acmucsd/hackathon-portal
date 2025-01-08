import Typography from '../Typography';
import ErrorIcon from '../../../public/assets/icons/error.svg';
import { UseFormRegisterReturn } from 'react-hook-form';
import { HTMLInputTypeAttribute } from 'react';
import styles from './style.module.scss';

interface TextFieldProps {
  variant?: 'vertical' | 'horizontal';
  label: string;
  id: string;
  defaultText?: string;
  formRegister: UseFormRegisterReturn;
  error: any;
  type: HTMLInputTypeAttribute;
  autoComplete: string;
  disabled?: boolean;
}

const TextField = ({
  id,
  label,
  variant = 'vertical',
  defaultText,
  formRegister,
  error,
  type,
  autoComplete,
  disabled = false,
}: TextFieldProps) => {
  return (
    <div className={`${styles.textField} ${styles[variant]}`}>
      <label htmlFor={id}>
        <Typography variant="label/medium" component="p">
          {label}
        </Typography>
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        placeholder={defaultText ? defaultText : ''}
        disabled={disabled}
        {...formRegister}
      />
      {error && (
        <Typography variant="label/medium" component="p" className={styles.formError}>
          {error && <ErrorIcon />}
          {error?.message}
        </Typography>
      )}
    </div>
  );
};

export default TextField;

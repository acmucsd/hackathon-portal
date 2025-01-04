import Typography from '../Typography';
import ErrorIcon from '../../../public/assets/icons/error.svg';
import { UseFormRegisterReturn } from 'react-hook-form';
import { HTMLInputTypeAttribute, PropsWithChildren } from 'react';
import styles from './style.module.scss';

interface TextFieldProps {
  variant: 'outlined' | 'filled';
  label: string;
  id: string;
  defaultText?: string;
  formRegister: UseFormRegisterReturn;
  error: any;
  type: HTMLInputTypeAttribute;
  autoComplete: string;
}

const TextField = ({
  id,
  label,
  variant,
  defaultText,
  formRegister,
  error,
  type,
  autoComplete,
}: PropsWithChildren<TextFieldProps>) => {
  return (
    <div className={`${styles.textField} ${variant}`}>
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
        {...formRegister}
      />
      <p className={styles.formError}>
        {error && <ErrorIcon />}
        {error?.message}
      </p>
    </div>
  );
};

export default TextField;

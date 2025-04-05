import DropdownArrow from '../../../public/assets/icons/dropdown-arrow.svg';
import Typography from '@/components/Typography';
import { ReactNode, useEffect, useState } from 'react';
import styles from './style.module.scss';

interface DropdownProps {
  name: string;
  ariaLabel: string;
  options: (string | { value: string; display: string })[];
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  placeholder?: string;
}

const Dropdown = ({
  name,
  ariaLabel,
  options,
  value,
  onChange,
  readOnly,
  className,
  placeholder,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest(`.${styles.dropdownWrapper}`)) {
        return;
      }
      setOpen(false);
    });
  }, [open]);

  const optionButtons: ReactNode[] = options.map(option => {
    const { value, display } =
      typeof option === 'string' ? { value: option, display: option } : option;

    return (
      <button
        type="button"
        className={styles.option}
        onClick={event => {
          onChange(value);
          setOpen(false);
          event.stopPropagation();
        }}
        key={value}
      >
        {display}
      </button>
    );
  });

  return (
    <div
      className={`${styles.dropdownWrapper} ${className} ${readOnly ? styles.readOnly : ''}`}
      onClick={e => {
        if (readOnly) {
          return;
        }
        if (e.target instanceof HTMLElement && e.target.tagName === 'SELECT') {
          return;
        }
        setOpen(true);
      }}
    >
      <label htmlFor={name}>
        <Typography variant="label/medium" component="p">
          {ariaLabel}
        </Typography>
      </label>
      <div className={styles.selector}>
        <select
          name={name}
          id={name}
          value={value}
          onChange={e => onChange(e.currentTarget.value)}
          aria-label={ariaLabel}
          disabled={readOnly}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => {
            const { value, display } =
              typeof option === 'string' ? { value: option, display: option } : option;

            return (
              <option value={value} key={value}>
                {display}
              </option>
            );
          })}
        </select>
        <DropdownArrow className={styles.arrow} aria-hidden />
      </div>
      <div className={`${styles.contents} ${open ? '' : styles.closed}`}>{optionButtons}</div>
    </div>
  );
};

export default Dropdown;

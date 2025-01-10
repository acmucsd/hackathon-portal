'use client ';

import { Checkbox, Radio } from '@mui/material';
import styles from './style.module.scss';
import { useRef, useState } from 'react';

export const OTHER = '__OTHER__';

interface MultipleChoiceGroupProps {
  mode: 'radio' | 'checkbox';
  name: string;
  choices: string[];
  other?: boolean;
  inline?: boolean;
  required?: boolean;
  defaultValue?: string | string[];
  disabled?: boolean;
}

const MultipleChoiceGroup = ({
  mode,
  name,
  choices,
  inline = false,
  other = false,
  required = false,
  defaultValue,
  disabled = false,
}: MultipleChoiceGroupProps) => {
  const Component = mode === 'radio' ? Radio : Checkbox;
  const defaultOther =
    defaultValue === undefined
      ? null
      : Array.isArray(defaultValue)
        ? (defaultValue.filter(choice => !choices.includes(choice))[0] ?? null)
        : choices.includes(defaultValue)
          ? null
          : defaultValue;

  const [selected, setSelected] = useState(defaultOther !== null ? OTHER : (defaultValue ?? ''));
  const [showOther, setShowOther] = useState(defaultOther !== null);
  const ref = useRef<HTMLDivElement | null>(null);

  const isOtherEnabled = mode === 'radio' ? selected === OTHER : showOther;

  return (
    <div className={`${styles.wrapper} ${inline ? styles.inline : ''}`} ref={ref}>
      {choices.map(choice => {
        return (
          <p key={choice}>
            <label className={styles.checkboxLabel}>
              <Component
                name={name}
                value={choice}
                // For checkboxes, we can require at least one checkbox by
                // only setting all of them `required` if none of them are
                // checked
                required={required && (mode === 'radio' || selected === '')}
                checked={mode === 'radio' ? selected === choice : undefined}
                defaultChecked={
                  defaultValue === undefined || mode === 'radio'
                    ? undefined
                    : Array.isArray(defaultValue) && defaultValue.includes(choice)
                }
                onChange={e => {
                  if (e.currentTarget.checked) {
                    setSelected(choice);
                  } else if (mode === 'checkbox' && !ref.current?.querySelector(':checked')) {
                    setSelected('');
                  }
                }}
                disabled={disabled}
              />
              {choice}
            </label>
          </p>
        );
      })}
      {other ? (
        <p
          className={styles.checkboxLabel}
          onClick={() => {
            setShowOther(true);
            setSelected(OTHER);
          }}
        >
          <label className={styles.checkboxLabel}>
            <Component
              name={name}
              value={OTHER}
              required={required && (mode === 'radio' || selected === '')}
              checked={isOtherEnabled}
              defaultChecked={
                defaultValue === undefined || mode === 'radio' ? undefined : defaultOther !== null
              }
              onChange={e => {
                setShowOther(e.currentTarget.checked);
                if (e.currentTarget.checked) {
                  setSelected(OTHER);
                } else if (mode === 'checkbox' && !ref.current?.querySelector(':checked')) {
                  setSelected('');
                }
              }}
              disabled={disabled}
            />
            Other:&nbsp;
          </label>
          <input
            type="text"
            name={`${name}-${OTHER}`}
            aria-label="Other"
            className={styles.other}
            defaultValue={defaultValue === undefined ? undefined : (defaultOther ?? '')}
            disabled={!isOtherEnabled || disabled}
          />
        </p>
      ) : null}
    </div>
  );
};

export default MultipleChoiceGroup;

'use client ';

import { Checkbox, CheckboxProps, Radio, RadioProps } from '@mui/material';
import Typography from '../Typography';
import ErrorIcon from '../../../public/assets/icons/error.svg';
import { UseFormRegisterReturn } from 'react-hook-form';
import styles from './style.module.scss';
import { useRef, useState } from 'react';

export const OTHER = '__OTHER__';
/**
 * Indicates that none of the items are checked. Used to enforce at least one
 * checkbox checked if a checkbox question is required.
 */
const NONE = '__NONE__';

interface MultipleChoiceGroupProps {
  mode: 'radio' | 'checkbox';
  name: string;
  choices: string[];
  formRegister?: UseFormRegisterReturn;
  error?: any;
  color?: any;
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
  formRegister,
  error,
  color,
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

  const [selected, setSelected] = useState(
    defaultOther !== null
      ? OTHER
      : ((Array.isArray(defaultValue) ? defaultValue[0] : defaultValue) ?? NONE)
  );
  const [showOther, setShowOther] = useState(defaultOther !== null);
  const ref = useRef<HTMLDivElement | null>(null);

  const isOtherEnabled = mode === 'radio' ? selected === OTHER : showOther;

  return (
    <div className={`${styles.wrapper} ${inline ? styles.inline : ''}`} ref={ref}>
      {choices.map(choice => {
        const props: RadioProps & CheckboxProps = {
          ...formRegister,
          name,
          value: choice,
          sx: !error ? color : { color: '#ffb3b4' },
          // For checkboxes, we can require at least one checkbox by
          // only setting all of them `required` if none of them are
          // checked
          required: required && (mode === 'radio' || selected === NONE),
          onChange: e => {
            formRegister?.onChange(e);
            if (e.currentTarget.checked) {
              setSelected(choice);
            } else if (mode === 'checkbox' && !ref.current?.querySelector(':checked')) {
              setSelected(NONE);
            }
          },
          disabled,
        };
        // React has a distinction between undefined and whether the prop is
        // present at all, and these two props can't both be present
        if (mode === 'radio') {
          props.checked = selected === choice;
        } else if (defaultValue !== undefined) {
          props.defaultChecked = Array.isArray(defaultValue) && defaultValue.includes(choice);
        }
        return (
          <p key={choice}>
            <label className={styles.checkboxLabel}>
              <Component {...props} />
              {choice}
            </label>
          </p>
        );
      })}
      {other ? (
        <p
          className={styles.checkboxLabel}
          onClick={e => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLLabelElement) {
              return;
            }
            setShowOther(true);
            setSelected(OTHER);
          }}
        >
          <label className={styles.checkboxLabel}>
            <Component
              name={name}
              value={OTHER}
              required={required && (mode === 'radio' || selected === NONE)}
              checked={isOtherEnabled}
              onChange={e => {
                setShowOther(e.currentTarget.checked);
                if (e.currentTarget.checked) {
                  setSelected(OTHER);
                } else if (mode === 'checkbox' && !ref.current?.querySelector(':checked')) {
                  setSelected(NONE);
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
            required={isOtherEnabled}
            disabled={!isOtherEnabled || disabled}
          />
        </p>
      ) : null}
      {error && (
        <Typography variant="label/small" component="p" className={styles.formError}>
          {error && <ErrorIcon />}
          {error?.message}
        </Typography>
      )}
    </div>
  );
};

export default MultipleChoiceGroup;

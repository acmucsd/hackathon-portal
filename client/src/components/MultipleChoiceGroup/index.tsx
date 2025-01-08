'use client ';

import { Checkbox, Radio } from '@mui/material';
import styles from './style.module.scss';
import { useRef, useState } from 'react';
import Typography from '../Typography';
import ErrorIcon from '../../../public/assets/icons/error.svg';

export const OTHER = '__OTHER__';

interface MultipleChoiceGroupProps {
  mode: 'radio' | 'checkbox';
  name: string;
  choices: string[];
  other?: boolean;
  inline?: boolean;
  required?: boolean;
}

const MultipleChoiceGroup = ({
  mode,
  name,
  choices,
  inline,
  other,
  required,
}: MultipleChoiceGroupProps) => {
  const Component = mode === 'radio' ? Radio : Checkbox;
  const [selected, setSelected] = useState('');
  const [showOther, setShowOther] = useState(false);
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
                onChange={e => {
                  if (e.currentTarget.checked) {
                    setSelected(choice);
                  } else if (mode === 'checkbox' && !ref.current?.querySelector(':checked')) {
                    setSelected('');
                  }
                }}
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
              onChange={e => {
                setShowOther(e.currentTarget.checked);
                if (e.currentTarget.checked) {
                  setSelected(OTHER);
                } else if (mode === 'checkbox' && !ref.current?.querySelector(':checked')) {
                  setSelected('');
                }
              }}
            />
            Other:&nbsp;
          </label>
          <input
            type="text"
            name={`${name}-${OTHER}`}
            aria-label="Other"
            className={styles.other}
            disabled={!isOtherEnabled}
          />
        </p>
      ) : null}
    </div>
  );
};

export default MultipleChoiceGroup;

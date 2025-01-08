'use client ';

import { Checkbox, Radio } from '@mui/material';
import styles from './style.module.scss';
import { useState } from 'react';

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

  const isOtherEnabled = mode === 'radio' ? selected === OTHER : showOther;

  return (
    <div className={inline ? styles.inline : ''}>
      {choices.map(choice => {
        return (
          <p key={choice}>
            <label className={styles.checkboxLabel}>
              <Component
                name={name}
                value={choice}
                required={required}
                checked={mode === 'radio' ? selected === choice : undefined}
                onChange={e => {
                  if (e.currentTarget.checked) {
                    setSelected(choice);
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
              required={required}
              checked={isOtherEnabled}
              onChange={e => {
                setShowOther(e.currentTarget.checked);
                if (e.currentTarget.checked) {
                  setSelected(OTHER);
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

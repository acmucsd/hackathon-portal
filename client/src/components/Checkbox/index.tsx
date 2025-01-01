import { PropsWithChildren } from 'react';

interface CheckboxProps {
  name: string;
  value: string;
  checked: boolean;
  onChecked: (value: boolean) => void;
  type?: 'radio' | 'checkbox';
}

const Checkbox = ({
  name,
  value,
  checked,
  onChecked,
  type = 'checkbox',
  children,
}: PropsWithChildren<CheckboxProps>) => {
  return (
    <>
      <p>
        <label>
          <input
            type={type}
            name={name}
            value={value}
            checked={checked}
            onChange={e => onChecked(e.currentTarget.checked)}
          />
          {children}
        </label>
      </p>
    </>
  );
};

export default Checkbox;

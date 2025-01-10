import { useId, useState } from 'react';
import Button from '../Button';
import styles from './style.module.scss';

interface FileSelectProps {
  accept: string;
  name: string;
  required?: boolean;
  disabled?: boolean;
  defaultFile?: File;
}
const FileSelect = ({ accept, name, required, disabled, defaultFile }: FileSelectProps) => {
  const id = useId();
  const [selected, setSelected] = useState(defaultFile);

  return (
    <div className={styles.wrapper}>
      {selected?.name}
      <input
        type="file"
        accept={accept}
        name={name}
        id={id}
        required={required && !defaultFile}
        className="accessible-but-hidden"
        disabled={disabled}
        onChange={e => {
          if (e.currentTarget.files?.[0]) {
            setSelected(e.currentTarget.files[0]);
          }
        }}
      />
      <Button variant="secondary" for={id}>
        Upload New
      </Button>
    </div>
  );
};

export default FileSelect;

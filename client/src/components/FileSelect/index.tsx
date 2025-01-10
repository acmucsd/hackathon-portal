import { useId, useState } from 'react';
import Button from '../Button';
import styles from './style.module.scss';
import Typography from '../Typography';
import ErrorIcon from '../../../public/assets/icons/error.svg';

interface FileSelectProps {
  fileTypes: string[];
  maxSize: number;
  name: string;
  required?: boolean;
  disabled?: boolean;
  defaultFile?: File;
}
const FileSelect = ({
  fileTypes,
  maxSize,
  name,
  required,
  disabled,
  defaultFile,
}: FileSelectProps) => {
  const id = useId();
  const [selected, setSelected] = useState(defaultFile);

  return (
    <>
      <div className={styles.wrapper}>
        {selected?.name}
        <input
          type="file"
          accept={fileTypes.join(',')}
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
      {selected && selected.size > maxSize ? (
        <Typography variant="label/medium" component="p" className={styles.error}>
          <ErrorIcon /> Your file is too large.
        </Typography>
      ) : null}
      {selected && fileTypes.every(extension => !selected.name.endsWith(extension)) ? (
        <Typography variant="label/medium" component="p" className={styles.error}>
          <ErrorIcon /> Your file must be one of: {fileTypes.join(', ')}
        </Typography>
      ) : null}
    </>
  );
};

export default FileSelect;

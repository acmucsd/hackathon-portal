import { useId, useState } from 'react';
import Button from '../Button';
import styles from './style.module.scss';
import Typography from '../Typography';
import ErrorIcon from '../../../public/assets/icons/error.svg';
import Link from 'next/link';

interface FileSelectProps {
  fileTypes: string[];
  maxSize: number;
  name: string;
  required?: boolean;
  disabled?: boolean;
  defaultFile?: File | string;
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
      <div className={styles.wrapper}>
        {typeof selected === 'string' ? (
          <Button variant="tertiary" href={selected}>
            {decodeURIComponent(selected.split('/').at(-1) ?? '')}
          </Button>
        ) : (
          selected?.name
        )}
        <Button variant="secondary" for={id}>
          Upload New
        </Button>
      </div>
      {selected instanceof File && selected.size > maxSize ? (
        <Typography variant="label/medium" component="p" className={styles.error}>
          <ErrorIcon /> Your file is too large.
        </Typography>
      ) : null}
      {selected instanceof File &&
      fileTypes.every(extension => !selected.name.endsWith(extension)) ? (
        <Typography variant="label/medium" component="p" className={styles.error}>
          <ErrorIcon /> Your file must be one of: {fileTypes.join(', ')}
        </Typography>
      ) : null}
    </>
  );
};

export default FileSelect;

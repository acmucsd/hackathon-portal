import { ReactNode, useEffect, useRef } from 'react';
import styles from './style.module.scss';

interface ModalProps {
  title?: string;
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
  /** Anchor content to the bottom of the screen. Only applies to mobile modals. */
  bottomSheet?: boolean;
}

const Modal = ({ title, open, onClose, children, bottomSheet }: ModalProps) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (open) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  return (
    // Justification for disabling eslint rules: Clicking on the faded area
    // isn't the only way to close the modal; you can also click the close
    // button. HTML already supports pressing the escape key to close modals, so
    // I don't need to add my own.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      className={`${styles.modal} ${bottomSheet ? styles.bottomSheet : ''}`}
      ref={ref}
      onClick={e => {
        if (e.target === e.currentTarget) {
          e.currentTarget.close();
        }
      }}
      onClose={onClose}
    >
      <form
        method="dialog"
        className={`${styles.modalBody} ${title ? styles.hasHeader : ''} ${
          bottomSheet ? styles.bottomSheet : ''
        }`}
      >
        {title ? (
          <div className={styles.header}>
            <h1>{title}</h1>
            <button type="submit" className={styles.close} aria-label="Close">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M9.50012 30.483C9.65431 30.6375 9.83746 30.76 10.0391 30.8437C10.2407 30.9273 10.4568 30.9704 10.6751 30.9704C10.8934 30.9704 11.1095 30.9273 11.3112 30.8437C11.5128 30.76 11.6959 30.6375 11.8501 30.483L20.0001 22.3496L28.1501 30.4996C28.3044 30.6539 28.4876 30.7763 28.6892 30.8598C28.8908 30.9433 29.1069 30.9863 29.3251 30.9863C29.5433 30.9863 29.7594 30.9433 29.961 30.8598C30.1626 30.7763 30.3458 30.6539 30.5001 30.4996C30.6544 30.3453 30.7768 30.1621 30.8603 29.9605C30.9438 29.7589 30.9868 29.5428 30.9868 29.3246C30.9868 29.1064 30.9438 28.8903 30.8603 28.6887C30.7768 28.4871 30.6544 28.3039 30.5001 28.1496L22.3501 19.9996L30.5001 11.8496C30.6544 11.6953 30.7768 11.5121 30.8603 11.3105C30.9438 11.1089 30.9868 10.8928 30.9868 10.6746C30.9868 10.4564 30.9438 10.2403 30.8603 10.0387C30.7768 9.83712 30.6544 9.65393 30.5001 9.49963C30.3458 9.34533 30.1626 9.22293 29.961 9.13942C29.7594 9.05591 29.5433 9.01293 29.3251 9.01293C29.1069 9.01293 28.8908 9.05591 28.6892 9.13942C28.4876 9.22293 28.3044 9.34533 28.1501 9.49963L20.0001 17.6496L11.8501 9.49963C11.6958 9.34533 11.5126 9.22293 11.311 9.13942C11.1094 9.05591 10.8933 9.01293 10.6751 9.01293C10.4569 9.01293 10.2408 9.05591 10.0392 9.13942C9.8376 9.22293 9.65442 9.34533 9.50012 9.49963C9.34582 9.65393 9.22341 9.83712 9.13991 10.0387C9.0564 10.2403 9.01342 10.4564 9.01342 10.6746C9.01342 10.8928 9.0564 11.1089 9.13991 11.3105C9.22341 11.5121 9.34582 11.6953 9.50012 11.8496L17.6501 19.9996L9.50012 28.1496C8.86679 28.783 8.86679 29.8496 9.50012 30.483Z" />
              </svg>
            </button>
          </div>
        ) : null}
        {children}
      </form>
    </dialog>
  );
};

export default Modal;

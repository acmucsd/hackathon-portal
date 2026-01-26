import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import StatusTag from '@/components/StatusTag';
import styles from './style.module.scss';

type StatusDropdownProps = {
  value?: string;
  onChange: (next: string) => void;
  options?: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export default function StatusDropdown({
  value,
  onChange,
  options = ['ACCEPTED', 'WAITLISTED', 'REJECTED'],
  placeholder = 'Select Decision',
  disabled = false,
  className = '',
}: StatusDropdownProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const listboxId = useId();
  const optionIds = useMemo(
    () => options.map((_, i) => `${listboxId}-opt-${i}`),
    [options, listboxId]
  );

  const selectedIndex = useMemo(() => {
    if (!value) return -1;
    return options.findIndex(s => s === value);
  }, [options, value]);

  const close = () => {
    setOpen(false);
    setActiveIndex(-1);
  };

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    requestAnimationFrame(() => listRef.current?.focus());
  };

  const toggle = () => {
    if (disabled) return;
    setOpen(prev => {
      const next = !prev;
      if (next) {
        setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
        requestAnimationFrame(() => listRef.current?.focus());
      } else {
        setActiveIndex(-1);
      }
      return next;
    });
  };

  const commit = (idx: number) => {
    const next = options[idx];
    if (!next) return;
    onChange(next);
    close();
    buttonRef.current?.focus();
  };

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    const onDocMouseDown = (e: MouseEvent) => {
      const root = rootRef.current;
      if (!root) return;
      if (!root.contains(e.target as Node)) close();
    };

    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  const onTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    onListKeyDown(e);
  };

  const onListKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      buttonRef.current?.focus();
      return;
    }

    if (e.key === 'Tab') {
      close();
      return;
    }

    const max = options.length - 1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => (i < 0 ? 0 : Math.min(max, i + 1)));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => (i < 0 ? max : Math.max(0, i - 1)));
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(max);
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIndex >= 0) commit(activeIndex);
    }
  };

  return (
    <div ref={rootRef} className={`${styles.root} ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.trigger} ${disabled ? styles.triggerDisabled : ''}`}
        onClick={toggle}
        onKeyDown={onTriggerKeyDown}
        disabled={disabled}
        role="combobox"
        aria-controls={listboxId}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className={styles.value}>
          {value ? (
            <StatusTag status={value} />
          ) : (
            <span className={styles.placeholder}>{placeholder}</span>
          )}
        </span>
        {/* TODO: replace this SVG */}
        <span className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" focusable="false">
            <path
              d="M7 10l5 5 5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {open && (
        <div
          id={listboxId}
          ref={listRef}
          className={styles.menu}
          role="listbox"
          tabIndex={-1}
          aria-activedescendant={activeIndex >= 0 ? optionIds[activeIndex] : undefined}
          onKeyDown={onListKeyDown}
        >
          {options.map((status, idx) => {
            const isActive = idx === activeIndex;
            const isSelected = idx === selectedIndex;

            return (
              <div
                key={status}
                id={optionIds[idx]}
                role="option"
                aria-selected={isSelected}
                className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={e => e.preventDefault()}
                onClick={() => commit(idx)}
              >
                <StatusTag status={status} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

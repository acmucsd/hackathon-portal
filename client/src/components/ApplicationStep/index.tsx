'use client';

import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import Card from '../Card';
import Heading from '../Heading';
import Typography from '../Typography';
import { createTheme, ThemeProvider } from '@mui/material';
import styles from './style.module.scss';
import Button from '../Button';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ErrorIcon from '../../../public/assets/icons/error.svg';
import MultipleChoiceGroup, { OTHER } from '../MultipleChoiceGroup';
import localforage from 'localforage';
import showToast from '@/lib/showToast';
import { reportError } from '@/lib/utils';
import FileSelect from '../FileSelect';
import { Application } from '@/lib/types/application';
import { Responses } from '../../lib/responses';

export const SAVED_RESPONSES_KEY = 'saved application';

type AppQuestion = {
  id: keyof Application;
  question: ReactNode;
  optional?: boolean;
} & (
  | {
      type: 'select-one' | 'select-multiple';
      choices: string[];
      other?: boolean;
      inline?: boolean;
    }
  | {
      type: 'dropdown';
      choices: string[];
    }
  | {
      type: 'short-text';
      placeholder?: string;
    }
  | {
      type: 'long-text';
      placeholder?: string;
    }
  | {
      type: 'url' | 'phone';
      placeholder?: string;
    }
  | {
      type: 'file';
      fileTypes: string[];
      maxSize: number;
    }
);

export type Step = {
  shortName: string;
  title: string;
  description?: ReactNode;
  questions: AppQuestion[];
};

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const ASTERISK = (
  <span className={styles.required} aria-label="(required)" title="Required">
    *
  </span>
);

interface ApplicationStepProps {
  step: Step;
  responses: Responses;
  responsesLoaded?: boolean;
  prev: string;
  next: string;
}

const ApplicationStep = ({
  step: { title, description, questions },
  responses,
  responsesLoaded = true,
  prev,
  next,
}: ApplicationStepProps) => {
  const router = useRouter();
  const id = useId();
  const formRef = useRef<HTMLFormElement | null>(null);
  const [showOtherInput, setShowOtherInput] = useState<{ [key: string]: boolean }>({});

  async function save() {
    if (!formRef.current) {
      return;
    }

    const data = new FormData(formRef.current);
    const responses = Object.fromEntries(
      questions.map(question => {
        if (question.type === 'select-multiple') {
          return [
            question.id,
            data
              .getAll(question.id)
              .map(response =>
                response === OTHER ? data.get(`${question.id}-${OTHER}`) : response
              ),
          ];
        }
        const response = data.get(question.id);
        if (question.type === 'select-one' || question.type === 'dropdown') {
          return [
            question.id,
            response === 'Other' || response === OTHER
              ? data.get(`${question.id}-${OTHER}`)
              : response,
          ];
        }
        return [question.id, response];
      })
    );
    for (const [key, value] of Object.entries(responses)) {
      if (value instanceof File && value.size === 0) {
        delete responses[key];
      }
    }
    try {
      await localforage.setItem(SAVED_RESPONSES_KEY, {
        ...(await localforage.getItem<Responses | null>(SAVED_RESPONSES_KEY)),
        ...responses,
      });
      showToast(
        'Responses saved locally!',
        'Your responses will be lost when you clear site data. Your browser may do this automatically after a few days. Your draft will not be accessible from other devices.'
      );
    } catch (error) {
      reportError("Couldn't save your responses. Try a different browser or device.", error);
    }
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Card
        gap={2}
        formRef={formRef}
        onSubmit={async e => {
          e.preventDefault();
          await save();
          router.push(next);
        }}
      >
        <Link href={prev} className={styles.back} onClick={save}>
          &lt; Back
        </Link>
        <div className={styles.info}>
          <Heading>{title}</Heading>
          {description ? <Typography variant="body/medium">{description}</Typography> : null}
          <Typography variant="body/medium">{ASTERISK} indicates a required field.</Typography>
        </div>
        <hr />
        {questions.map(question => {
          if (question.type === 'select-one' || question.type === 'select-multiple') {
            return (
              <fieldset key={question.id} className={styles.multipleChoice}>
                <legend>
                  <Typography variant="body/medium" component="span" className={styles.question}>
                    {question.question}
                    {question.optional ? null : ASTERISK}
                  </Typography>
                </legend>
                <MultipleChoiceGroup
                  mode={question.type === 'select-one' ? 'radio' : 'checkbox'}
                  name={question.id}
                  choices={question.choices}
                  inline={question.inline}
                  other={question.other}
                  required={!question.optional}
                  defaultValue={responses[question.id]}
                  disabled={!responsesLoaded}
                />
                <Typography variant="label/medium" component="p" className={styles.error}>
                  <ErrorIcon /> Required.
                </Typography>
              </fieldset>
            );
          }
          if (
            question.type === 'short-text' ||
            question.type === 'long-text' ||
            question.type === 'phone' ||
            question.type === 'url' ||
            question.type === 'dropdown'
          ) {
            return (
              <div className={styles.questionWrapper} key={question.id}>
                <Typography variant="body/medium" component="p" className={styles.question}>
                  <label htmlFor={`${id}-${question.id}`}>
                    {question.question}
                    {question.optional ? null : ASTERISK}
                  </label>
                </Typography>
                {question.type === 'long-text' ? (
                  <textarea
                    id={`${id}-${question.id}`}
                    name={question.id}
                    placeholder={question.placeholder ?? 'Type answer here...'}
                    required={!question.optional}
                    className={styles.textbox}
                    defaultValue={responses[question.id] ?? ''}
                    disabled={!responsesLoaded}
                  />
                ) : question.type === 'short-text' ? (
                  <input
                    type="text"
                    id={`${id}-${question.id}`}
                    name={question.id}
                    placeholder={question.placeholder}
                    required={!question.optional}
                    className={styles.textline}
                    defaultValue={responses[question.id] ?? ''}
                    disabled={!responsesLoaded}
                  />
                ) : question.type === 'dropdown' ? (
                  <>
                    {showOtherInput[question.id] === undefined &&
                      responses[question.id] &&
                      !question.choices.includes(responses[question.id]) &&
                      (showOtherInput[question.id] = true)}
                    <select
                      id={`${id}-${question.id}`}
                      name={question.id}
                      required={!question.optional}
                      className={styles.textline}
                      defaultValue={
                        showOtherInput[question.id] ? 'Other' : responses[question.id] || ''
                      }
                      disabled={!responsesLoaded}
                      onChange={e => {
                        const selectedValue = e.target.value;
                        setShowOtherInput(prevState => ({
                          ...prevState,
                          [question.id]: selectedValue === 'Other',
                        }));
                      }}
                    >
                      <option value="" disabled>
                        Select one
                      </option>
                      {question.choices.map(choice => (
                        <option value={choice} key={choice}>
                          {choice}
                        </option>
                      ))}
                    </select>
                    {showOtherInput[question.id] && (
                      <input
                        type="text"
                        id={`${id}-${question.id}-${OTHER}`}
                        name={`${question.id}-${OTHER}`}
                        placeholder="Please specify"
                        required={!question.optional}
                        className={styles.textline}
                        defaultValue={responses[`${question.id}`] ?? ''}
                        disabled={!responsesLoaded}
                      />
                    )}
                  </>
                ) : (
                  <input
                    type={question.type === 'phone' ? 'tel' : 'url'}
                    id={`${id}-${question.id}`}
                    name={question.id}
                    placeholder={question.placeholder}
                    required={!question.optional}
                    className={styles.textline}
                    defaultValue={responses[question.id] ?? ''}
                    disabled={!responsesLoaded}
                  />
                )}
                <Typography variant="label/medium" component="p" className={styles.error}>
                  <ErrorIcon /> Required.
                </Typography>
              </div>
            );
          }
          if (question.type === 'file') {
            return (
              <div className={styles.questionWrapper} key={question.id}>
                <Typography variant="body/medium" component="p" className={styles.question}>
                  <label htmlFor={`${id}-${question.id}`}>
                    {question.question}
                    {question.optional ? null : ASTERISK}
                  </label>
                </Typography>
                <FileSelect
                  fileTypes={question.fileTypes}
                  maxSize={question.maxSize}
                  name={question.id}
                  required={!question.optional}
                  disabled={!responsesLoaded}
                  defaultFile={responses[question.id]}
                />
                <Typography variant="label/medium" component="p" className={styles.error}>
                  <ErrorIcon /> Required.
                </Typography>
              </div>
            );
          }
          return null;
        })}
        <div className={styles.buttonRow}>
          <Button variant="secondary" onClick={save}>
            Save Changes
          </Button>
          <Button submit disabled={!responsesLoaded}>
            Next
          </Button>
        </div>
      </Card>
    </ThemeProvider>
  );
};

const ApplicationStepWrapped = ({
  submittedResponses = {},
  ...props
}: Omit<ApplicationStepProps, 'responses' | 'responsesLoaded'> & {
  submittedResponses?: Responses;
}) => {
  const [responses, setResponses] = useState<Responses>(submittedResponses);
  const [responsesLoaded, setResponsesLoaded] = useState(false);

  useEffect(() => {
    localforage
      .getItem<Responses | null>(SAVED_RESPONSES_KEY)
      .then(draftResponses => {
        if (draftResponses) {
          setResponses(submittedResponses => ({ ...submittedResponses, ...draftResponses }));
        }
      })
      .finally(() => setResponsesLoaded(true));
  }, []);

  return (
    <ApplicationStep
      {...props}
      responses={responses}
      responsesLoaded={responsesLoaded}
      key={String(responsesLoaded)}
    />
  );
};

export default ApplicationStepWrapped;

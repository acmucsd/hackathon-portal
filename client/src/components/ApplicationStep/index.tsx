import { ReactNode, useId, useRef } from 'react';
import Card from '../Card';
import Heading from '../Heading';
import Typography from '../Typography';
import { Checkbox, createTheme, Radio, ThemeProvider } from '@mui/material';
import styles from './style.module.scss';
import Button from '../Button';
import { useRouter } from 'next/navigation';
import { iso31661 } from 'iso-3166';
import Dropdown from '../Dropdown';
import Link from 'next/link';
import ErrorIcon from '../../../public/assets/icons/error.svg';

type AppQuestion = {
  id: string;
  question: ReactNode;
  optional?: boolean;
} & (
  | {
      type: 'select-one' | 'select-multiple' | 'dropdown';
      choices: string[];
      other?: boolean;
      inline?: boolean;
    }
  | {
      type: 'text';
    }
  | {
      type: 'url' | 'phone';
      placeholder?: string;
    }
  | {
      type: 'file';
      maxSize: number;
      fileTypes: string;
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
  prev: string;
  next: string;
}

const ApplicationStep = ({
  step: { title, description, questions },
  prev,
  next,
}: ApplicationStepProps) => {
  const router = useRouter();
  const id = useId();
  const formRef = useRef<HTMLFormElement | null>(null);

  async function save() {
    if (!formRef.current) {
      return;
    }

    // TODO: Save changes
    console.log(new FormData(formRef.current));
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
            const required = !question.optional && question.type === 'select-one';

            const Component = question.type === 'select-one' ? Radio : Checkbox;

            return (
              <fieldset key={question.id} className={styles.multipleChoice}>
                <legend>
                  <Typography variant="body/medium" component="span" className={styles.question}>
                    {question.question}
                    {question.optional ? null : ASTERISK}
                  </Typography>
                </legend>
                <div className={question.inline ? styles.inline : ''}>
                  {question.choices.map(choice => {
                    return (
                      <p key={choice}>
                        <label className={styles.checkboxLabel}>
                          <Component name={question.id} value={choice} required={required} />
                          &nbsp;
                          {choice}
                        </label>
                      </p>
                    );
                  })}
                  {question.other ? (
                    <p className={styles.checkboxLabel}>
                      <label className={styles.checkboxLabel}>
                        <Component name={question.id} value="other" required={required} />
                        &nbsp;Other:&nbsp;
                      </label>
                      <input
                        type="text"
                        name={question.id}
                        aria-label="Other"
                        className={styles.other}
                      />
                    </p>
                  ) : null}
                  <Typography variant="label/medium" component="p" className={styles.error}>
                    <ErrorIcon /> Required.
                  </Typography>
                </div>
              </fieldset>
            );
          }
          if (question.type === 'dropdown') {
            return (
              <div className={styles.questionWrapper} key={question.id}>
                <Typography variant="body/medium" component="p" className={styles.question}>
                  <label htmlFor={question.id}>
                    {question.question}
                    {question.optional ? null : ASTERISK}
                  </label>
                </Typography>
                TODO
              </div>
            );
          }
          if (question.type === 'text' || question.type === 'phone' || question.type === 'url') {
            return (
              <div className={styles.questionWrapper} key={question.id}>
                <Typography variant="body/medium" component="p" className={styles.question}>
                  <label htmlFor={`${id}-${question.id}`}>
                    {question.question}
                    {question.optional ? null : ASTERISK}
                  </label>
                </Typography>
                {question.type === 'text' ? (
                  <textarea
                    id={`${id}-${question.id}`}
                    name={question.id}
                    placeholder="Type answer here..."
                    required={!question.optional}
                    className={styles.textbox}
                  />
                ) : (
                  <input
                    type={question.type === 'phone' ? 'tel' : 'url'}
                    id={`${id}-${question.id}`}
                    name={question.id}
                    placeholder={question.placeholder}
                    required={!question.optional}
                    className={styles.textline}
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
                <input
                  type="file"
                  accept={question.fileTypes}
                  name={question.id}
                  id={`${id}-${question.id}`}
                  required={!question.optional}
                  className="accessible-but-hidden"
                />
                <Button
                  variant="secondary"
                  for={`${id}-${question.id}`}
                  className={styles.uploadBtn}
                >
                  Upload New
                </Button>
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
          <Button submit>Next</Button>
        </div>
      </Card>
    </ThemeProvider>
  );
};

export default ApplicationStep;

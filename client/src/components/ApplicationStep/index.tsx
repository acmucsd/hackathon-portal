import { ReactNode, useId } from 'react';
import Card from '../Card';
import Heading from '../Heading';
import Typography from '../Typography';
import { Checkbox, createTheme, Radio, ThemeProvider } from '@mui/material';
import styles from './style.module.scss';
import Button from '../Button';
import { useRouter } from 'next/navigation';
import { iso31661 } from 'iso-3166';
import Dropdown from '../Dropdown';

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

  return (
    <ThemeProvider theme={darkTheme}>
      <Card
        gap={2}
        onSubmit={e => {
          e.preventDefault();

          // TODO: Save changes
          console.log(new FormData(e.currentTarget));

          // Next button
          if (e.nativeEvent.submitter?.dataset.variant === 'primary') {
            router.push(next);
          }
          // Back button
          if (e.nativeEvent.submitter?.dataset.variant === 'back') {
            router.push(prev);
          }
        }}
      >
        <button type="submit" data-variant="back" className={styles.back}>
          &lt; Back
        </button>
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
              <fieldset key={question.id}>
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
                          <Component name={question.id} value={choice} required={required} />{' '}
                          {choice}
                        </label>
                      </p>
                    );
                  })}
                  {question.other ? (
                    <p className={styles.checkboxLabel}>
                      <label className={styles.checkboxLabel}>
                        <Component name={question.id} value="other" required={required} />{' '}
                        Other:&nbsp;
                      </label>
                      <input type="text" name={question.id} aria-label="Other" />
                    </p>
                  ) : null}
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
                  />
                )}
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
                <input type="file" name={question.id} required={!question.optional} />
              </div>
            );
          }
          return null;
        })}
        <div className={styles.buttonRow}>
          <Button variant="secondary">Save Changes</Button>
          <Button>Next</Button>
        </div>
      </Card>
    </ThemeProvider>
  );
};

export default ApplicationStep;

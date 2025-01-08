import { ReactNode, useId } from 'react';
import Card from '../Card';
import Link from 'next/link';
import Heading from '../Heading';
import Typography from '../Typography';
import { Checkbox, createTheme, Radio, ThemeProvider } from '@mui/material';
import styles from './style.module.css';
import Button from '../Button';

type AppQuestion = {
  id: string;
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
      type: 'text';
    }
  | {
      type: 'file';
      maxSize: number;
    }
);

export type Step = {
  shortName: string;
  title: string;
  description?: string;
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
}

const ApplicationStep = ({ step: { title, description, questions } }: ApplicationStepProps) => {
  const id = useId();

  return (
    <ThemeProvider theme={darkTheme}>
      <Card gap={2} formAction={console.log}>
        <Link href="/">&lt; Back</Link>
        <div className={styles.info}>
          <Heading>{title}</Heading>
          {description ? <Typography variant="body/large">{description}</Typography> : null}
          <Typography variant="body/large">{ASTERISK} indicates a required field.</Typography>
        </div>
        <hr />
        {questions.map(question => {
          if (question.type === 'select-one' || question.type === 'select-multiple') {
            const required = !question.optional && question.type === 'select-one';

            const Component = question.type === 'select-one' ? Radio : Checkbox;

            return (
              <fieldset key={question.id}>
                <legend>
                  <Typography variant="body/large" component="span">
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
                    <p>
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
          if (question.type === 'text') {
            return (
              <div key={question.id}>
                <Typography variant="body/large" component="p">
                  <label htmlFor={`${id}-${question.id}`}>
                    {question.question}
                    {question.optional ? null : ASTERISK}
                  </label>
                </Typography>
                <textarea
                  id={`${id}-${question.id}`}
                  name={question.id}
                  placeholder="Type answer here..."
                  required={!question.optional}
                ></textarea>
              </div>
            );
          }
          if (question.type === 'file') {
            return (
              <div key={question.id}>
                <Typography variant="body/large" component="p">
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
        <div>
          <Button type="submit" variant="secondary">
            Save Changes
          </Button>
          <Button type="submit">Next</Button>
        </div>
      </Card>
    </ThemeProvider>
  );
};

export default ApplicationStep;

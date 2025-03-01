import { appQuestions } from '@/config';
import styles from './style.module.scss';
import { Fragment } from 'react';
import { Responses } from '@/lib/responses';
import Button from '../Button';

interface ApplicationResponseProps {
  responses: Responses;
}

const ApplicationResponse = ({ responses }: ApplicationResponseProps) => {
  return (
    <>
      {appQuestions.map(step => (
        <Fragment key={step.title}>
          <h2 className={styles.heading}>{step.title}</h2>
          <dl>
            {step.questions.map(({ id, question, type }) => (
              <Fragment key={id}>
                <dt className={styles.question}>{question}</dt>
                <dd className={styles.response}>
                  {responses[id] instanceof File ? (
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const link = document.createElement('a');
                        const url = URL.createObjectURL(responses[id]);
                        link.href = url;
                        link.download = responses[id].name;
                        document.body.append(link);
                        link.click();
                        link.remove();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      {responses[id].name}
                    </Button>
                  ) : type === 'file' && typeof responses[id] === 'string' ? (
                    <Button variant="secondary" href={responses[id]}>
                      {decodeURIComponent(responses[id].split('/').at(-1) ?? '')}
                    </Button>
                  ) : typeof responses[id] === 'string' ? (
                    /^https?:\/\/\S+$/.test(responses[id]) ? (
                      <a href={responses[id]} className={styles.link}>
                        {responses[id]}
                      </a>
                    ) : (
                      responses[id]
                    )
                  ) : Array.isArray(responses[id]) ? (
                    responses[id].join(', ')
                  ) : (
                    <em>No response.</em>
                  )}
                </dd>
              </Fragment>
            ))}
          </dl>
        </Fragment>
      ))}
    </>
  );
};

export default ApplicationResponse;

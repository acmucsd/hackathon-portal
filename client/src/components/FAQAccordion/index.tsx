'use client';

import { useState } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './style.module.scss';
import Typography from '../Typography';

export interface FAQQuestion {
  question: string;
  answer: React.ReactNode;
}

interface FAQAccordionProps {
  data: FAQQuestion[];
}

export default function FAQ({ data }: FAQAccordionProps) {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const handleChange = (panelIndex: number) => (_e: React.SyntheticEvent, newExpanded: boolean) => {
    if (newExpanded) {
      setExpandedIndices([...expandedIndices, panelIndex]);
    } else {
      setExpandedIndices(expandedIndices.filter(index => index !== panelIndex));
    }
  };

  return (
    <>
      {data.map((questionObject, index) => (
        <Accordion
          elevation={0}
          expanded={expandedIndices.includes(index)}
          onChange={handleChange(index)}
          className={`${styles.accordionRoot} ${styles.accordion}`}
          key={questionObject.question}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className={styles.expandIcon} />}
            className={styles.accordionSummary}
          >
            <Typography variant="body/large" className={styles.accordionQuestion}>
              {questionObject.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={styles.accordionDetails}>
            <Typography variant="body/medium" className={styles.accordionAnswer}>
              {questionObject.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
}

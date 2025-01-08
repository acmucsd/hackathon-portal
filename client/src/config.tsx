import Link from 'next/link';
import { FAQQuestion } from './components/FAQAccordion';
import { Deadlines } from './components/Dashboard';
import { ReactNode } from 'react';
import { Step } from './components/ApplicationStep';

export const FAQ_QUESTIONS: FAQQuestion[] = [
  {
    question: 'How can I register for DiamondHacks?',
    answer: (
      <>
        Fill out the <Link href="https://acmurl.com/diamondhacks-interest-form">interest form</Link>{' '}
        to be notified when applications go live!
      </>
    ),
  },
  {
    question: 'What is a hackathon?',
    answer:
      'A hackathon is an event where hackers come together to collaborate, create, and develop projects within a set timeframe (usually 24–48 hours). Participants form teams to brainstorm ideas, write code, and build solutions, with a focus on innovation and creativity.',
  },
  {
    question: 'Do I need any prior experience?',
    answer:
      "No, hackers of any experience levels are welcome! We'll have workshops and mentors to help you get started, and beginners have the chance to win prizes specifically for first time hackers.",
  },
  {
    question: 'Where will DiamondHacks be held?',
    answer:
      'DiamondHacks will be hosted at UC San Diego, in the Computer Science & Engineering Buildings, as well as Jacobs Hall.',
  },
  {
    question: 'Who can attend DiamondHacks?',
    answer: (
      <>
        Any undergraduate students enrolled in <b>any</b> college or university are eligible to
        attend!
      </>
    ),
  },
  {
    question: 'Who can I reach out to for questions and concerns?',
    answer: (
      <>
        Please reach out to <Link href="mailto:hackathon@acmucsd.org">hackathon@acmucsd.org</Link>{' '}
        with any questions or concerns about DiamondHacks!
      </>
    ),
  },
];

export const appQuestions: Step[] = [
  {
    shortName: 'Demographics',
    title: 'Demographic Information',
    description:
      'Welcome to DiamondHacks! Our mission at DiamondHacks is to bring together hackers from diverse backgrounds to develop innovative solutions to real world problems. All experience levels are welcome. Your information will not be publicly shared other than for collecting statistics and logistics about DiamondHacks hackathon. We hope to see you there!',
    questions: [
      {
        type: 'select-one',
        id: 'grad',
        question: 'What is your expected graduation date?',
        choices: ['2025', '2026', '2027', '2028'],
        other: true,
      },
      {
        type: 'select-one',
        id: 'gender',
        question: 'What is your gender?',
        choices: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
      },
      {
        type: 'select-multiple',
        id: 'race',
        question: 'Race/Ethnicity',
        choices: [
          'White',
          'Black or African American',
          'American Indian or Alaska Native',
          'East Asian',
          'South Asian',
          'Southeast Asian',
          'Hispanic/Latino/Spanish Origin',
          'Native Hawaiian or Other Pacific Islander',
        ],
        other: true,
      },
    ],
  },
  {
    shortName: 'Additional Questions',
    title: 'Additional Questions',
    questions: [
      {
        type: 'text',
        id: 'why',
        question: 'Why do you want to participate in the DiamondHacks Hackathon?',
      },
      {
        type: 'file',
        id: 'resume',
        question: 'Upload your resume in PDF format below (Max: 100MB).',
        maxSize: 100 * 1e6,
      },
      {
        type: 'select-multiple',
        id: 'topics',
        question: 'Which topics are you most interested in?',
        choices: [
          'Software Engineering',
          'Product Design',
          'Artificial Intelligence',
          'Entrepreneurship',
          'Cybersecurity',
        ],
        inline: true,
      },
      {
        type: 'select-multiple',
        id: 'how',
        question: 'How did you hear about DiamondHacks?',
        choices: [
          'Instagram',
          'LinkedIn',
          'Facebook',
          'ACM Website',
          'Word of mouth',
          'Google Search',
          'Discord',
        ],
        inline: true,
        other: true,
      },
      {
        type: 'select-one',
        id: 'coc',
        question: (
          <>
            I have read and agree to the{' '}
            <Link href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md">
              MLH Code of Conduct
            </Link>
            .
          </>
        ),
        choices: ['Yes'],
      },
      {
        type: 'select-one',
        id: 'share-auth',
        question: (
          <>
            I authorize you to share my application/registration information with Major League
            Hacking for event administration, ranking, and MLH administration in-line with the{' '}
            <Link href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md">
              MLH Privacy Policy
            </Link>
            . I further agree to the terms of both the{' '}
            <Link href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md">
              MLH Contest Terms and Conditions
            </Link>{' '}
            and the{' '}
            <Link href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md">
              MLH Privacy Policy
            </Link>
            .
          </>
        ),
        choices: ['Yes'],
      },
      {
        type: 'select-one',
        id: 'spam',
        question: (
          <>
            I authorize MLH to send me occasional emails about relevant events, career
            opportunities, and community announcements.
          </>
        ),
        choices: ['Yes', 'No'],
        optional: true,
      },
      { type: 'text', id: 'etc', question: 'Anything else we should know?', optional: true },
    ],
  },
];

export const TIMELINE: Deadlines = {
  application: new Date('2024-12-01'),
  decisions: new Date('2024-12-25'),
  acceptance: new Date('2025-03-04'),
  hackathon: new Date('2025-04-05'),
};

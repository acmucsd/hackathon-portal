import Link from 'next/link';
import { FAQQuestion } from './components/FAQAccordion';
import { Deadlines } from './components/Dashboard';
import { Step } from './components/ApplicationStep';
import { iso31661 } from 'iso-3166';

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
    answer: (
      <>
        A hackathon is an event where hackers come together to collaborate, create, and develop
        projects within a set timeframe (usually 24–48 hours). Participants form teams to brainstorm
        ideas, write code, and build solutions, with a focus on innovation and creativity.
      </>
    ),
  },
  {
    question: 'Do I need any prior experience?',
    answer: (
      <>
        No, hackers of any experience levels are welcome! We'll have workshops and mentors to help
        you get started, and beginners have the chance to win prizes specifically for first time
        hackers.
      </>
    ),
  },
  {
    question: 'Where will DiamondHacks be held?',
    answer: (
      <>
        DiamondHacks will be hosted at UC San Diego, in the Computer Science & Engineering
        Buildings, as well as Jacobs Hall.
      </>
    ),
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
    description: (
      <>
        Welcome to DiamondHacks! Our mission at DiamondHacks is to bring together hackers from
        diverse backgrounds to develop innovative solutions to real world problems. All experience
        levels are welcome. Your information will not be publicly shared other than for collecting
        statistics and logistics about DiamondHacks hackathon. We hope to see you there!
      </>
    ),
    questions: [
      {
        type: 'phone',
        id: 'phone',
        question: <>Phone</>,
        placeholder: '(858) 534-2230',
      },
      {
        type: 'dropdown',
        id: 'age',
        question: <>Age</>,
        choices: ['18', '19', '20', '21', '22', '23', '24', '25', '25+'],
        inline: true,
      },
      {
        type: 'select-one',
        id: 'grad',
        question: <>What is your expected graduation date?</>,
        choices: ['2025', '2026', '2027', '2028'],
        other: true,
      },
      {
        type: 'select-one',
        id: 'level',
        question: <>Level of Study</>,
        choices: [
          'Less than Secondary / High School',
          'Secondary / High School',
          'Undergraduate University (2 year - community college or similar)',
          'Undergraduate University (3+ year)',
          'Graduate University (Masters, Professional, Doctoral, etc)',
          'Code School / Bootcamp',
          'Other Vocational / Trade Program or Apprenticeship',
          'Post Doctorate',
          'Other',
          'I’m not currently a student',
          'Prefer not to answer',
        ],
      },
      {
        type: 'select-one',
        id: 'major',
        question: <>Major/Field of Study</>,
        choices: [
          'Computer science, mathematics-computer science, computer engineering, or software engineering',
          'Another engineering discipline (such as civil, electrical, mechanical, etc.)',
          'Information systems, information technology, or system administration',
          'A natural science (such as biology, chemistry, physics, etc.)',
          'Mathematics or statistics',
          'Web development or web design',
          'Business discipline (such as accounting, finance, marketing, etc.)',
          'Humanities discipline (such as literature, history, philosophy, etc.)',
          'Social science (such as anthropology, psychology, political science, etc.)',
          'Fine arts or performing arts (such as graphic design, music, studio art, etc.)',
          'Health science (such as nursing, pharmacy, radiology, etc.)',
          'Undecided / No Declared Major',
          'My school does not offer majors / primary areas of study',
          'Prefer not to answer',
        ],
        other: true,
      },
      {
        type: 'dropdown',
        id: 'country',
        question: <>Country of Residence</>,
        // TODO: put US first
        choices: iso31661.map(entry => `${entry.alpha2}: ${entry.name}`),
      },
      {
        type: 'select-multiple',
        id: 'gender',
        question: <>What is your gender?</>,
        choices: ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'],
      },
      {
        type: 'select-multiple',
        id: 'pronouns',
        question: <>Pronouns</>,
        choices: ['She/Her', 'He/Him', 'They/Them', 'She/They', 'He/They', 'Prefer Not to Answer'],
        other: true,
        optional: true,
      },
      {
        type: 'select-multiple',
        id: 'sexuality',
        question: <>Do you consider yourself to be any of the following?</>,
        choices: ['Heterosexual or straight', 'Gay or lesbian', 'Bisexual', 'Prefer Not to Answer'],
        other: true,
        optional: true,
      },
      {
        type: 'select-multiple',
        id: 'race',
        question: <>Race/Ethnicity</>,
        choices: [
          'Asian Indian',
          'Chinese',
          'Filipino',
          'Guamanian or Chamorro',
          'Middle Eastern',
          'White',
          'Black or African American',
          'Hispanic / Latino / Spanish Origin',
          'Japanese',
          'Korean',
          'Native American or Alaskan Native',
          'Native Hawaiian',
          'Samoan',
          'Vietnamese',
          'Other Asian (Thai, Cambodian, etc)',
          'Other Pacific Islanders',
          'Prefer Not To Answer',
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
        question: <>Why do you want to participate in the DiamondHacks Hackathon?</>,
      },
      {
        type: 'file',
        id: 'resume',
        question: <>Upload your resume in PDF format below (Max: 100MB).</>,
        maxSize: 100 * 1e6,
        fileTypes: '.pdf,.doc,.docx',
      },
      {
        type: 'select-multiple',
        id: 'topics',
        question: <>Which topics are you most interested in?</>,
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
        question: <>How did you hear about DiamondHacks?</>,
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
        type: 'url',
        id: 'linkedin',
        question: <>Linkedin URL</>,
        placeholder: 'https://www.linkedin.com/in/',
      },
      {
        type: 'select-one',
        id: 'will-attend',
        question: (
          <>
            If accepted, I am attending DiamondHacks on April 4-5 at UC San Diego.
            <br />
            <br />
            Please note that we are unfortunately unable to provide travel reimbursements or
            accommodations at this time!
          </>
        ),
        choices: ['Yes', 'No'],
      },
      {
        type: 'select-one',
        id: 'coc',
        question: (
          <>
            I have read and agree to the{' '}
            <Link
              href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
              target="_blank"
            >
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
            <Link
              href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
              target="_blank"
            >
              MLH Privacy Policy
            </Link>
            . I further agree to the terms of both the{' '}
            <Link
              href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
              target="_blank"
            >
              MLH Contest Terms and Conditions
            </Link>{' '}
            and the{' '}
            <Link
              href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
              target="_blank"
            >
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

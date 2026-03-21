import { StaticImageData } from 'next/image';

export interface SponsorTask {
  id: 'browser-use' | 'fetch-ai' | 'qualcomm';
  image: StaticImageData;
  imageAlt: string;
  title: string;
  subtitle: string;
  points: number;
  completed?: boolean;
  variant: 'input' | 'static';
  buttonLabel: string;
  href?: string;
  instructionsLink?: string;
}

export const SPONSOR_TASKS: SponsorTask[] = [
  {
    id: 'fetch-ai',
    image: require('@/../public/assets/fetch_logo_white 1.png'),
    imageAlt: 'Fetch.AI Logo',
    title: 'Sign up for Fetch.AI',
    subtitle: 'View Instructions',
    points: 5,
    completed: false,
    variant: 'input',
    buttonLabel: 'Verify',
    instructionsLink:
      'https://docs.google.com/document/d/1zozdMkAVhDIxYlxsto2DcfS0ztuMg7Hy0Hr_qXUEEVg/edit?tab=t.0',
  },
  {
    id: 'browser-use',
    image: require('@/../public/assets/browseruse.png'),
    imageAlt: 'Atom Icon',
    title: 'Opt in for Browser Use Credits',
    subtitle: 'Get $75 free credits',
    points: 5,
    variant: 'static',
    buttonLabel: 'Opt In',
    href: 'https://www.notion.so/acmucsd/Onboarding-Checklist-Sponsors-314143915b1280c78f32e929a28c7dd0',
  },

  {
    id: 'qualcomm',
    image: require('@/../public/assets/Qualcomm-Logo.svg 1.png'),
    imageAlt: 'Qualcomm Logo',
    title: 'Apply for Qualcomm Multiverse',
    subtitle: 'Submit a project proposal to unlock this exclusive sponsor track.',
    points: 5,
    variant: 'static',
    buttonLabel: 'Apply Now',
    href: 'https://www.notion.so/acmucsd/Onboarding-Checklist-Sponsors-314143915b1280c78f32e929a28c7dd0',
  },
];

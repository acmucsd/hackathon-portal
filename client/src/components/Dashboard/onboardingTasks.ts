import { StaticImageData } from 'next/image';
import Crest from '@/../public/assets/crest.png';
import BrowserUseLogo from '@/../public/assets/sponsors/browser-use.png';
import QualcommLogo from '@/../public/assets/sponsors/qualcomm.png';
import FetchAiLogo from '@/../public/assets/sponsors/fetch-ai.png';
import { FormType } from '@/lib/types/enums';

export interface OnboardingTask {
  image: StaticImageData;
  imageAlt: string;
  title: string;
  subtitle?: string;
  subtitleLink?: string;
  href?: string;
  buttonLabel: string;
  formType?: FormType;
  variant?: 'primary' | 'secondary' | 'tertiary';
  openNewTab?: boolean;
  required?: boolean;
  completed?: boolean;
  isFetchAi?: boolean;
  points?: number;
}

export const ONBOARDING_TASKS: OnboardingTask[] = [
  {
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the RSVP form',
    subtitle:
      'This confirms your attendance and allows us to send you important updates about the event.',
    href: '/rsvp',
    buttonLabel: 'Complete',
    formType: FormType.RSVP,
    required: true,
  },
  {
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the Photo Release Waiver',
    subtitle: 'This allows us to use photos of you at the event for promotional purposes.',
    href: '/photoRelease',
    buttonLabel: 'Complete',
    formType: FormType.PHOTO_RELEASE,
    required: true,
  },
  {
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the Liability Waiver',
    subtitle:
      'This releases from liability for any injuries or damages you may sustain while participating in the event.',
    href: '/liability',
    buttonLabel: 'Complete',
    formType: FormType.LIABILITY_WAIVER,
    required: true,
  },
  {
    image: BrowserUseLogo,
    imageAlt: 'Browser Use Logo',
    title: 'Opt in for Browser Use Credits',
    subtitle: 'Get $75 free credits',
    href: 'https://www.notion.so/acmucsd/Onboarding-Checklist-Sponsors-314143915b1280c78f32e929a28c7dd0',
    buttonLabel: 'Opt In',
    openNewTab: true,
  },
  {
    image: QualcommLogo,
    imageAlt: 'Qualcomm Logo',
    title: 'Apply for Qualcomm Multiverse',
    subtitle: 'Submit a project proposal to unlock this exclusive sponsor track.',
    href: 'https://www.notion.so/acmucsd/Onboarding-Checklist-Sponsors-314143915b1280c78f32e929a28c7dd0',
    buttonLabel: 'Apply Now',
    openNewTab: true,
  },
  {
    image: FetchAiLogo,
    imageAlt: 'Fetch.AI Logo',
    title: 'Sign up for Fetch.AI',
    subtitle: 'View Instructions',
    subtitleLink:
      'https://docs.google.com/document/d/1zozdMkAVhDIxYlxsto2DcfS0ztuMg7Hy0Hr_qXUEEVg/edit?tab=t.0',
    buttonLabel: 'Verify',
    isFetchAi: true,
    points: 15,
  },
];

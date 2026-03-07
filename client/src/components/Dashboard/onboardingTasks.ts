import { StaticImageData } from 'next/image';
import Racoon from '@/../public/assets/racoon.png';
import Sungod from '@/../public/assets/sungod-mini.png';
import Geisel from '@/../public/assets/geisel-mini.png';
import KingTriton from '@/../public/assets/king-triton-mini.png';
import Crest from '@/../public/assets/crest.png';
import { FormType } from '@/lib/types/enums';

export interface OnboardingTask {
  image: StaticImageData;
  imageAlt: string;
  title: string;
  href: string;
  buttonLabel: string;
  /** When defined, the task is tracked as complete once a matching response exists. */
  formType?: FormType;
  variant?: 'primary' | 'secondary' | 'tertiary';
  openNewTab?: boolean;
}

export const ONBOARDING_TASKS: OnboardingTask[] = [
  {
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the RSVP form',
    href: '/rsvp',
    buttonLabel: 'Complete',
    formType: FormType.RSVP,
  },
  {
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the Photo Release Waiver',
    href: '/photoRelease',
    buttonLabel: 'Complete',
    formType: FormType.PHOTO_RELEASE,
  },
  {
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the Liability Waiver',
    href: '/liability',
    buttonLabel: 'Complete',
    formType: FormType.LIABILITY_WAIVER,
  },
  {
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the Travel Reimbursement Form (optional)',
    href: 'https://forms.gle/AC4muEz1rboJvb2PA',
    buttonLabel: 'Complete',
    variant: 'secondary',
    openNewTab: true,
  },
];

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
  subtitle?: string;
  href: string;
  buttonLabel: string;
  /** When defined, the task is tracked as complete once a matching response exists. */
  formType?: FormType;
  variant?: 'primary' | 'secondary' | 'tertiary';
  openNewTab?: boolean;
  required?: boolean;
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
    image: Crest,
    imageAlt: 'DiamondHacks Crest',
    title: 'Fill out the Travel Reimbursement Form',
    subtitle: 'This allows us to reimburse you for travel expenses related to the event.',
    href: 'https://forms.gle/jCheppRDgi5NYhvQ6',
    buttonLabel: 'Complete',
    variant: 'secondary',
    openNewTab: true,
  },
];

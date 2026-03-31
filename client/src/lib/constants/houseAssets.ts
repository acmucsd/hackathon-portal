import { confetti, confettiMobile, badges, books } from '@/../public/assets/houses';
import { House } from '../types/enums';
import { StaticImageData } from 'next/image';

export interface HouseAssets {
  confetti: StaticImageData | string;
  confettiMobile: StaticImageData | string;
  badge: StaticImageData | string;
  books: StaticImageData | string;
}

export const houseAssets: Record<House, HouseAssets> = {
  [House.RACCOON]: {
    confetti: confetti.green,
    confettiMobile: confettiMobile.green,
    badge: badges.raccoon,
    books: books.green,
  },
  [House.SUN_GOD]: {
    confetti: confetti.red,
    confettiMobile: confettiMobile.red,
    badge: badges.sunGod,
    books: books.red,
  },
  [House.GEISEL]: {
    confetti: confetti.blue,
    confettiMobile: confettiMobile.blue,
    badge: badges.geisel,
    books: books.blue,
  },
  [House.TRITON]: {
    confetti: confetti.yellow,
    confettiMobile: confettiMobile.yellow,
    badge: badges.kingTriton,
    books: books.yellow,
  },
  [House.UNASSIGNED]: {
    confetti: '',
    confettiMobile: '',
    badge: '',
    books: '',
  },
} as const;

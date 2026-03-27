import { confetti, confettiMobile, badges, books } from '@/../public/assets/houses';

export const houseAssets = {
  RACCOON: {
    confetti: confetti.green,
    confettiMobile: confettiMobile.green,
    badge: badges.raccoon,
    books: books.green,
  },
  SUN_GOD: {
    confetti: confetti.red,
    confettiMobile: confettiMobile.red,
    badge: badges.sunGod,
    books: books.red,
  },
  GEISEL: {
    confetti: confetti.blue,
    confettiMobile: confettiMobile.blue,
    badge: badges.geisel,
    books: books.blue,
  },
  TRITON: {
    confetti: confetti.yellow,
    confettiMobile: confettiMobile.yellow,
    badge: badges.kingTriton,
    books: books.yellow,
  },
  UNASSIGNED: {
    confetti: '',
    confettiMobile: '',
    badge: '',
    books: '',
  },
} as const;

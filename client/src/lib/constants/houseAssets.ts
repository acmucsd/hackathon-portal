import {
  confetti,
  confettiMobile,
  badges,
  books,
  mascotDashboards,
  mascotDashboardsMobile,
} from '@/../public/assets/houses';
import { House } from '../types/enums';
import { StaticImageData } from 'next/image';

export interface HouseAssets {
  confetti: StaticImageData | string;
  confettiMobile: StaticImageData | string;
  badge: StaticImageData | string;
  books: StaticImageData | string;
  mascotDashboard: StaticImageData | string;
  mascotDashboardMobile: StaticImageData | string;
}

export const houseAssets: Record<House, HouseAssets> = {
  [House.RACCOON]: {
    confetti: confetti.green,
    confettiMobile: confettiMobile.green,
    badge: badges.raccoon,
    books: books.green,
    mascotDashboard: mascotDashboards.raccoon,
    mascotDashboardMobile: mascotDashboardsMobile.raccoon,
  },
  [House.SUN_GOD]: {
    confetti: confetti.red,
    confettiMobile: confettiMobile.red,
    badge: badges.sunGod,
    books: books.red,
    mascotDashboard: mascotDashboards.sunGod,
    mascotDashboardMobile: mascotDashboardsMobile.sunGod,
  },
  [House.GEISEL]: {
    confetti: confetti.blue,
    confettiMobile: confettiMobile.blue,
    badge: badges.geisel,
    books: books.blue,
    mascotDashboard: mascotDashboards.geisel,
    mascotDashboardMobile: mascotDashboardsMobile.geisel,
  },
  [House.TRITON]: {
    confetti: confetti.yellow,
    confettiMobile: confettiMobile.yellow,
    badge: badges.kingTriton,
    books: books.yellow,
    mascotDashboard: mascotDashboards.kingTriton,
    mascotDashboardMobile: mascotDashboardsMobile.kingTriton,
  },
  [House.UNASSIGNED]: {
    confetti: '',
    confettiMobile: '',
    badge: '',
    books: '',
    mascotDashboard: '',
    mascotDashboardMobile: '',
  },
} as const;

export interface RecommendedItem {
  label: string;
  href: string;
  prefix?: string;
  suffix?: string;
}

export const RECOMMENDED_ITEMS: RecommendedItem[] = [
  {
    label: 'Travel Reimbursement Form',
    href: 'https://forms.gle/jCheppRDgi5NYhvQ6',
    prefix: '[Optional] Fill out the ',
  },
  {
    label: "View DiamondHacks' Hacker Guide",
    href: 'https://acmucsd.notion.site/diamondhacks-hacker-guide-2026',
  },
  {
    label: 'Join the DiamondHacks Discord Server',
    href: 'https://acmurl.com/diamondhacks26-discord',
    suffix: ' for real-time, up-to-date announcements!',
  },
];

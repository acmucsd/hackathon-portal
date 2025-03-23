export interface Resource {
  title: string;
  link: string;
  resource_type: string;
  cover_image: string;
}

export const FRONTEND_RESOURCES: Resource[] = [
  {
    title: 'TypeScript Handbook',
    link: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    resource_type: 'documentation',
    cover_image: '/assets/diamond-pile-right.png',
  },
  {
    title: 'MDN Web Docs',
    link: 'https://developer.mozilla.org/',
    resource_type: 'tutorial',
    cover_image: '/assets/diamond-pile-left.png',
  },
  {
    title: 'JavaScript Info',
    link: 'https://javascript.info/',
    resource_type: 'blog',
    cover_image: '/assets/acm-logo.png',
  },
  {
    title: 'MDN Web Docs 2',
    link: 'https://developer.mozilla.org/',
    resource_type: 'tutorial',
    cover_image: '/assets/diamond-pile-left.png',
  },
  {
    title: 'JavaScript Info 2',
    link: 'https://javascript.info/',
    resource_type: 'blog',
    cover_image: '/assets/acm-logo.png',
  },
];

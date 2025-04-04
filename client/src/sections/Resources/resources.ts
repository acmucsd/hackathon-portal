export interface Resource {
  title: string;
  link: string;
  resource_type: string;
  cover_image: string;
}

export const FRONTEND_RESOURCES: Resource[] = [
  {
    title: 'React Native Starterpack',
    link: 'https://github.com/acmucsd-diamondhacks/react-native-starterpack',
    resource_type: 'repository',
    cover_image: '/assets/resources/react-native.svg',
  },
  {
    title: 'Next Workshop',
    link: 'https://github.com/acmucsd-diamondhacks/next-workshop',
    resource_type: 'repository',
    cover_image: '/assets/resources/next-js.png',
  },
  {
    title: 'Hack School',
    link: 'https://hack.acmucsd.com/hack-school/',
    resource_type: 'repository',
    cover_image: '/assets/resources/acm-hack.svg',
  },
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
    cover_image: '/assets/diamond-hacks-logo.png',
  },
  {
    title: 'JavaScript Info',
    link: 'https://javascript.info/',
    resource_type: 'blog',
    cover_image: '/assets/diamond-hacks-logo.png',
  },
];

export const BACKEND_RESOURCES: Resource[] = [
  {
    title: 'MERN Stack Template',
    link: 'https://github.com/acmucsd-diamondhacks/mern-template',
    resource_type: 'repository',
    cover_image: '/assets/resources/mern-stack.png',
  },
  {
    title: 'Express and MongoDB Hack School Tutorials',
    link: 'https://hack.acmucsd.com/hack-school/express',
    resource_type: 'repository',
    cover_image: '/assets/resources/acm-hack.svg',
  },
  {
    title: 'Node.js Docs',
    link: 'https://nodejs.org/en/docs/',
    resource_type: 'documentation',
    cover_image: '/assets/diamond-hacks-logo.png',
  },
  {
    title: 'Express.js Docs',
    link: 'https://expressjs.com/',
    resource_type: 'documentation',
    cover_image: '/assets/diamond-hacks-logo.png',
  },
  {
    title: 'MongoDB Docs',
    link: 'https://docs.mongodb.com/',
    resource_type: 'documentation',
    cover_image: '/assets/diamond-hacks-logo.png',
  },
];

export const API_RESOURCES: Resource[] = [
  {
    title: 'FastAPI template',
    link: 'https://github.com/acmucsd-diamondhacks/fastapi-template',
    resource_type: 'repository',
    cover_image: '/assets/resources/fastapi.png',
  },
];

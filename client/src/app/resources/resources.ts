export interface Resource {
  title: string;
  link: string;
  resource_type: string;
  cover_image: string;
  tags: string[];
}

export const RESOURCES: Resource[] = [
  {
    title: 'ACM Hack School',
    link: 'https://hack.acmucsd.com/hack-school/',
    resource_type: 'tutorial',
    cover_image: '/assets/resources/acm-hack.svg',
    tags: ['Frontend', 'Backend'],
  },
  {
    title: 'MERN Stack Starter Pack',
    link: 'https://github.com/acmucsd-diamondhacks/mern-template',
    resource_type: 'starter_pack',
    cover_image: '/assets/resources/mern-stack.png',
    tags: ['Frontend', 'Backend'],
  },
  {
    title: 'Express and MongoDB (ACM Hack School)',
    link: 'https://hack.acmucsd.com/hack-school/express',
    resource_type: 'tutorial',
    cover_image: '/assets/resources/acm-hack.svg',
    tags: ['Backend'],
  },
  {
    title: 'Flask Starter Pack',
    link: 'https://github.com/MLH/mlh-hackathon-flask-starter',
    resource_type: 'starter_pack',
    cover_image: '/assets/resources/flask.png',
    tags: ['Frontend', 'Backend'],
  },
  {
    title: 'React Native Starterpack',
    link: 'https://github.com/acmucsd-diamondhacks/react-native-starterpack',
    resource_type: 'starter_pack',
    cover_image: '/assets/resources/react-native.svg',
    tags: ['Mobile', 'Frontend'],
  },
  {
    title: 'FastAPI Starter Pack',
    link: 'https://github.com/acmucsd-diamondhacks/fastapi-template',
    resource_type: 'starter_pack',
    cover_image: '/assets/resources/fastapi.png',
    tags: ['Backend'],
  },
  {
    title: 'Intro to Next.js',
    link: 'https://acmurl.com/next-workshop-2024',
    resource_type: 'tutorial',
    cover_image: '/assets/resources/next-js.png',
    tags: ['Frontend'],
  },
  {
    title: 'Intro to Auth0',
    link: 'https://hackp.ac/auth0-gettingstarted',
    resource_type: 'tutorial',
    cover_image: '/assets/resources/auth0.png',
    tags: ['Authentication'],
  },
  {
    title: 'Fetch.ai Innovation Lab Docs',
    link: 'https://innovationlab.fetch.ai/resources/docs/intro',
    resource_type: 'documentation',
    cover_image: '/assets/sponsors/fetch-ai.png',
    tags: ['AI'],
  },
  {
    title: 'Fetch.ai Innovation Lab Examples',
    link: 'https://github.com/fetchai/innovation-lab-examples',
    resource_type: 'documentation',
    cover_image: '/assets/sponsors/fetch-ai.png',
    tags: ['AI'],
  },
  {
    title: 'Browser Use Cloud Quickstart',
    link: 'https://docs.browser-use.com/cloud/quickstart',
    resource_type: 'documentation',
    cover_image: '/assets/sponsors/browser-use.png',
    tags: ['AI'],
  },
  {
    title: 'TwelveLabs Docs (Get Started)',
    link: 'https://docs.twelvelabs.io/docs/get-started/introduction',
    resource_type: 'documentation',
    cover_image: '/assets/sponsors/twelvelabs.png',
    tags: ['AI'],
  },
];

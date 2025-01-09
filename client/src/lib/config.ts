const config = {
  api: {
    baseApiUrl: process.env.NEXT_PUBLIC_ACM_API_URL,
    baseUrl: process.env.VERCEL_URL || process.env.NEXT_PUBLIC_BASE_URL,
    endpoints: {
      auth: {
        register: '/user',
        login: '/user/login',
      },
      user: {
        user: '/user',
      },
    },
  },
};

export default config;

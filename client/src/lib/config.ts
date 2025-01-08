const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_ACM_API_URL,
    endpoints: {
      auth: {
        register: '/user',
      },
      user: {
        user: '/user',
      },
    },
  },
};

export default config;

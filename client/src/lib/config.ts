const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_ACM_API_URL,
    endpoints: {
      auth: {
        register: '/user',
        login: '/user/login',
      },
      user: {
        user: '/user',
      },
      response: {
        response: '/response',
        application: '/response/application',
      },
      admin: {
        applications: '/admin/applications',
        application: '/admin/application'
      },
    },
  },
};

export default config;

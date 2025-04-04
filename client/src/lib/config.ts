const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_ACM_API_URL,
    endpoints: {
      auth: {
        register: '/user',
        login: '/user/login',
        forgotPassword: '/user/forgot-password',
      },
      user: {
        user: '/user',
      },
      response: {
        response: '/response',
        application: '/response/application',
        liabilityWaiver: '/response/liability-waiver',
        photoRelease: '/response/photo-release',
      },
      admin: {
        applications: '/admin/applications',
        application: '/admin/application',
        users: '/admin/users',
        userApplication: '/admin/user',
        waivers: '/admin/waivers',
        confirmUser: '/admin/user/confirm',
      },
      event: {
        createEvent: '/event',
        getAllEvents: '/event',
        getPublishedEvents: '/event/published',
        getEvent: '/event',
        updateEvent: '/event',
        deleteEvent: '/event',
      },
    },
  },
};

export default config;

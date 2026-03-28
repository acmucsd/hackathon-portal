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
        fetchAiHandle: '/user/fetch-ai-handle',
      },
      response: {
        response: '/response',
        application: '/response/application',
        liabilityWaiver: '/response/liability-waiver',
        photoRelease: '/response/photo-release',
        rsvp: '/response/rsvp',
      },
      admin: {
        applications: '/admin/applications',
        application: '/admin/application',
        users: '/admin/users',
        userApplication: '/admin/user',
        waivers: '/admin/waivers',
        confirmUser: '/admin/user/confirm',
        attendance: '/admin/attendance',
        emailVerificationLink: '/admin/email-verification-link',
        passwordResetLink: '/admin/password-reset-link',
        assignments: '/admin/assignments',
        randomizeAssignments: '/admin/assignments/random',
        reviewerOverview: '/admin/reviewer-overview',
        releaseDecisions: '/admin/release-decisions',
        setAcceptanceDeadlinePassed: '/admin/applications/set-acceptance-deadline-passed',
      },
      event: {
        createEvent: '/event',
        getAllEvents: '/event',
        getPublishedEvents: '/event/published',
        getEvent: '/event',
        updateEvent: '/event',
        deleteEvent: '/event',
      },
      leaderboard: {
        leaderboard: '/leaderboard',
      },
    },
  },
};

export default config;

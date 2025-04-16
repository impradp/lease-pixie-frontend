export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/login",
    REFRESH_TOKEN: "/api/auth/refresh-token",
    RESET_LOGIN: "/api/v1/reset-user",
    RESET_VERIFY: "/api/v1/verify-reset-code",
    RESOLVE_CONSENT: "/api/v1/consent",
  },
  USER: {
    SELF: "/api/index",
    ADMIN: {
      DEFAULT: "/api/v1/admin",
      DELETE: "/api/v1/admin/%s",
    },
  },
  ACCOUNT: {
    DEFAULT: "/api/v1/account",
    EDIT: {
      DEFAULT: "/api/v1/account/%s",
      ACCESS: "/api/v1/account/%s/lock",
    },
    FETCH: {
      DEFAULT: "/api/v1/account",
      BY_ID: "/api/v1/account/%s",
    },
  },
  PORTFOLIO: {
    ADD: {
      DEFAULT: "/api/v1/portfolio",
      VENDOR: "/api/v1/portfolio/vendor",
      USER: "/api/v1/portfolio/user",
    },
    FETCH: {
      DEFAULT: "/api/v1/portfolio",
      BY_ID: "/api/v1/portfolio/%s",
      VENDORS: "/api/v1/portfolio/vendors",
      USERS: "/api/v1/portfolio/users?attachPortfolio=%s",
    },
  },

  PROPERTY: {
    FETCH: {
      DEFAULT: "/api/v1/properties",
    },
  },
} as const;

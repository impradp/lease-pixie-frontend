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
  },
  ACCOUNT: {
    DEFAULT: "/api/v1/account",
  },
  PORTFOLIO: {
    ADD_USER: "/api/v1/portfolio/user",
    GET_USERS: "/api/v1/portfolio/users?attachPortfolio=%s",
    ADD_VENDOR: "/api/v1/portfolio/vendor",
    GET_VENDORS: "/api/v1/portfolio/vendors",
    ADD: "/api/v1/portfolio",
  },
} as const;

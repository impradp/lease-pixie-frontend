export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/login",
    REFRESH_TOKEN: "/api/auth/refresh-token",
  },
  USER: {
    SELF: "/api/index",
  },
  ACCOUNT: {
    CREATE: "/account",
  },
} as const;

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
    VERIFY: {
      TOTP: "/api/v1/verify-totp",
    },
  },

  VENDOR: {
    DEFAULT: "/api/v1/vendor",
    FETCH: {
      DEFAULT: "/api/v1/vendor",
      BY_ID: "/api/v1/vendor/%s",
    },
    DELETE: {
      DEFAULT: "/api/v1/vendor/%s",
    },
    UPDATE: {
      DEFAULT: "/api/v1/vendor/%s",
    },
    RESTORE: {
      DEFAULT: "/api/v1/vendor/%s/restore",
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
      USER: {
        DEFAULT:
          "/api/v1/account/portfolio-user?accountId=%s&attachPortfolio=%s",
      },
    },
    ADD: {
      USER: {
        DEFAULT: "/api/v1/account/portfolio-user",
      },
    },
    DELETE: {
      DEFAULT: "/api/v1/account/%s",
    },
  },
  DEPOSIT_ACCOUNT: {
    DEFAULT: "/api/v1/deposit-account",
    EDIT: {
      DEFAULT: "/api/v1/deposit-account/%s",
      SETUP_MERCHANT: "/api/v1/deposit-account/%s/setup/merchant",
      SETUP_PLAID: "/api/v1/deposit-account/%s/setup/plaid",
    },
    FETCH: "/api/v1/deposit-account?accountId=%s",
  },
  PLAID: {
    LINK_TOKEN: "/api/v1/plaid/create/link-token",
  },
  PORTFOLIO: {
    DEFAULT: "/api/v1/portfolio",
    ADD: {
      DEFAULT: "/api/v1/portfolio",
      VENDOR: "/api/v1/portfolio/vendor",
      USER: "/api/v1/portfolio/user",
    },
    FETCH: {
      DEFAULT: "/api/v1/portfolio",
      BY_ID: "/api/v1/portfolio/%s",
      BY_ACCOUNT_ID: "/api/v1/portfolio/account/%s",
      VENDORS: "/api/v1/portfolio/vendors",
    },
    UPDATE: {
      DEFAULT: "/api/v1/portfolio/%s",
    },
    DELETE: {
      USER: "/api/v1/portfolio/users/%s",
    },
  },

  PROPERTY: {
    FETCH: {
      DEFAULT: "/api/v1/properties",
      BY_ACCOUNT_ID: "/api/v1/properties/account/%s",
    },
  },
} as const;

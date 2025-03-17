export type Messages = {
  portfolio: {
    title: string;
    name: string;
    user: {
      title: string;
      titleSecondary: string;
      commonName: string;
      defaultSelectionLabel: string;
      button: { label: string; type: "button" | "submit" | "reset" };
      modal: {
        title: string;
        button: { label: string; type: "button" | "submit" | "reset" };
      };
      confirmModal: {
        title: string;
        message: string;
      };
    };
    users: {
      title: string;
      primaryUserTitle: string;
      secondaryUserTitle: string;
      commonName: string;
      defaultSelectionLabel: string;
      button: { label: string; type: "button" | "submit" | "reset" };
      modal: {
        title: string;
        button: { label: string; type: "button" | "submit" | "reset" };
      };
      confirmModal: {
        title: string;
        message: string;
      };
    };
    vendor: {
      title: string;
      titleSecondary: string;
      titleTertiary: string;
      primaryInfo: string;
      secondaryInfo: string;
      tertiaryInfo: string;
      defaultSelectionLabel: string;
      button: { label: string; type: "button" | "submit" | "reset" };
      modal: {
        title: string;
        button: { label: string; type: "button" | "submit" | "reset" };
      };
      confirmModal: {
        title: string;
        message: string;
      };
    };
    vendors: {
      title: string;
      primaryVendorTitle: string;
      secondaryVendorTitle: string;
      tertiaryVendorTitle: string;
      primaryInfo: string;
      secondaryInfo: string;
      tertiaryInfo: string;
      defaultSelectionLabel: string;
      button: { label: string; type: "button" | "submit" | "reset" };
      modal: {
        title: string;
        button: { label: string; type: "button" | "submit" | "reset" };
      };
      confirmModal: {
        title: string;
        message: string;
      };
    };
    automation: {
      title: string;
      syncTitle: string;
      info: string;
    };
    button: { label: string; type: "button" | "submit" | "reset" };
    confirmModal: {
      title: string;
      message: string;
    };
  };
  property: {
    automation: {
      title: string;
      syncTitle: string;
      info: string;
    };
  };
};

export const locales = {
  en: "English",
} as const;

export type Locale = keyof typeof locales;

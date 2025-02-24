import { Messages } from "./index";

const en: Messages = {
  portfolio: {
    title: "Portfolio",
    name: "Portfolio name",
    user: {
      title: "Primary Portfolio User",
      titleSecondary: "Secondary Portfolio User",
      commonName: "Portfolio User",
      defaultSelectionLabel: "Select user",
      button: { label: "Add Portfolio User", type: "submit" },
      modal: {
        title: "Create Portfolio User",
        button: { label: "Create User", type: "submit" },
      },
      confirmModal: {
        title: "User Added",
        message: "User successfully added.",
      },
    },
    vendor: {
      title: "Preferred Tax Reporting Seat",
      titleSecondary: "Preferred Insurance Seat",
      titleTertiary: "Preferred Attorney Seat",
      primaryInfo:
        "Accounting Seat: included in workflows to provide tax related reports to file taxes",
      secondaryInfo:
        "Property Insurance Seat: included in workflows related to property insurance coverage",
      tertiaryInfo:
        "Attorney Seat: included in workflows related to legal lease document production and tenant defaults. This seat will be requested to produce legal documents and must be licensed to practice law in the state in which the property is located.",
      defaultSelectionLabel: "Select vendor",
      button: { label: "Add Vendor", type: "submit" },
      modal: {
        title: "New Vendor",
        button: { label: "Add Vendor", type: "submit" },
      },
      confirmModal: {
        title: "Vendor Added",
        message: "Vendor successfully added.",
      },
    },
    button: { label: "Add Portfolio", type: "button" },
    confirmModal: {
      title: "Portfolio Added",
      message: "Portfolio successfully added.",
    },
  },
};

export default en;

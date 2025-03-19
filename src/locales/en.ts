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
    users: {
      title: "Portfolio Users",
      primaryUserTitle: "Primary Portfolio User",
      secondaryUserTitle: "Secondary Portfolio User",
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

    vendors: {
      title: "Default Seats",
      primaryVendorTitle: "Insurance Seat",
      secondaryVendorTitle: "Attorney Seat",
      tertiaryVendorTitle: "Tax Reporting Seat",
      primaryInfo:
        "Property Insurance Seat: included in workflows related to property insurance coverage.",
      secondaryInfo:
        "Attorney Seat: included in workflows related to legal lease document production and tenant defaults. This seat will be requested to produce legal documents and must be licensed to practice law in the state in which the property is located.",
      tertiaryInfo:
        "Accounting Seat: included in workflows to provide tax related reports to file taxes.",
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
    automation: {
      title: "Property Automation: Sync",
      syncTitle: "Sync automation selections across portfolio",
      info: "Property Sync:  used to apply automation and workflow settings consistently across all properties in the Portfolio.  These settings at a Property level will be not editable since they are initiated and controlled here at the Portfolio level. Certain features must be scheduled in sequence; in example, sending a paper mail invoice must occur after sending the invoice by email in an attempt to provide an avenue to help you reduce environmental impacts.",
    },
    button: { label: "Add Portfolio", type: "button" },
    confirmModal: {
      title: "Portfolio Added",
      message: "Portfolio successfully added.",
    },
  },
  property: {
    automation: {
      title: "Workflow Automation",
      syncTitle: "Sync automation selections across properties",
      info: "Property Sync:  used to apply automation and workflow settings consistently across all properties in the Portfolio.  These settings at a Property level will be not editable since they are initiated and controlled here at the Portfolio level. Certain features must be scheduled in sequence; in example, sending a paper mail invoice must occur after sending the invoice by email in an attempt to provide an avenue to help you reduce environmental impacts.",
    },
  },
};

export default en;

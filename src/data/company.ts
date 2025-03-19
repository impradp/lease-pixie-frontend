import { CompanyInfoData } from "@/types/Company";

export const sampleCompanyInfoData: CompanyInfoData = {
  companyName: "Billing Company",
  contactName: "Firstname Lastname",
  email: "email@email.com",
  services: ["Invoice", "Usage", "Support"], // Raw list of strings from backend
  actions: ["Dashboard", "Edit Account"],
  isAccessLocked: false,
  invoices: [
    { date: "Feb ‘24", amount: "$125.00", status: "Invoiced" },
    { date: "Jan ‘24", amount: "$125.00", status: "Processing" },
    { date: "Dec ‘23", amount: "$125.00", status: "Sent" },
    { date: "Dec ‘23", amount: "$125.00", status: "Sent" },
    { date: "Dec ‘23", amount: "$125.00", status: "Sent" },
    { date: "Dec ‘23", amount: "$125.00", status: "Sent" },
  ],
  portfolios: [
    {
      name: "Portfolio Name A",
      propertyId: "24H67Y",
      propertyCount: 16,
      squareFootage: "135,000 sq-ft",
      costMargins: [
        { date: "Feb ‘24", cost: "$45.65", margin: "15%", isHighlighted: true },
        { date: "Jan ‘24", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
        { date: "Average", cost: "$45.65", margin: "15%" },
      ],
    },
    {
      name: "Portfolio Name B",
      propertyId: "24H67Y",
      propertyCount: 16,
      squareFootage: "135,000 sq-ft",
      costMargins: [
        { date: "Feb ‘24", cost: "$45.65", margin: "15%", isHighlighted: true },
        { date: "Jan ‘24", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
        { date: "Dec ‘23", cost: "$45.65", margin: "15%" },
      ],
    },
  ],
};

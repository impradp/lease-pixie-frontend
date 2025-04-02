import { ServicePill } from "@/types/ServicePills";

export const INVOICE: ServicePill = {
  label: "Invoice",
  color: "#5925db",
  borderColor: "#5925db",
  textColor: "#5925db",
};

export const USAGE: ServicePill = {
  label: "Usage",
  color: "#175cd3",
  borderColor: "#175cd3",
  textColor: "#175cd3",
};

export const SUPPORT: ServicePill = {
  label: "Support",
  color: "#b93815",
  borderColor: "#b93814",
  textColor: "#b93814",
};

const servicePillMap: { [key: string]: ServicePill } = {
  Invoice: INVOICE,
  Usage: USAGE,
  Support: SUPPORT,
};

export const getServicePill = (label: string): ServicePill => {
  return (
    servicePillMap[label] || {
      label,
      color: "#000000", // Default color if not found
      borderColor: "#000000",
      textColor: "#000000",
    }
  );
};

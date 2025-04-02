"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { sampleCompanyInfoData } from "@/data/company";
import { Invoice, Portfolio } from "@/types/Company";
import { getServicePill } from "@/lib/utils/pillsColors";
import { ServicePill } from "@/types/ServicePills";
import { Pills } from "../ui/pills";
import { ToggleSwitch } from "../ui/input/ToggleSwitch";

interface CompanyInfoProps {
  companyName: string;
  contactName: string;
  email: string;
  services: string[];
  actions: string[];
  isAccessLocked: boolean;
  onToggleAccess?: () => void;
  invoices: Invoice[];
  portfolios: Portfolio[];
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({
  companyName = sampleCompanyInfoData.companyName,
  contactName = sampleCompanyInfoData.contactName,
  email = sampleCompanyInfoData.email,
  services = sampleCompanyInfoData.services,
  actions = sampleCompanyInfoData.actions,
  isAccessLocked = sampleCompanyInfoData.isAccessLocked,
  onToggleAccess,
  invoices = sampleCompanyInfoData.invoices,
  portfolios = sampleCompanyInfoData.portfolios,
}) => {
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);
  const [isPortfoliosOpen, setIsPortfoliosOpen] = useState(false);
  const [portfolioCostOpen, setPortfolioCostOpen] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleInvoices = () => setIsInvoicesOpen(!isInvoicesOpen);
  const togglePortfolios = () => setIsPortfoliosOpen(!isPortfoliosOpen);
  const togglePortfolioCost = (portfolioName: string) => {
    setPortfolioCostOpen((prev) => ({
      ...prev,
      [portfolioName]: !prev[portfolioName],
    }));
  };

  // Map raw service labels to ServicePill objects
  const servicePills: ServicePill[] = services.map((label) =>
    getServicePill(label)
  );

  return (
    <div className="w-full p-3 bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-start gap-3">
      <div className="self-stretch inline-flex justify-start items-start gap-2">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="w-full inline-flex justify-start items-start gap-1">
              <div className="flex-1 justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-tight">
                {companyName}
              </div>
              <div
                data-hierarchy="Link gray"
                data-icon="Default"
                data-size="sm"
                data-state="Default"
                className="flex justify-center items-center gap-1.5 overflow-hidden"
              >
                <div className="justify-start text-tertiary-light text-xs font-semibold font-['Inter'] underline leading-tight"></div>
              </div>
            </div>
            <div className="self-stretch h-5 inline-flex justify-between items-center">
              <div className="flex justify-center items-center gap-2.5">
                <div className="justify-start text-secondary-light text-xs font-semibold font-['Inter'] leading-[18px]">
                  Contact Name
                </div>
                <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {contactName}
                </div>
              </div>
              <div
                data-hierarchy="Link gray"
                data-icon="Default"
                data-size="sm"
                data-state="Default"
                className="flex justify-center items-center gap-1.5 overflow-hidden"
              >
                <div className="justify-start text-tertiary-light text-xs font-semibold font-['Inter'] underline leading-tight"></div>
              </div>
            </div>
            <div className="self-stretch h-5 inline-flex justify-between items-center">
              <div className="flex justify-center items-center gap-2.5">
                <div className="justify-start text-secondary-light text-xs font-semibold font-['Inter'] leading-[18px]">
                  Email
                </div>
                <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                  {email}
                </div>
              </div>
              <div
                data-hierarchy="Link gray"
                data-icon="Default"
                data-size="sm"
                data-state="Default"
                className="flex justify-center items-center gap-1.5 overflow-hidden"
              >
                <div className="justify-start text-tertiary-light text-xs font-semibold font-['Inter'] underline leading-tight"></div>
              </div>
            </div>
            {/* Use the Pills component */}
            <Pills items={servicePills} className="self-stretch py-[3px]" />
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-px bg-tertiary-stroke" />
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-center items-center gap-1">
              <div className="self-stretch inline-flex justify-center items-center gap-3">
                {actions.map((action, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-tertiary-platinumGray rounded flex justify-start items-center gap-1"
                  >
                    <div className="justify-start text-primary-button text-xs font-medium font-['Inter'] leading-[18px]">
                      {action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-between items-center">
                <div className="w-1/2 flex justify-start items-center gap-0.5">
                  <div className="justify-start text-tertiary-midnightBlue text-xs font-bold font-['Inter'] leading-tight">
                    Access
                  </div>
                </div>
                <div className="w-1/2 flex justify-end items-end gap-3">
                  <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Unlocked
                  </div>
                  {/* Use the ToggleSwitch component */}
                  <ToggleSwitch
                    isOn={isAccessLocked}
                    onToggle={onToggleAccess || (() => {})}
                    isDisabled={false}
                  />
                  <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Locked
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-px bg-tertiary-stroke" />
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div
              className="w-full h-5 flex items-center cursor-pointer"
              onClick={toggleInvoices}
            >
              <div className="w-1/2 justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-tight">
                Invoices
              </div>
              <div className="w-1/2 flex overflow-hidden justify-end">
                {isInvoicesOpen ? (
                  <ChevronUp className="w-4 h-4 text-tertiary-slateMist" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-tertiary-slateMist" />
                )}
              </div>
            </div>
            {isInvoicesOpen && (
              <div className="w-full flex flex-col justify-start items-start gap-1">
                {invoices.map((invoice, index) => (
                  <div
                    key={index}
                    className="self-stretch p-2 bg-gray-50 rounded-md flex flex-col justify-start items-start gap-1 overflow-hidden"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                      <div className="self-stretch h-[18px] inline-flex justify-start items-start gap-1">
                        <div className="w-[54px] justify-start text-tertiary-charcoalBlue text-xs font-normal font-['Inter'] underline leading-[18px]">
                          {invoice.date}
                        </div>
                        <div className="w-[54px] justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                          {invoice.amount}
                        </div>
                        <div className="flex-1 flex justify-end items-center gap-1">
                          <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                            {invoice.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="w-full h-px bg-tertiary-stroke" />
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div
              className="w-full h-5 inline-flex justify-between items-center cursor-pointer"
              onClick={togglePortfolios}
            >
              <div className="text-center justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-tight">
                Portfolios
              </div>
              <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                {isPortfoliosOpen ? (
                  <ChevronUp className="w-4 h-4 text-tertiary-slateMist" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-tertiary-slateMist" />
                )}
              </div>
            </div>
            {isPortfoliosOpen && (
              <div className="w-full flex flex-col justify-start items-start gap-1">
                {portfolios.map((portfolio, index) => (
                  <div
                    key={index}
                    className="self-stretch p-2 bg-gray-50 rounded-md flex flex-col justify-start items-start gap-3 overflow-hidden"
                  >
                    <div className="self-stretch flex flex-col justify-start items-start gap-1">
                      <div className="self-stretch inline-flex justify-start items-center gap-1">
                        <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-tight">
                          {portfolio.name}
                        </div>
                      </div>
                      <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
                        <div className="w-[321px] self-stretch flex justify-start items-center gap-2">
                          <div className="justify-start text-tertiary-light text-xs font-normal font-['Inter'] underline leading-[18px]">
                            {portfolio.propertyId}
                          </div>
                          <div className="w-2 h-2 bg-tertiary-charcoalBlue rounded-full" />
                          <div className="flex justify-start items-center gap-0.5">
                            <div className="justify-start text-tertiary-light text-xs font-normal font-['Inter'] leading-[18px]">
                              {portfolio.propertyCount}
                            </div>
                          </div>
                          <div className="w-2 h-2 bg-tertiary-charcoalBlue rounded-full" />
                          <div className="flex justify-start items-center gap-0.5">
                            <div className="justify-start text-tertiary-light text-xs font-normal font-['Inter'] leading-[18px]">
                              {portfolio.squareFootage}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-2">
                      <div className="self-stretch h-px bg-tertiary-stroke" />
                    </div>
                    <div className="self-stretch flex flex-col justify-start items-start gap-4">
                      <div className="self-stretch flex flex-col justify-start items-start gap-1">
                        <div
                          className="self-stretch inline-flex justify-between items-center cursor-pointer"
                          onClick={() => togglePortfolioCost(portfolio.name)}
                        >
                          <div className="w-[189px] justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                            Cost (Margins)
                          </div>
                          <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                            {portfolioCostOpen[portfolio.name] ? (
                              <ChevronUp className="w-4 h-4 text-tertiary-slateMist" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-tertiary-slateMist" />
                            )}
                          </div>
                        </div>
                        {portfolioCostOpen[portfolio.name] && (
                          <div className="self-stretch flex flex-col justify-start items-start gap-4">
                            {portfolio.costMargins.map((cost, idx) => (
                              <div
                                key={idx}
                                className="self-stretch h-[18px] inline-flex justify-start items-start gap-1"
                              >
                                <div className="w-[54px] justify-start text-tertiary-midnightBlue text-xs font-normal font-['Inter'] leading-[18px]">
                                  {cost.date}
                                </div>
                                <div className="w-[190px] justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                                  {cost.cost} ({cost.margin})
                                  {cost.isHighlighted && " *"}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;

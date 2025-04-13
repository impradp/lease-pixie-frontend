"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

import { ChevronDown, ChevronUp } from "lucide-react";
import { Account } from "@/types/Account";
import { Pills } from "@/components/ui/pills";
import { ServicePill } from "@/types/ServicePills";
import { getServicePill } from "@/lib/utils/pillsColors";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";

/**
 * Props for the CompanyInfo component
 */
interface CompanyInfoProps {
  details?: Account; // Account details to display
  onToggleAccess?: (accountId: string, isLocked: boolean) => Promise<boolean>; // Callback for toggling access
  onEditClick?: (id: string) => void; // Callback for edit button click
}

/**
 * Renders detailed information about a company, including services, invoices, and portfolios
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered company info component
 */
export const CompanyInfo: React.FC<CompanyInfoProps> = ({
  details,
  onToggleAccess,
  onEditClick,
}) => {
  const router = useRouter();
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false); // State for invoices section visibility
  const [isPortfoliosOpen, setIsPortfoliosOpen] = useState(false); // State for portfolios section visibility
  const [portfolioCostOpen, setPortfolioCostOpen] = useState<{
    [key: string]: boolean;
  }>({}); // State for individual portfolio cost visibility
  const [isAccessLocked, setIsAccessLocked] = useState(
    details?.isAccessLocked || false
  ); // State for access lock status

  /**
   * Syncs local access lock state with prop changes
   */
  useEffect(() => {
    setIsAccessLocked(details?.isAccessLocked || false);
  }, [details?.isAccessLocked]);

  /**
   * Toggles the visibility of the invoices section
   */
  const toggleInvoices = () => setIsInvoicesOpen(!isInvoicesOpen);

  /**
   * Toggles the visibility of the portfolios section
   */
  const togglePortfolios = () => setIsPortfoliosOpen(!isPortfoliosOpen);

  /**
   * Toggles the visibility of cost details for a specific portfolio
   * @param portfolioName - The name of the portfolio
   */
  const togglePortfolioCost = (portfolioName: string) => {
    setPortfolioCostOpen((prev) => ({
      ...prev,
      [portfolioName]: !prev[portfolioName],
    }));
  };

  /**
   * Handles toggling the access lock state with optimistic UI update
   */
  const handleToggleAccess = async () => {
    if (!details?.id) return;

    const previousLockedState = isAccessLocked;
    const newLockedState = !isAccessLocked;
    setIsAccessLocked(newLockedState);

    const success = await onToggleAccess?.(details.id, newLockedState);
    if (!success) {
      setIsAccessLocked(previousLockedState);
    }
  };

  /**
   * Handles dashboard button click
   */
  const onDashboardClick = () => {
    if (details?.id) {
      router.push(`/account?id=${details.id}`); // Route to /account/{id}
    }
  };

  /**
   * Handles edit account button click
   * @param param - Object containing the account ID
   */
  const onEditAccountClick = ({ accountId }: { accountId: string }) => {
    onEditClick?.(accountId);
  };

  // Map raw service labels to ServicePill objects
  const servicePills: ServicePill[] =
    details?.services?.map((label) => getServicePill(label)) ?? [];

  return (
    <div className="w-full p-3 bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-start gap-3">
      <div className="self-stretch inline-flex justify-start items-start gap-2">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex flex-col justify-start items-start gap-1">
            <div className="w-full inline-flex justify-start items-start gap-1">
              <div className="flex-1 justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-tight">
                {details?.companyName}
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
                  {details?.contactFirstName} {details?.contactLastName}
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
                  {details?.email}
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
            <Pills items={servicePills} className="self-stretch py-[3px]" />
          </div>
          <div className="w-full flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-px bg-tertiary-stroke" />
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-4">
            <div className="self-stretch flex flex-col justify-center items-center gap-1">
              <div className="self-stretch inline-flex justify-center items-center gap-3">
                <button
                  onClick={onDashboardClick}
                  className="px-2 py-1 bg-tertiary-platinumGray rounded flex justify-start items-center gap-1 cursor-pointer hover:bg-tertiary-platinumGray/80 active:cursor-progress"
                >
                  <div className="justify-start text-primary-button text-xs font-medium font-['Inter'] leading-[18px]">
                    Dashboard
                  </div>
                </button>
                <button
                  onClick={() =>
                    details?.id && onEditAccountClick({ accountId: details.id })
                  }
                  className="px-2 py-1 bg-tertiary-platinumGray rounded flex justify-start items-center gap-1 cursor-pointer hover:bg-tertiary-platinumGray/80 active:cursor-progress"
                >
                  <div className="justify-start text-primary-button text-xs font-medium font-['Inter'] leading-[18px]">
                    Edit Account
                  </div>
                </button>
              </div>
            </div>
            <div className="w-full flex flex-col justify-start items-start gap-2">
              <div className="w-full flex justify-between items-center">
                <div className="w-1/2 flex justify-start items-center gap-0.5">
                  <div className="justify-start text-tertiary-midnightBlue text-xs font-bold font-['Inter'] leading-tight">
                    Access
                  </div>
                </div>
                <div className="w-1/2 flex justify-end items-center gap-3">
                  <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                    Unlocked
                  </div>
                  <ToggleSwitch
                    isOn={isAccessLocked}
                    onToggle={handleToggleAccess}
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
                {(details?.invoices ?? []).map((invoice, index) => (
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
                {(details?.portfolios ?? []).map((portfolio, index) => (
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
                            {portfolio?.id}
                          </div>
                          {portfolio?.totalProperties && (
                            <>
                              <div className="w-2 h-2 bg-tertiary-charcoalBlue rounded-full" />
                              <div className="flex justify-start items-center gap-0.5">
                                <div className="justify-start text-tertiary-light text-xs font-normal font-['Inter'] leading-[18px]">
                                  {portfolio?.totalProperties}
                                </div>
                              </div>
                            </>
                          )}
                          {portfolio.squareFootage && (
                            <>
                              <div className="w-2 h-2 bg-tertiary-charcoalBlue rounded-full" />
                              <div className="flex justify-start items-center gap-0.5">
                                <div className="justify-start text-tertiary-light text-xs font-normal font-['Inter'] leading-[18px]">
                                  {portfolio.squareFootage}
                                </div>
                              </div>
                            </>
                          )}
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
                            {(portfolio.costMargins ?? []).map((cost, idx) => (
                              <div
                                key={idx}
                                className="self-stretch h-[18px] inline-flex justify-start items-start gap-1"
                              >
                                <div className="w-[54px] justify-start text-tertiary-midnightBlue text-xs font-normal font-['Inter'] leading-[18px]">
                                  {cost?.month} `{cost?.year}
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

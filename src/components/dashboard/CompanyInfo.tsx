"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { Account } from "@/types/Account";
import { ChevronRight } from "lucide-react";
import { Pills } from "@/components/ui/pills";
import { hasRole } from "@/lib/utils/authUtils";
import { ServicePill } from "@/types/ServicePills";
import { getServicePill } from "@/lib/utils/pillsColors";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";

/**
 * Props for the CompanyInfo component
 */
interface CompanyInfoProps {
  isEditable?: boolean; // Whether the component is editable (default: false)
  details?: Account; // Account details to display
  onToggleAccess?: (accountId: string, isLocked: boolean) => Promise<boolean>; // Callback for toggling access
  onEditClick?: (id: string) => void; // Callback for edit button click
  isSubmitting: (value: boolean) => void;
  onDelete?: (account: Account) => void;
  globalPortfolioSearch?: (portfolioId: string) => void; // New prop for portfolio ID click handler
}

/**
 * Renders detailed information about a company, including services, invoices, and portfolios
 * @param props - The properties for configuring the component
 * @returns JSX.Element - The rendered company info component
 */
const CompanyInfo: React.FC<CompanyInfoProps> = ({
  isEditable = false,
  details,
  onToggleAccess,
  onEditClick,
  isSubmitting,
  onDelete,
  globalPortfolioSearch,
}) => {
  const router = useRouter();
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isInvoicesOpen, setIsInvoicesOpen] = useState(false);
  const [isPortfoliosOpen, setIsPortfoliosOpen] = useState(false);
  const [portfolioCostOpen, setPortfolioCostOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const [isAccessLocked, setIsAccessLocked] = useState(
    details?.isLocked ?? false
  );

  const hasDeletePermission = hasRole("ADMINUSER");

  /**
   * Syncs local access lock state with prop changes
   */
  useEffect(() => {
    setIsAccessLocked(details?.isLocked ?? false);
  }, [details?.isLocked]);

  /**
   * Toggles the visibility of the invoices section
   */
  const toggleInvoices = useCallback(() => {
    setIsInvoicesOpen((prev) => !prev);
  }, []);

  /**
   * Toggles the visibility of the portfolios section
   */
  const togglePortfolios = useCallback(() => {
    setIsPortfoliosOpen((prev) => !prev);
  }, []);

  /**
   * Toggles the visibility of a specific account
   */
  const toggleAccounts = useCallback(() => {
    setIsAccountOpen((prev) => !prev);
  }, []);

  /**
   * Toggles the visibility of cost details for a specific portfolio
   * @param portfolioName - The name of the portfolio
   */
  const togglePortfolioCost = useCallback((portfolioName: string) => {
    setPortfolioCostOpen((prev) => ({
      ...prev,
      [portfolioName]: !prev[portfolioName] || true,
    }));
  }, []);

  /**
   * Handles toggling the access lock state with optimistic UI update
   */
  const handleToggleAccess = useCallback(async () => {
    if (!details?.id) return;

    const previousLockedState = isAccessLocked;
    const newLockedState = !isAccessLocked;
    setIsAccessLocked(newLockedState);

    try {
      const success = await onToggleAccess?.(details.id, newLockedState);
      if (!success) {
        setIsAccessLocked(previousLockedState);
      }
    } catch {
      setIsAccessLocked(previousLockedState);
    }
  }, [details?.id, isAccessLocked, onToggleAccess]);

  /**
   * Handles dashboard button click
   */
  const onDashboardClick = useCallback(() => {
    if (!details?.id) return;
    isSubmitting(true);
    router.push(`/account?id=${details.id}`);
  }, [details?.id, isSubmitting, router]);

  /**
   * Handles edit account button click
   * @param param - Object containing the account ID
   */
  const onEditAccountClick = useCallback(
    ({ accountId }: { accountId: string }) => {
      onEditClick?.(accountId);
    },
    [onEditClick]
  );

  /**
   * Handles portfolio ID click
   * @param event - The click event
   * @param portfolioId - The ID of the clicked portfolio
   */
  const setPortfolioSearch = useCallback(
    (
      event: React.MouseEvent | React.KeyboardEvent,
      portfolioId: string | undefined
    ) => {
      event.stopPropagation();
      if (globalPortfolioSearch && portfolioId) {
        globalPortfolioSearch(portfolioId);
      }
    },
    [globalPortfolioSearch]
  );

  // Map raw service labels to ServicePill objects
  const servicePills: ServicePill[] =
    details?.services?.map(getServicePill) ?? [];

  if (!details) {
    return null;
  }

  return (
    <div className="w-full p-3 bg-secondary-fill rounded-xl flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        {servicePills.length > 0 && <Pills items={servicePills} />}
        <div className="flex flex-col gap-2">
          <div className="w-[318px] flex items-start gap-1">
            <span className="flex-1 text-sm font-bold text-secondary-light leading-tight">
              {details.companyName}
            </span>
            <div
              data-hierarchy="Link gray"
              data-icon="Default"
              data-size="sm"
              data-state="Default"
              className="flex justify-center items-center gap-1.5 overflow-hidden"
            >
              <div className="text-xs font-semibold text-tertiary-light underline leading-tight"></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div
            className="w-full h-5 flex items-center justify-between cursor-pointer"
            onClick={toggleAccounts}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleAccounts()}
          >
            <span className="text-xs font-semibold text-secondary-light leading-[18px]">
              Account
            </span>
            <div className="w-5 h-5 relative overflow-hidden">
              <ChevronRight
                className={`w-4 h-4 absolute left-[5px] text-tertiary-slateMist transition-transform duration-300 ${
                  isAccountOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
          {isAccountOpen && (
            <div className="self-stretch px-1 py-3 bg-gray-50 rounded-md flex flex-col justify-start items-center gap-4">
              <div className="self-stretch flex flex-col justify-center items-center gap-1">
                <div className="self-stretch h-5 px-2 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="text-xs font-semibold text-secondary-light leading-[18px]">
                      Contact
                    </div>
                    <div className="w-[191px] text-xs font-normal text-secondary-light leading-[18px]">
                      {details.contactFirstName} {details.contactLastName}
                    </div>
                  </div>
                  <div
                    data-hierarchy="Link gray"
                    data-icon="Default"
                    data-size="sm"
                    data-state="Default"
                    className="flex justify-center items-center gap-1.5 overflow-hidden"
                  >
                    <div className="text-xs font-semibold text-tertiary-light underline leading-tight"></div>
                  </div>
                </div>
                <div className="self-stretch h-5 px-2 flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-[47px] text-xs font-semibold text-secondary-light leading-[18px]">
                      E-mail
                    </div>
                    <div className="w-[191px] text-xs font-normal text-secondary-light leading-[18px]">
                      {details.email}
                    </div>
                  </div>
                  <div
                    data-hierarchy="Link gray"
                    data-icon="Default"
                    data-size="sm"
                    data-state="Default"
                    className="flex justify-center items-center gap-1.5 overflow-hidden"
                  >
                    <div className="text-xs font-semibold text-tertiary-light underline leading-tight"></div>
                  </div>
                </div>
                <div className="self-stretch py-1 flex justify-center items-center gap-3">
                  <button
                    onClick={onDashboardClick}
                    className="px-2 py-1 bg-tertiary-platinumGray rounded flex items-center gap-1 hover:bg-tertiary-platinumGray/80 active:cursor-progress"
                    disabled={!details.id}
                  >
                    <div className="text-xs font-medium text-tertiary-midnightBlue leading-[18px]">
                      Dashboard
                    </div>
                  </button>
                  <button
                    disabled={!isEditable || !details.id}
                    onClick={() =>
                      details.id &&
                      onEditAccountClick({ accountId: details.id })
                    }
                    className={`px-2 py-1 bg-tertiary-platinumGray rounded flex items-center gap-1 ${
                      isEditable && details.id
                        ? "hover:bg-tertiary-platinumGray/80 active:cursor-progress"
                        : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="text-xs font-medium text-tertiary-midnightBlue leading-[18px]">
                      Edit Account
                    </div>
                  </button>
                </div>
              </div>
              <div className="flex flex-col justify-start items-center gap-2">
                <div className="w-[309px] flex justify-center items-start gap-3">
                  <div className=" flex items-center gap-3">
                    <span className="text-xs font-bold text-tertiary-midnightBlue leading-tight">
                      Access
                    </span>
                    <div className="text-xs font-normal text-secondary-light leading-[18px]">
                      Unlocked
                    </div>
                    <ToggleSwitch
                      isOn={isAccessLocked}
                      onToggle={handleToggleAccess}
                      isDisabled={!isEditable || !details.id}
                    />
                    <div className="text-xs font-normal text-secondary-light leading-[18px]">
                      Locked
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div
            className="w-full h-5 flex items-center justify-between cursor-pointer"
            onClick={toggleInvoices}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleInvoices()}
          >
            <span className="text-xs font-bold text-secondary-light leading-tight">
              Invoices
            </span>
            <div className="w-5 h-5 relative overflow-hidden">
              <ChevronRight
                className={`w-4 h-4 absolute left-[5px] text-tertiary-slateMist transition-transform duration-300 ${
                  isInvoicesOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
          {isInvoicesOpen && (
            <div className="w-full flex flex-col gap-1">
              {details.invoices?.length ? (
                details.invoices.map((invoice, index) => (
                  <div
                    key={`${invoice.date}-${index}`}
                    className="p-2 bg-gray-50 rounded-md flex flex-col gap-1 overflow-hidden"
                  >
                    <div className="h-[18px] flex items-start gap-1">
                      <span className="w-[54px] text-xs text-tertiary-charcoalBlue underline leading-[18px]">
                        {invoice.date}
                      </span>
                      <span className="w-[54px] text-xs text-secondary-light leading-[18px]">
                        {invoice.amount}
                      </span>
                      <div className="flex-1 flex justify-end items-center">
                        <span className="text-xs text-secondary-light leading-[18px]">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 bg-gray-50 rounded-md flex flex-col gap-1">
                  <span className="text-xs text-tertiary-charcoalBlue leading-[18px]">
                    No invoice available.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div
            className="w-full h-5 flex items-center justify-between cursor-pointer"
            onClick={togglePortfolios}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && togglePortfolios()}
          >
            <span className="text-xs font-bold text-secondary-light leading-tight">
              Portfolios
            </span>
            <div className="w-5 h-5 relative overflow-hidden">
              <ChevronRight
                className={`w-4 h-4 absolute left-[5px] text-tertiary-slateMist transition-transform duration-300 ${
                  isPortfoliosOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
          {isPortfoliosOpen && (
            <div className="w-full flex flex-col gap-1">
              {details.portfolios?.length ? (
                details.portfolios?.map((portfolio, index) => (
                  <div
                    key={`${portfolio.code}-${index}`}
                    className="p-2 bg-gray-50 rounded-md flex flex-col gap-3 overflow-hidden"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-normal text-secondary-light leading-tight">
                          {portfolio.name}
                        </span>
                      </div>
                      <div className="w-[310px] h-[18px] flex items-center gap-2">
                        <button
                          className="text-xs text-tertiary-light underline leading-[18px] bg-transparent border-0 p-0 hover:text-tertiary-light/80"
                          onClick={(e) => setPortfolioSearch(e, portfolio.code)}
                          onKeyDown={(e) =>
                            e.key === "Enter" &&
                            setPortfolioSearch(e, portfolio.code)
                          }
                        >
                          {portfolio.code}
                        </button>
                        {portfolio.totalProperties && (
                          <>
                            <div className="w-2 h-2 bg-tertiary-charcoalBlue rounded-full" />
                            <span className="text-xs font-normal text-tertiary-light leading-[18px]">
                              {portfolio.totalProperties}
                            </span>
                          </>
                        )}
                        {portfolio.squareFootage && (
                          <>
                            <div className="w-2 h-2 bg-tertiary-charcoalBlue rounded-full" />
                            <span className="text-xs font-normal text-tertiary-light leading-[18px]">
                              {portfolio.squareFootage}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-tertiary-stroke" />
                    <div className="flex flex-col gap-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => togglePortfolioCost(portfolio.name)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          togglePortfolioCost(portfolio.name)
                        }
                      >
                        <span className="w-[189px] text-xs font-bold text-secondary-light leading-[18px]">
                          Usage Costs
                        </span>
                        <div className="w-5 h-5 relative overflow-hidden">
                          <ChevronRight
                            className={`w-2.5 h-[5px] absolute left-[5px] top-[7.5px] text-tertiary-slateMist transition-transform duration-300 ${
                              portfolioCostOpen[portfolio.name]
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                      {portfolioCostOpen[portfolio.name] && (
                        <div className="flex flex-col gap-4">
                          {portfolio.costMargins?.map((cost, idx) => (
                            <div
                              key={`${cost.month}-${cost.year}-${idx}`}
                              className="h-[18px] flex items-start gap-1"
                            >
                              <span className="w-[54px] text-xs font-normal text-tertiary-midnightBlue leading-[18px]">
                                {cost.month} {cost.year}
                              </span>
                              <span className="text-xs font-normal text-secondary-light leading-[18px]">
                                {cost.cost} ({cost.margin})
                                {cost.isHighlighted && " *"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="p-2 bg-gray-50 rounded-md flex flex-col gap-1">
                    <span className="text-xs font-normal text-tertiary-charcoalBlue leading-[18px]">
                      No portfolio available.
                    </span>
                  </div>
                  <div className="flex justify-center items-center w-full">
                    <LinkButton
                      label="Delete"
                      hidden={
                        !hasDeletePermission ||
                        (details.portfolios?.length ?? 0) > 0
                      }
                      onClick={() => onDelete?.(details)}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CompanyInfo);

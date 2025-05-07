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
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-start gap-1">
            <span className="flex-1 text-sm font-bold text-secondary-light">
              {details.companyName}
            </span>
          </div>
          <div className="flex items-center justify-between h-5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-secondary-light">
                Contact Name
              </span>
              <span className="text-xs text-secondary-light">
                {details.contactFirstName} {details.contactLastName}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between h-5">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-semibold text-secondary-light">
                Email
              </span>
              <span className="text-xs text-secondary-light">
                {details.email}
              </span>
            </div>
          </div>
          <Pills items={servicePills} className="py-[3px]" />
        </div>
        <div className="h-px bg-tertiary-stroke" />
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <button
                onClick={onDashboardClick}
                className="px-2 py-1 rounded bg-tertiary-platinumGray flex items-center gap-1 hover:bg-tertiary-platinumGray/80 active:cursor-progress"
                disabled={!details.id}
              >
                <span className="text-xs font-medium text-primary-button">
                  Dashboard
                </span>
              </button>
              <button
                disabled={!isEditable || !details.id}
                onClick={() =>
                  details.id && onEditAccountClick({ accountId: details.id })
                }
                className={`px-2 py-1 rounded bg-tertiary-platinumGray flex items-center gap-1 ${
                  isEditable && details.id
                    ? "hover:bg-tertiary-platinumGray/80 active:cursor-progress"
                    : "cursor-not-allowed opacity-50"
                }`}
              >
                <span className="text-xs font-medium text-primary-button">
                  Edit Account
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-tertiary-midnightBlue">
                Access
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-secondary-light">Unlocked</span>
                <ToggleSwitch
                  isOn={isAccessLocked}
                  onToggle={handleToggleAccess}
                  isDisabled={!isEditable || !details.id}
                />
                <span className="text-xs text-secondary-light">Locked</span>
              </div>
            </div>
          </div>
        </div>
        <div className="h-px bg-tertiary-stroke" />
        <div className="flex flex-col gap-2">
          <div
            className="flex items-center h-5 cursor-pointer"
            onClick={toggleInvoices}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && toggleInvoices()}
          >
            <span className="w-1/2 text-xs font-bold text-secondary-light">
              Invoices
            </span>
            <div className="w-1/2 flex justify-end">
              <ChevronRight
                className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                  isInvoicesOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
          {isInvoicesOpen && (
            <div className="flex flex-col gap-1">
              {details.invoices?.length ? (
                details.invoices.map((invoice, index) => (
                  <div
                    key={`${invoice.date}-${index}`}
                    className="p-2 bg-gray-50 rounded-md flex flex-col gap-1"
                  >
                    <div className="flex items-start gap-1">
                      <span className="w-[54px] text-xs text-tertiary-charcoalBlue underline">
                        {invoice.date}
                      </span>
                      <span className="w-[54px] text-xs text-secondary-light">
                        {invoice.amount}
                      </span>
                      <div className="flex-1 flex justify-end">
                        <span className="text-xs text-secondary-light">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-2 bg-gray-50 rounded-md flex flex-col gap-1">
                  <span className="text-xs text-dropdown-regular">
                    No invoice available.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="h-px bg-tertiary-stroke" />
        <div className="flex flex-col gap-2">
          <div
            className="flex items-center justify-between h-5 cursor-pointer"
            onClick={togglePortfolios}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && togglePortfolios()}
          >
            <span className="text-xs font-bold text-secondary-light">
              Portfolios
            </span>
            <div className="flex items-center justify-center w-5 h-5">
              <ChevronRight
                className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                  isPortfoliosOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
          {isPortfoliosOpen && (
            <div className="flex flex-col gap-1">
              {details.portfolios?.length ? (
                details.portfolios?.map((portfolio, index) => (
                  <div
                    key={`${portfolio.code}-${index}`}
                    className="p-2 bg-gray-50 rounded-md flex flex-col gap-3"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-secondary-light">
                        {portfolio.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xs text-tertiary-light underline cursor-pointer hover:text-tertiary-midnightBlue hover:font-medium bg-transparent border-0 p-0"
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
                            <span className="text-xs text-tertiary-light">
                              {portfolio.totalProperties}
                            </span>
                          </>
                        )}
                        {portfolio.squareFootage && (
                          <>
                            <div className="w-2 h-2 bg-tertiary-charcoalBlue rounded-full" />
                            <span className="text-xs text-tertiary-light">
                              {portfolio.squareFootage}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="h-px bg-tertiary-stroke" />
                    <div className="flex flex-col gap-1">
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
                        <span className="text-xs font-bold text-secondary-light">
                          Cost (Margins)
                        </span>
                        <div className="flex items-center justify-center w-5 h-5">
                          <ChevronRight
                            className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                              portfolioCostOpen[portfolio.name]
                                ? "rotate-90"
                                : ""
                            }`}
                          />
                        </div>
                      </div>
                      {portfolioCostOpen[portfolio.name] && (
                        <div className="flex flex-col gap-1">
                          {portfolio.costMargins?.map((cost, idx) => (
                            <div
                              key={`${cost.month}-${cost.year}-${idx}`}
                              className="flex items-start gap-1"
                            >
                              <span className="w-[54px] text-xs text-tertiary-midnightBlue">
                                {cost.month} {cost.year}
                              </span>
                              <span className="text-xs text-secondary-light">
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
                    <span className="text-xs text-dropdown-regular">
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

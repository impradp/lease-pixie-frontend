"use client";

import React, { useEffect, useState, useCallback } from "react";
import { hasRole } from "@/lib/utils/authUtils";
import handleInfo from "@/lib/utils/errorHandler";
import { defaultData } from "@/data/depositAccount";
import { plaidService } from "@/lib/services/plaid";
import { DepositAccount } from "@/types/DepositAccount";
import { usePlaidLink, PlaidLinkOnSuccess } from "react-plaid-link";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { depositAccountService } from "@/lib/services/depositAccount";
import DepositAccountForm from "@/components/account/DepositAccountForm";
import DepositAccountContent from "@/components/account/DepositAccountContent";

/**
 * Props for the DepositAccountsCard component
 * @interface DepositAccountsCardProps
 * @property {boolean} [isEditable=false] - Controls whether deposit accounts can be edited
 * @property {function} isSubmitting - Callback function to update parent component's loading state
 */
interface DepositAccountsCardProps {
  isEditable?: boolean;
  isSubmitting: (value: boolean) => void;
}

/**
 * Component that displays and manages deposit accounts with Plaid integration
 * @param {DepositAccountsCardProps} props - Component props
 * @returns {JSX.Element} Deposit accounts management card
 */
const DepositAccountsCard: React.FC<DepositAccountsCardProps> = ({
  isEditable = false,
  isSubmitting,
}) => {
  const [displayEditFeature, setDisplayEditFeature] = useState(false);
  const [selectedDepositAccount, setSelectedDepositAccount] =
    useState<DepositAccount>(defaultData);
  const [showDepositAccountForm, setShowDepositAccountForm] = useState(false);
  const [depositAccounts, setDepositAccounts] = useState<DepositAccount[]>([]);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidAccountId, setPlaidAccountId] = useState<string | null>(null);
  const [isPlaidLoading, setIsPlaidLoading] = useState(false);
  const hasDepositSectionEditAcess = hasRole("ACCOUNTUSER");

  /**
   * Loads deposit accounts from the API on component mount
   */
  useEffect(() => {
    fetchDepositAccounts();
  }, []);

  /**
   * Fetches deposit accounts from the service
   */
  const fetchDepositAccounts = async () => {
    isSubmitting(true);
    try {
      const response = await depositAccountService.fetch();
      if (response.status === "SUCCESS") {
        setDepositAccounts(response?.data);
      } else {
        handleInfo({ code: 100701 });
      }
    } catch (err) {
      handleInfo({ code: 100702, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  /**
   * Creates a new deposit account
   * @param {DepositAccount} data - New deposit account data
   */
  const handleAddDepositAccount = async (data: DepositAccount) => {
    try {
      setShowDepositAccountForm(false);
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Ensure UI updates before API call
      const response = await depositAccountService.create(data);
      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100700 });
        fetchDepositAccounts();
      } else {
        handleInfo({ code: 100703 });
      }
    } catch (err) {
      handleInfo({ code: 100704, error: err });
    }
  };

  /**
   * Closes the account form modal
   */
  const handleCloseAccountModal = () => {
    setShowDepositAccountForm(false);
    setDisplayEditFeature(false);
    setSelectedDepositAccount(defaultData);
  };

  /**
   * Opens the add account form
   */
  const handleAddClick = () => {
    setShowDepositAccountForm(true);
  };

  /**
   * Toggles payment processing for an account
   * @param {string} accountId - ID of the account to update
   * @param {boolean} isPaymentProcessingOn - New payment processing state
   * @returns {Promise<boolean>} Success status
   */
  const handlePaymentProcessing = async (
    accountId: string,
    isPaymentProcessingOn: boolean
  ): Promise<boolean> => {
    isSubmitting(true);
    const previousAccounts = [...depositAccounts]; // Store for rollback
    try {
      // Optimistic update
      setDepositAccounts((prev) =>
        prev.map((acc) =>
          acc.id === accountId
            ? { ...acc, isPaymentProcessingOn: isPaymentProcessingOn }
            : acc
        )
      );
      const account = depositAccounts.find((acc) => acc.id === accountId);
      if (!account) {
        throw new Error("Deposit Account not found");
      }
      const response = await depositAccountService.updatePaymentProcessing(
        accountId,
        isPaymentProcessingOn
      );
      if (response?.status === "SUCCESS") {
        handleInfo({ code: isPaymentProcessingOn ? 100705 : 100706 });
        return true;
      } else {
        setDepositAccounts(previousAccounts); // Rollback on error
        handleInfo({ code: 100707 });
        return false;
      }
    } catch (err) {
      setDepositAccounts(previousAccounts); // Rollback on error
      handleInfo({ code: 100708, error: err });
      return false;
    } finally {
      isSubmitting(false);
    }
  };

  /**
   * Initiates merchant onboarding for an account
   * @param {string} accountId - ID of the account to onboard
   */
  const handleOnboarding = async (accountId: string) => {
    try {
      isSubmitting(true);
      const response = await depositAccountService.onboardMerchant(accountId);
      if (response.status === "SUCCESS") {
        handleInfo({ code: 100709 });
        fetchDepositAccounts();
      } else {
        handleInfo({ code: 100710 });
      }
    } catch (err) {
      handleInfo({ code: 100711, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  // Handle Plaid Link success
  const onPlaidSuccess = useCallback<PlaidLinkOnSuccess>(
    async (publicToken) => {
      if (plaidAccountId && publicToken) {
        isSubmitting(true);
        try {
          const response = await depositAccountService.setUpPlaid(
            plaidAccountId,
            {
              hasPlaidLink: true,
              publicToken: publicToken,
            }
          );
          if (response.status === "SUCCESS") {
            handleInfo({ code: 100904 });
            await fetchDepositAccounts();
          } else {
            handleInfo({ code: 100901 });
          }
        } catch (err) {
          console.error("Error setting up Plaid:", err);
          handleInfo({ code: 100901, error: err });
        } finally {
          isSubmitting(false);
        }
      } else {
        handleInfo({ code: 100901 });
      }
      setLinkToken(null);
      setPlaidAccountId(null);
      setIsPlaidLoading(false);
    },
    [plaidAccountId, isSubmitting, fetchDepositAccounts]
  );

  // Configure Plaid Link
  const { open, ready, error } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
    onExit: (err) => {
      setLinkToken(null);
      setPlaidAccountId(null);
      setIsPlaidLoading(false);
      handleInfo({ code: 100903, error: err });
    },
  });

  // Automatically open Plaid Link when linkToken is set and ready
  useEffect(() => {
    if (linkToken && ready) {
      open();
    }
  }, [linkToken, ready, open, error]);

  // Initiate Plaid Link flow
  const handleContinueToPlaid = async (accountId: string) => {
    if (isPlaidLoading) return;
    setIsPlaidLoading(true);
    setPlaidAccountId(accountId);
    try {
      isSubmitting(true);
      const response = await plaidService.generateLinkToken();
      if (response.status === "SUCCESS" && response?.data?.linkToken) {
        handleInfo({ code: 100900 });
        setLinkToken(response.data.linkToken);
      } else {
        handleInfo({ code: 100901 });
        setIsPlaidLoading(false);
      }
    } catch (err) {
      handleInfo({ code: 100902, error: err });
      setIsPlaidLoading(false);
    } finally {
      isSubmitting(false);
    }
  };

  /**
   * Removes Plaid link from an account
   * @param {string} plaidAccountId - ID of the account to unlink from Plaid
   */
  const handlePlaidLinkRemove = async (plaidAccountId: string) => {
    try {
      isSubmitting(true);
      const response = await depositAccountService.setUpPlaid(plaidAccountId, {
        hasPlaidLink: false,
        publicToken: "",
      });
      if (response.status === "SUCCESS") {
        handleInfo({ code: 100905 });
        await fetchDepositAccounts();
      } else {
        handleInfo({ code: 100906 });
      }
    } catch (err) {
      handleInfo({ code: 100907, error: err });
    } finally {
      isSubmitting(false);
    }
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <PixieCardHeader
          label={"Deposit Accounts"}
          isEditable={isEditable}
          showAddIcon={hasDepositSectionEditAcess && isEditable}
          onAddClick={isEditable ? handleAddClick : undefined}
        />
        <div className="flex flex-col gap-3">
          {depositAccounts?.map((account, index) => (
            <DepositAccountContent
              key={account.id ?? `account-${index}`}
              account={account}
              onTogglePaymentProcessing={handlePaymentProcessing}
              isEditable={hasDepositSectionEditAcess && isEditable}
              onBoardingClick={handleOnboarding}
              onPlaidContinueClick={handleContinueToPlaid}
              onPlaidLinkRemove={handlePlaidLinkRemove}
            />
          ))}
        </div>
        {depositAccounts.length === 0 && (
          <div className="self-stretch p-2 bg-secondary-fill rounded-md inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch inline-flex justify-start items-center gap-2">
                  <div className="flex-1 justify-start text-dropdown-regular text-xs font-normal font-['Inter'] leading-[18px]">
                    No deposit account available matching your search.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showDepositAccountForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DepositAccountForm
            data={selectedDepositAccount}
            isEditForm={displayEditFeature}
            onClose={handleCloseAccountModal}
            onSubmit={handleAddDepositAccount}
          />
        </div>
      )}
    </>
  );
};

export default DepositAccountsCard;

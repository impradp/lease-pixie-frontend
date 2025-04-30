"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import handleInfo from "@/lib/utils/errorHandler";
import { defaultData } from "@/data/depositAccount";
import { plaidService } from "@/lib/services/plaid";
import { DepositAccount } from "@/types/DepositAccount";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { depositAccountService } from "@/lib/services/depositAccount";
import DepositAccountForm from "@/components/account/DepositAccountForm";
import PlaidLinkInitializer from "@/components/plaid/PlaidLinkInitializer";
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
const DepositAccountsCard = ({
  isEditable = false,
  isSubmitting,
}: DepositAccountsCardProps) => {
  const [displayEditFeature, setDisplayEditFeature] = useState(false);
  const [selectedDepositAccount, setSelectedDepositAccount] =
    useState<DepositAccount>(defaultData);
  const [showDepositAccountForm, setShowDepositAccountForm] = useState(false);
  const [depositAccounts, setDepositAccounts] = useState<DepositAccount[]>([]);
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [plaidAccountId, setPlaidAccountId] = useState<string | null>(null);
  const [isPlaidLoading, setIsPlaidLoading] = useState(false);
  const [showSandbox, setShowSandbox] = useState(false);
  const hasDepositSectionEditAcess = hasRole("ACCOUNTUSER");

  // Ref to track if component is mounted
  const isMounted = useRef(true);

  // Ref to track if a fetch is in progress
  const isFetching = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  /**
   * Loads deposit accounts from the API on component mount
   */
  useEffect(() => {
    fetchDepositAccounts();
  }, []);

  /**
   * Fetches deposit accounts from the service
   */
  const fetchDepositAccounts = useCallback(async () => {
    if (isFetching.current || !isMounted.current) return;
    isFetching.current = true;
    isSubmitting(true);
    try {
      const response = await depositAccountService.fetch();
      if (response.status === "SUCCESS" && isMounted.current) {
        setDepositAccounts(response?.data);
      } else {
        handleInfo({ code: 100701 });
      }
    } catch (err) {
      handleInfo({ code: 100702, error: err });
    } finally {
      if (isMounted.current) {
        isSubmitting(false);
        isFetching.current = false;
      }
    }
  }, [isSubmitting]);

  /**
   * Creates a new deposit account
   * @param {DepositAccount} data - New deposit account data
   */
  const handleAddDepositAccount = useCallback(
    async (data: DepositAccount) => {
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
    },
    [fetchDepositAccounts]
  );

  /**
   * Closes the account form modal
   */
  const handleCloseAccountModal = useCallback(() => {
    setShowDepositAccountForm(false);
    setDisplayEditFeature(false);
    setSelectedDepositAccount(defaultData);
  }, []);

  /**
   * Opens the add account form
   */
  const handleAddClick = useCallback(() => {
    setShowDepositAccountForm(true);
  }, []);

  /**
   * Toggles payment processing for an account
   * @param {string} accountId - ID of the account to update
   * @param {boolean} isPaymentProcessingOn - New payment processing state
   * @returns {Promise<boolean>} Success status
   */
  const handlePaymentProcessing = useCallback(
    async (
      accountId: string,
      isPaymentProcessingOn: boolean
    ): Promise<boolean> => {
      if (!isMounted.current) return false;
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
        if (isMounted.current) {
          isSubmitting(false);
        }
      }
    },
    [depositAccounts, isSubmitting]
  );

  /**
   * Initiates merchant onboarding for an account
   * @param {string} accountId - ID of the account to onboard
   */
  const handleOnboarding = useCallback(
    async (accountId: string) => {
      if (!isMounted.current) return;
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
        if (isMounted.current) {
          isSubmitting(false);
        }
      }
    },
    [fetchDepositAccounts, isSubmitting]
  );

  const handleContinueToPlaid = useCallback(
    async (accountId: string) => {
      if (isPlaidLoading || !isMounted.current) return;
      setIsPlaidLoading(true);
      setPlaidAccountId(accountId);
      try {
        isSubmitting(true);
        const response = await plaidService.generateLinkToken();
        if (response.status === "SUCCESS" && response?.data?.linkToken) {
          // handleInfo({ code: 100900 });
          setShowSandbox(true); // Show sandbox background immediately after token generation
          setLinkToken(response.data.linkToken);
        } else {
          handleInfo({ code: 100901 });
          setIsPlaidLoading(false);
        }
      } catch (err) {
        handleInfo({ code: 100902, error: err });
        setIsPlaidLoading(false);
      } finally {
        if (isMounted.current) {
          isSubmitting(false);
        }
      }
    },
    [isPlaidLoading, isSubmitting]
  );

  /**
   * Removes Plaid link from an account
   * @param {string} plaidAccountId - ID of the account to unlink from Plaid
   */
  const handlePlaidLinkRemove = useCallback(
    async (plaidAccountId: string) => {
      if (!isMounted.current) return;
      try {
        isSubmitting(true);
        const response = await depositAccountService.setUpPlaid(
          plaidAccountId,
          {
            hasPlaidLink: false,
            publicToken: "",
          }
        );
        if (response.status === "SUCCESS") {
          handleInfo({ code: 100905 });
          await fetchDepositAccounts();
        } else {
          handleInfo({ code: 100906 });
        }
      } catch (err) {
        handleInfo({ code: 100907, error: err });
      } finally {
        if (isMounted.current) {
          isSubmitting(false);
        }
      }
    },
    [fetchDepositAccounts, isSubmitting]
  );

  // Handle Plaid Link success
  const handlePlaidSuccess = useCallback(
    async (publicToken: string) => {
      if (!isMounted.current || !plaidAccountId) return;
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
        if (isMounted.current) {
          isSubmitting(false);
          setLinkToken(null);
          setPlaidAccountId(null);
          setIsPlaidLoading(false);
          setShowSandbox(false);
        }
      }
    },
    [plaidAccountId, isSubmitting, fetchDepositAccounts]
  );

  //Deletes deposit account
  const handleDelete = async (accountId: string) => {
    try {
      isSubmitting(true);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const response = await depositAccountService.delete(accountId);
      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100712 });
        await fetchDepositAccounts();
      } else {
        handleInfo({ code: 100713 });
      }
    } catch (err) {
      handleInfo({ code: 100714, error: err });
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
              onDelete={handleDelete}
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
      {linkToken && plaidAccountId && (
        <PlaidLinkInitializer
          linkToken={linkToken}
          onSuccess={handlePlaidSuccess}
          onExit={() => {
            setLinkToken(null);
            setPlaidAccountId(null);
            setIsPlaidLoading(false);
            setShowSandbox(false);
            handleInfo({ code: 100903 });
          }}
          showSandbox={showSandbox}
        />
      )}
    </>
  );
};

export default DepositAccountsCard;

"use client";

import React, { useEffect, useState } from "react";

import { hasRole } from "@/lib/utils/authUtils";
import handleInfo from "@/lib/utils/errorHandler";
import { defaultData } from "@/data/depositAccount";
import { DepositAccount } from "@/types/DepositAccount";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { depositAccountService } from "@/lib/services/depositAccount";
import DepositAccountForm from "@/components/account/DepositAccountForm";
import DepositAccountContent from "@/components/account/DepositAccountContent";

interface DepositAccountsCardProps {
  isEditable?: boolean; // Whether the card is editable (default: false)
  isSubmitting: (value: boolean) => void;
}

/**
 * DepositAccountsCard displays a list of deposit accounts with options to add or edit accounts.
 * @param {DepositAccountsCardProps} props - The component props
 * @param {boolean} [props.isEditable=false] - Whether the card allows editing
 * @param {(value: boolean) => void} props.isSubmitting - Callback to update submitting state
 * @returns {JSX.Element} The rendered deposit accounts card component
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

  const hasDepositSectionEditAcess = hasRole("ACCOUNTUSER"); // Check if the user has the role to show add icon

  useEffect(() => {
    fetchDepositAccounts();
  }, []);

  /**
   * Fetches deposit accounts from the service and updates state.
   */
  const fetchDepositAccounts = async () => {
    isSubmitting(true); // Set submitting state to true
    try {
      const response = await depositAccountService.fetch();
      if (response.status === "SUCCESS") {
        setDepositAccounts(response?.data); // Update state with fetched accounts
      } else {
        handleInfo({ code: 100701 }); // Handle fetch failure
      }
    } catch (err) {
      handleInfo({ code: 100702, error: err }); // Handle fetch error
    } finally {
      isSubmitting(false); // Reset submitting state
    }
  };

  /**
   * Handles adding a new deposit account and refreshes the account list.
   */
  const handleAddDepositAccount = async (data: DepositAccount) => {
    try {
      setShowDepositAccountForm(false); // Close the form
      await new Promise((resolve) => requestAnimationFrame(resolve)); // Ensure UI update
      const response = await depositAccountService.create(data);

      if (response?.status === "SUCCESS") {
        handleInfo({ code: 100700 }); // Notify success
        fetchDepositAccounts(); // Refresh account list
      } else {
        handleInfo({ code: 100703 }); // Handle creation failure
      }
    } catch (err) {
      handleInfo({ code: 100704, error: err }); // Handle creation error
    }
  };

  /**
   * Closes the deposit account form and resets related states.
   */
  const handleCloseAccountModal = () => {
    setShowDepositAccountForm(false); // Hide the form
    setDisplayEditFeature(false); // Disable edit mode
    setSelectedDepositAccount(defaultData); // Reset selected account
  };

  const handleAddClick = () => {
    setShowDepositAccountForm(true);
  };

  const handlePaymentProcessing = async (
    accountId: string,
    isPaymentProcessingOn: boolean
  ): Promise<boolean> => {
    isSubmitting(true);
    // Store previous accounts state for reversion
    const previousAccounts = [...depositAccounts];

    try {
      // Optimistically update accounts state
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
        // Revert on failure
        setDepositAccounts(previousAccounts);
        handleInfo({ code: 100707 });
        return false;
      }
    } catch (err) {
      // Revert on exception
      setDepositAccounts(previousAccounts);
      handleInfo({ code: 100708, error: err });
      return false;
    } finally {
      isSubmitting(false);
    }
  };

  const handleOnboarding = async (accountId: string) => {
    try {
      isSubmitting(true);
      const response = await depositAccountService.onboardMerchant(accountId);
      if (response.status == "SUCCESS") {
        handleInfo({ code: 100709 }); // Notify success
        fetchDepositAccounts(); // Refresh account list
      } else {
        handleInfo({ code: 100710 });
      }
    } catch (err) {
      handleInfo({ code: 100711, error: err });
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
          showAddIcon={hasDepositSectionEditAcess && isEditable} // Only show add icon if both conditions are met
          onAddClick={isEditable ? handleAddClick : undefined} // Pass undefined if not editable
        />
        <div className="flex flex-col gap-3">
          {depositAccounts?.map((account, index) => (
            <DepositAccountContent
              key={account.id ?? `account-${index}`}
              account={account}
              onTogglePaymentProcessing={handlePaymentProcessing}
              isEditable={hasDepositSectionEditAcess && isEditable}
              onBoardingClick={handleOnboarding}
            /> // Render each account with unique key
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

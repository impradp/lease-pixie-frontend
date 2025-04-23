"use client";

import React, { useCallback, useEffect, useState } from "react";

import { ChevronRight } from "lucide-react";
import { Pills } from "@/components/ui/pills";
import { DepositAccount } from "@/types/DepositAccount";
import LinkButton from "@/components/ui/buttons/LinkButton";
import formatNumberInternational from "@/lib/utils/numberUtils";
import {
  activeMerchantAccountPill,
  activePlaidPill,
  inActiveMerchantAccountPill,
  inActivePlaidPill,
} from "@/data/servicePills";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";
import PlaidPaymentSetup from "@/components/ui/PlaidPaymentSetup";

interface DepositAccountContentProps {
  onTogglePaymentProcessing?: (
    accountId: string,
    isLocked: boolean
  ) => Promise<boolean>; // Callback for toggling access
  account: DepositAccount;
  isEditable?: boolean;
  onBoardingClick?: (value: string) => void;
}

/**
 * DepositAccountContent displays details of a deposit account with toggling sections and actions.
 * @param {DepositAccountContentProps} props - The component props
 * @param {DepositAccount} props.account - The deposit account data to display
 * @returns {JSX.Element} The rendered deposit account content component
 */
export const DepositAccountContent: React.FC<DepositAccountContentProps> = ({
  account,
  onTogglePaymentProcessing,
  isEditable = false,
  onBoardingClick,
}) => {
  const [isDepositAccountOpen, setIsDepositAccountOpen] = useState(false); // Initially collapsed
  const [isPaymentProcessingOn, setIsPaymentProcessingOn] = useState(
    account?.isPaymentProcessingOn ?? false
  );
  const [showPlaidLinkDialog, setShowPlaidLinkDialog] = useState(false);

  const isMerchantActivated = account?.issMerchantAccountNumber ? true : false;
  const selectedOnBoardingPill = isMerchantActivated
    ? activeMerchantAccountPill
    : inActiveMerchantAccountPill;

  const isPlaidActivated = account?.plaidAccountNumber ? true : false;
  const selectedPlaidPill = isPlaidActivated
    ? activePlaidPill
    : inActivePlaidPill;

  /**
   * Syncs local access lock state with prop changes
   */
  useEffect(() => {
    setIsPaymentProcessingOn(account?.isPaymentProcessingOn ?? false);
  }, [account?.isPaymentProcessingOn]);

  /**
   * Toggles the visibility of the deposit account details section.
   */
  const toggleDepositAccount = () => {
    setIsDepositAccountOpen(!isDepositAccountOpen);
    // TODO: Handle toggling
  };

  /**
   * Toggles the payment processing state and updates related logic.
   */
  const handleTogglePaymentProcessing = useCallback(async () => {
    if (!account?.id) return;

    const previousPaymentProcessingState = isPaymentProcessingOn;
    const newPaymentProcessingState = !isPaymentProcessingOn;
    setIsPaymentProcessingOn(newPaymentProcessingState);

    try {
      const success = await onTogglePaymentProcessing?.(
        account.id,
        newPaymentProcessingState
      );
      if (!success) {
        setIsPaymentProcessingOn(previousPaymentProcessingState);
      }
    } catch {
      setIsPaymentProcessingOn(previousPaymentProcessingState);
    }
  }, [account?.id, isPaymentProcessingOn, onTogglePaymentProcessing]);

  /**
   * Initiates the onboarding process for the deposit account.
   */
  const startOnBoarding = () => {
    if (onBoardingClick && account?.id) {
      onBoardingClick(account.id);
    }
  };

  const downloadOnboardingDetails = () => {
    if (onBoardingClick && account?.id) {
      //TODO: Handle download.
    }
  };

  const onLinkPlaid = () => {
    setShowPlaidLinkDialog(true);
  };

  const initiatePlaidSetup = async (setLoading: (loading: boolean) => void) => {
    try {
      setLoading(true);
      closePlaidSetup();
      await new Promise((resolve) => requestAnimationFrame(resolve));
      window.open("https://www.plaid.com", "_blank");
    } finally {
      setLoading(false);
    }
  };

  const closePlaidSetup = () => {
    setShowPlaidLinkDialog(false);
  };

  const initiateLinkRemove = () => {
    setShowPlaidLinkDialog(false);
  };

  return (
    <>
      <div className="w-full p-3 bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-start gap-3">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="justify-start text-tertiary-offBlack text-sm font-bold font-['Inter'] leading-tight">
            Deposit Account Description
          </div>
          <div className="flex w-full items-center">
            <div className="flex-1 text-tertiary-offBlack text-xs font-normal font-['Inter']">
              {account.accountHolderName + " x" + account.lastFourDigits}{" "}
              {/* Display account holder and last four digits */}
            </div>
            <div className="flex-none text-tertiary-offBlack text-xs font-normal font-['Inter']">
              $
              {formatNumberInternational(account.issMaxSingleACHTxnLimit) +
                " limit / $" +
                formatNumberInternational(account.reqMaxSingleACHTxnLimit) +
                " req."}{" "}
              {/* Display transaction limits */}
            </div>
          </div>
        </div>
        <div className="self-stretch h-px bg-tertiary-stroke" /> {/* Divider */}
        <div className="flex flex-col justify-start items-start gap-2 w-full">
          {/* First row with explicit flex grow/shrink */}
          <div className="flex w-full">
            <div className="flex-1">
              <Pills items={[selectedOnBoardingPill]} className="py-[3px]" />{" "}
              {/* Display merchant account pill */}
            </div>
            {isMerchantActivated ? (
              <div className="flex-none">
                <LinkButton
                  className="text-primary-button text-xs font-normal font-['Inter'] leading-[18px]"
                  label="View details"
                  onClick={downloadOnboardingDetails}
                  showIcon={true}
                  iconType="download"
                />
              </div>
            ) : (
              <div className="flex-none">
                <LinkButton
                  className="text-primary-button text-xs font-normal font-['Inter'] leading-[18px]"
                  label="Start On-Boarding"
                  onClick={startOnBoarding}
                  disabled={!isEditable}
                />
              </div>
            )}
          </div>

          {/* Second row with explicit flex grow/shrink */}
          <div className="flex w-full">
            <div className="flex-1">
              <Pills items={[selectedPlaidPill]} className="py-[3px]" />{" "}
              {/* Display merchant account pill */}
            </div>
            {isPlaidActivated ? (
              <div className="flex-none">
                <LinkButton
                  className="text-primary-button text-xs font-normal font-['Inter'] leading-[18px]"
                  label="Edit Plaid Link"
                  onClick={downloadOnboardingDetails}
                  showIcon={true}
                  iconType="download"
                />
              </div>
            ) : (
              <div className="flex-none">
                <LinkButton
                  className="text-primary-button text-xs font-normal font-['Inter'] leading-[18px]"
                  label="Plaid Link"
                  onClick={onLinkPlaid}
                  disabled={!isEditable}
                />
              </div>
            )}
          </div>
        </div>
        <div className="self-stretch h-px bg-tertiary-stroke" /> {/* Divider */}
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="w-1/2 flex justify-start items-center gap-0.5">
              <div className="justify-start text-tertiary-midnightBlue text-xs font-bold font-['Inter'] leading-tight">
                Payment Processing
              </div>
            </div>
            <div className="w-1/2 flex justify-end items-center gap-3">
              <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                Off {/* Display toggle status */}
              </div>
              <ToggleSwitch
                isOn={isPaymentProcessingOn}
                onToggle={handleTogglePaymentProcessing}
                isDisabled={!isEditable || !account.id}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch h-px bg-tertiary-stroke" /> {/* Divider */}
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div
            className="w-full h-5 inline-flex justify-between items-center cursor-pointer"
            onClick={toggleDepositAccount}
          >
            <div className="text-center justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-tight">
              Using deposit account
            </div>
            <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
              <ChevronRight
                className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                  isDepositAccountOpen ? "rotate-90" : ""
                }`}
              />
            </div>
          </div>
          {isDepositAccountOpen && (
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch p-2 bg-gray-50 rounded-md inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch flex flex-col justify-start items-start gap-2">
                    <div className="self-stretch inline-flex justify-start items-center gap-2">
                      <div className="flex-1 justify-start text-dropdown-regular text-xs font-normal font-['Inter'] leading-[18px]">
                        No deposit accounts available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showPlaidLinkDialog && (
        <PlaidPaymentSetup
          onRemoveLink={initiateLinkRemove}
          onSubmit={initiatePlaidSetup}
          onClose={closePlaidSetup}
          canRemoveLink={isPlaidActivated}
        />
      )}
    </>
  );
};

export default DepositAccountContent;

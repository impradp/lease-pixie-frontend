"use client";

import React, { useState } from "react";

import { ChevronRight } from "lucide-react";
import { Pills } from "@/components/ui/pills";
import { DepositAccount } from "@/types/DepositAccount";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { defaultMerchantAccountPill } from "@/data/servicePills";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";

interface DepositAccountContentProps {
  account: DepositAccount;
}

/**
 * DepositAccountContent displays details of a deposit account with toggling sections and actions.
 * @param {DepositAccountContentProps} props - The component props
 * @param {DepositAccount} props.account - The deposit account data to display
 * @returns {JSX.Element} The rendered deposit account content component
 */
export const DepositAccountContent: React.FC<DepositAccountContentProps> = ({
  account,
}) => {
  const [isDepositAccountOpen, setIsDepositAccountOpen] = useState(false); // Initially collapsed
  const [isPaymentProcessed, setIsPaymentProcessed] = useState(false);

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
  const handleToggleAccess = async () => {
    const newPaymentProcessingState = !isPaymentProcessed;
    setIsPaymentProcessed(newPaymentProcessingState);
    // TODO: Handle toggling access
  };

  /**
   * Initiates the onboarding process for the deposit account.
   */
  const startOnBoarding = () => {
    // TODO: Handle start on-boarding
  };

  return (
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
            {account.issMaxSingleACHTxnLimit +
              " limit / " +
              account.reqMaxSingleACHTxnLimit +
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
            <Pills items={[defaultMerchantAccountPill]} className="py-[3px]" />{" "}
            {/* Display merchant account pill */}
          </div>
          <div className="flex-none">
            <LinkButton
              className="text-primary-button text-xs font-normal font-['Inter'] leading-[18px]"
              label="Start On-Boarding"
              onClick={startOnBoarding}
            />
          </div>
        </div>

        {/* Second row with explicit flex grow/shrink */}
        <div className="flex w-full">
          <div className="flex-1">
            <div
              data-color="Orange"
              data-icon="False"
              data-size="sm"
              data-type="Pill color"
              className="inline-flex px-2 py-0.5 mix-blend-multiply bg-tertiary-lightPeach rounded-2xl outline outline-1 outline-offset-[-1px] outline-tertiary-mutedSalmon justify-start items-center"
            >
              <div className="text-center justify-start text-tertiary-mutedSalmon text-xs font-medium font-['Inter'] leading-[18px]">
                Plaid Inactive {/* Display Plaid status */}
              </div>
            </div>
          </div>
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
              isOn={isPaymentProcessed}
              onToggle={handleToggleAccess}
              isDisabled={false}
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
      </div>
    </div>
  );
};

export default DepositAccountContent;

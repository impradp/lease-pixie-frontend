"use client";

import React, { useState } from "react";

import { Pills } from "@/components/ui/pills";
import { ChevronDown, ChevronUp } from "lucide-react";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { defaultMerchantAccountPill } from "@/data/servicePills";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";

interface DepositAccountsCardProps {
  isEditable?: boolean;
}

const DepositAccountsCard: React.FC<DepositAccountsCardProps> = ({
  isEditable = false,
}) => {
  const [isDepositAccountOpen, setIsDepositAccountOpen] = useState(false);
  const [isAccessLocked, setIsAccessLocked] = useState(false);

  const toggleDepositAccount = () => {
    setIsDepositAccountOpen(!isDepositAccountOpen);
    //TODO: Handle toggling
  };

  const handleToggleAccess = async () => {
    const newLockedState = !isAccessLocked;
    setIsAccessLocked(newLockedState);

    //TODO: Handle toggling access
  };

  const startOnBoarding = () => {
    //TODO: Handle start on-boarding
  };
  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <PixieCardHeader
        label={"Deposit Accounts"}
        isEditable={isEditable}
        showAddIcon={true}
      />
      <div className="w-full p-3 bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-start gap-3">
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div className="justify-start text-tertiary-offBlack text-sm font-bold font-['Inter'] leading-tight">
            Deposit Account Description
          </div>
          <div className="flex w-full items-center">
            <div className="flex-1 text-tertiary-offBlack text-xs font-normal font-['Inter']">
              Bank Account x4526
            </div>
            <div className="flex-none text-tertiary-offBlack text-xs font-normal font-['Inter']">
              $80,000 limit / $200,000 req.
            </div>
          </div>
        </div>
        <div className="self-stretch h-px bg-tertiary-stroke" />
        <div className="flex flex-col justify-start items-start gap-2 w-full">
          {/* First row with explicit flex grow/shrink */}
          <div className="flex w-full">
            <div className="flex-1">
              <Pills
                items={[defaultMerchantAccountPill]}
                className="py-[3px]"
              />
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
                  Plaid Inactive
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch h-px bg-tertiary-stroke" />
        <div className="w-full flex flex-col justify-start items-start gap-2">
          <div className="w-full flex justify-between items-center">
            <div className="w-1/2 flex justify-start items-center gap-0.5">
              <div className="justify-start text-tertiary-midnightBlue text-xs font-bold font-['Inter'] leading-tight">
                Payment Processing
              </div>
            </div>
            <div className="w-1/2 flex justify-end items-center gap-3">
              <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                Off
              </div>
              <ToggleSwitch
                isOn={isAccessLocked}
                onToggle={handleToggleAccess}
                isDisabled={false}
              />
            </div>
          </div>
        </div>
        <div className="self-stretch h-px bg-tertiary-stroke" />
        <div className="self-stretch flex flex-col justify-start items-start gap-2">
          <div
            className="w-full h-5 inline-flex justify-between items-center cursor-pointer"
            onClick={toggleDepositAccount}
          >
            <div className="text-center justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-tight">
              Using deposit account
            </div>
            <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
              {isDepositAccountOpen ? (
                <ChevronUp className="w-4 h-4 text-tertiary-slateMist" />
              ) : (
                <ChevronDown className="w-4 h-4 text-tertiary-slateMist" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositAccountsCard;

"use client";

import React from "react";
import PixieCardHeader from "../ui/header/PixieCardHeader";

interface DepositAccountsCardProps {
  isEditable?: boolean;
}

const DepositAccountsCard: React.FC<DepositAccountsCardProps> = ({
  isEditable = false,
}) => {
  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <div className="w-full">
        <PixieCardHeader
          label={"Deposit Accounts"}
          isEditable={isEditable}
          showAddIcon={true}
        />
      </div>
    </div>
  );
};

export default DepositAccountsCard;

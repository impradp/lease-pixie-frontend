"use client";

import React, { useState } from "react";

import { defaultData } from "@/data/paymentMethod";
import LinkButton from "@/components/ui/buttons/LinkButton";
import { PaymentMethodFormData } from "@/types/PaymentMethod";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import { CustomCheckbox } from "@/components/ui/input/CustomCheckbox";

const PaymentMethod = () => {
  const [formData, setFormData] = useState<PaymentMethodFormData>(defaultData);

  const handleCheckboxChange = (field: keyof PaymentMethodFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const onClickEdit = () => {
    //TODO: Handle onclick edit
  };

  const onClickAdd = () => {
    //TODO: Handle onclick edit
  };
  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      <PixieCardHeader
        label="Payment Method"
        showAddIcon={true}
        onAddClick={onClickAdd}
      />
      <div className="self-stretch p-3 bg-[#ececec] rounded-xl inline-flex flex-col justify-start items-start gap-3 overflow-hidden">
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-5 inline-flex justify-between items-center">
              <div className="flex justify-start items-start gap-2">
                <div className="h-5 flex justify-start items-start gap-2">
                  <div className="text-center justify-start text-[#0b111d] text-sm font-bold font-['Inter'] leading-tight">
                    Bank Account{" "}
                  </div>
                  <div className="text-center justify-start text-[#0b111d] text-sm font-normal font-['Inter'] leading-tight">
                    {formData.accountNumber}
                  </div>
                </div>
              </div>
              <LinkButton label="Edit" onClick={onClickEdit} />
            </div>
            <div className="self-stretch h-5 inline-flex justify-start items-center gap-1">
              <div className="flex justify-start items-start gap-2">
                <div className="h-5 flex justify-start items-start gap-2">
                  <div className="w-[315px] justify-start text-[#0b111d] text-xs font-normal font-['Inter'] leading-tight">
                    {formData.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-start items-start gap-2">
            <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
              <div className="justify-start text-[#0b111d] text-xs font-bold font-['Inter'] leading-[18px]">
                Last payment date
              </div>
              <div className="justify-start text-[#0b111d] text-xs font-normal font-['Inter'] leading-[18px]">
                {formData.lastPaymentDate}
              </div>
            </div>
            <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
              <div className="justify-start text-[#0b111d] text-xs font-bold font-['Inter'] leading-[18px]">
                Last payment amount
              </div>
              <div className="justify-start text-[#0b111d] text-xs font-normal font-['Inter'] leading-[18px]">
                {formData.lastPaymentAmount}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[318px] h-px bg-[#cfd4dc]" />
        <CustomCheckbox
          id="autoPay"
          checked={formData.autoPay}
          onChange={() => handleCheckboxChange("autoPay")}
          label="Auto Pay"
          isEditing={true}
        />
      </div>
    </div>
  );
};

export default PaymentMethod;

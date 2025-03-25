"use client";

import React, { useState, useEffect } from "react";
import { Download, Upload } from "lucide-react";
import { PropertyApproval } from "@/types/PropertyApproval";
import PixieButton from "@/components/ui/buttons/PixieButton";
import CustomInput from "@/components/ui/input/CustomInput";
import { ToggleSwitch } from "@/components/ui/input/ToggleSwitch";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";

interface PropertyApprovalCardProps {
  existingApprovalData: PropertyApproval;
  onApprove?: () => void;
  isEditable?: boolean;
}

const PropertyApprovalCard: React.FC<PropertyApprovalCardProps> = ({
  existingApprovalData,
  onApprove,
  isEditable = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(isEditable);

  const initialData: PropertyApproval = existingApprovalData;

  const [formData, setFormData] = useState<PropertyApproval>(initialData);

  // Sync with external data if provided
  useEffect(() => {
    setFormData(existingApprovalData || initialData);
  }, [existingApprovalData]);

  const handleApprove = () => {
    setIsEditMode(false);
    if (onApprove) onApprove();
  };

  const toggleCategory = () => {
    setFormData((prev) => ({
      ...prev,
      isIndustrialCategory: !prev.isIndustrialCategory,
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        spaceFile: file,
      }));
    }
  };

  return (
    <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
      {/* Workflow Header */}
      <div className="w-full">
        <PixieCardHeader label={"Property Approval"} />
      </div>

      {/* Raw JSX adapted */}
      <div className="self-stretch inline-flex flex-col justify-start items-start gap-4">
        <div className="self-stretch bg-secondary-fill/80 rounded-xl inline-flex justify-start items-center overflow-hidden">
          <div className="flex-1 p-3 bg-secondary-fill inline-flex flex-col justify-start items-start gap-1">
            <div className="self-stretch inline-flex justify-start items-start gap-2">
              <div className="flex-1 inline-flex flex-col justify-start items-start gap-3">
                <div className="self-stretch inline-flex justify-start items-start gap-1">
                  <div className="flex-1 justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-tight">
                    {formData.address}
                  </div>
                </div>
                <div className="self-stretch h-px bg-tertiary-stroke" />
                <div className="self-stretch flex flex-col justify-start items-start gap-4">
                  <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Portfolio ID
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {formData.portfolioId}
                    </div>
                  </div>
                  <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Property ID
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {formData.propertyId}
                    </div>
                  </div>
                  <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Requested Sq-ft
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {formData.requestedSqFt}
                    </div>
                  </div>
                  <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Requested Category
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {formData.requestedCategory}
                    </div>
                  </div>
                  <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Largest invoice amount
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {formData.largestInvoiceAmount}
                    </div>
                  </div>
                  <div className="w-[310px] h-[18px] inline-flex justify-start items-start gap-1">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Estimated monthly collection
                    </div>
                    <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      {formData.estimatedMonthlyCollection}
                    </div>
                  </div>
                  <div className="w-full inline-flex justify-between items-center gap-2">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Upload Space File
                    </div>
                    {isEditMode ? (
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <Upload className="w-4 h-4 text-secondary-light" />
                          <span className="text-secondary-light text-xs font-semibold font-['Inter'] underline leading-[18px]">
                            Upload
                          </span>
                          <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            disabled={!isEditMode}
                          />
                        </label>
                        {formData.spaceFile && (
                          <span className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                            {formData.spaceFile.name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="flex justify-start items-center gap-2">
                        <Download className="w-4 h-4 text-secondary-light" />
                        <div className="justify-start text-secondary-light text-xs font-semibold font-['Inter'] underline leading-[18px]">
                          Download
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start gap-2">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Balance Requirement for Processing
                    </div>
                    <CustomInput
                      value={formData.balanceRequirement}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          balanceRequirement: value,
                        }))
                      }
                      readOnly={!isEditMode}
                      isEditing={isEditMode}
                      className="h-9 px-3.5 py-2.5 text-sm text-tertiary-light"
                      containerClassName="w-full"
                      labelClassName="hidden"
                      placeholder="i.e. $8,000"
                    />
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start gap-2">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Confirmed Sq-ft
                    </div>
                    <CustomInput
                      value={formData.confirmedSqFt}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmedSqFt: value,
                        }))
                      }
                      readOnly={!isEditMode}
                      isEditing={isEditMode}
                      className="h-9 px-3.5 py-2.5 text-sm text-tertiary-light"
                      containerClassName="w-full"
                      labelClassName="hidden"
                      placeholder="i.e. 10000"
                    />
                  </div>
                  <div className="self-stretch flex flex-col justify-center items-start gap-2">
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      Category
                    </div>
                    <div className="self-stretch inline-flex justify-between items-start">
                      <div className="w-[216px] flex justify-start items-center gap-3">
                        <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                          Industrial
                        </div>
                        <ToggleSwitch
                          isOn={formData.isIndustrialCategory}
                          onToggle={toggleCategory}
                          isDisabled={!isEditMode}
                        />
                        <div className="w-[103px] justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                          Retail, Office, Flex
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {isEditMode && (
                  <div className="self-stretch bg-secondary-light rounded inline-flex justify-center items-center gap-2 mt-4">
                    <PixieButton
                      label="Approve"
                      disabled={false}
                      onClick={handleApprove}
                      className="flex-1 h-8 px-[85px] py-0.5 bg-tertiary-deepNavy text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyApprovalCard;

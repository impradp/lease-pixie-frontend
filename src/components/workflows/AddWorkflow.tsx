"use client";

import React from "react";
import { X } from "lucide-react";
import { PixieDropdown } from "../ui/input/PixieDropdown";
import PixieButton from "../ui/buttons/PixieButton";
import { CustomInput } from "../ui/input/CustomInput";

interface AddWorkflowProps {
  onClose: () => void;
  onAdd: (workflowData: {
    workflow: string;
    title: string;
    unit: string;
    vendor: string;
  }) => void;
}

export const AddWorkflow: React.FC<AddWorkflowProps> = ({ onClose, onAdd }) => {
  const [workflow, setWorkflow] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [vendor, setVendor] = React.useState("");

  const workflowOptions = [
    { value: "Workflow-1", label: "Workflow-1" },
    { value: "Workflow-2", label: "Workflow-2" },
    { value: "Workflow-3", label: "Workflow-3" },
    { value: "Workflow-4", label: "Workflow-4" },
  ];

  const suggestions = [
    "Inquiry: Product Information",
    "[Another suggestion]",
    "[Another suggestion]",
  ];
  const unitOptions = [
    { value: "Unit 1", label: "Unit 1" },
    { value: "Unit 2", label: "Unit 2" },
  ];
  const vendorOptions = [
    { value: "Vendor 1", label: "Vendor 1" },
    { value: "Vendor 2", label: "Vendor 2" },
  ];

  const handleAddClick = () => {
    onAdd({ workflow, title, unit, vendor });
    setWorkflow("");
    setTitle("");
    setUnit("");
    setVendor("");
  };

  return (
    <div className="w-full p-4 relative bg-[#f1f1f1] rounded-xl inline-flex flex-col justify-start items-start gap-1 mb-[20px]">
      <div className="self-stretch flex flex-col justify-start items-start gap-3">
        <div className="flex items-center w-full">
          <div className="flex-grow">
            <div className="text-card-open-regular text-[16px] font-bold font-['Inter'] leading-[30px]">
              Add Workflow
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-card-open-icon hover:text-card-open-regular ml-auto"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          {/* Workflow Section */}
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-center items-start gap-1">
              <div className="w-[70px] justify-start text-black text-xs font-bold font-['Inter'] leading-[18px]">
                Workflow
              </div>
              <PixieDropdown
                options={workflowOptions}
                value={workflow}
                onChange={(option) => setWorkflow(option)}
                isEditing={true}
                placeholder="Enter workflow"
                className="w-[300px]"
                containerClassName="w-[300px]"
                labelClassName="hidden"
              />
              <div className="self-stretch flex flex-col justify-start items-start gap-1 my-1.5">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 bg-[#dddddd] rounded flex justify-center items-center gap-1"
                  >
                    <div className="text-[#0b111d] text-xs font-normal font-['Inter'] leading-[18px]">
                      {suggestion}
                    </div>
                    <div className="w-4 h-4 relative cursor-pointer">
                      <X className="w-4 h-4 text-[#475466]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workflow Title */}
          <div className="self-stretch flex flex-col justify-center items-start gap-2 mt-2">
            <div className="w-32 justify-start text-black text-xs font-bold font-['Inter'] leading-[18px]">
              Workflow Title
            </div>
            <CustomInput
              label=""
              value={title}
              onChange={setTitle}
              isEditing={true}
              placeholder="Workflow title here"
              className="h-9 text-sm text-tertiary-light"
              containerClassName="w-full"
            />
            {/* <div className="self-stretch h-9 px-3.5 py-2.5 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-[#cfd4dc] inline-flex justify-start items-center gap-2 overflow-hidden">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Workflow title here"
                className="flex-1 text-[#475466] text-sm font-normal font-['Inter'] leading-tight bg-transparent outline-none"
              />
            </div> */}
          </div>

          {/* Unit */}
          <div className="self-stretch flex flex-col justify-center items-start gap-2">
            <div className="w-[70px] justify-start text-black text-xs font-bold font-['Inter'] leading-[18px]">
              Unit
            </div>
            <PixieDropdown
              options={unitOptions}
              value={unit}
              onChange={(option) => setUnit(option)}
              isEditing={true}
              placeholder="Select unit"
              className="w-[300px]"
              containerClassName="w-[300px]"
              labelClassName="hidden"
            />
          </div>

          {/* Vendor */}
          <div className="self-stretch flex flex-col justify-center items-start gap-2">
            <div className="w-[70px] justify-start text-black text-xs font-bold font-['Inter'] leading-[18px]">
              Vendor
            </div>
            <PixieDropdown
              options={vendorOptions}
              value={vendor}
              onChange={(option) => setVendor(option)}
              isEditing={true}
              placeholder="Select vendor"
              className="w-[300px]"
              containerClassName="w-[300px]"
              labelClassName="hidden"
            />
          </div>
        </div>

        {/* Add Button */}
        <div className="self-stretch inline-flex justify-center items-center gap-2">
          <PixieButton
            label={"Add"}
            disabled={false}
            onClick={handleAddClick}
            className="w-full h-8 flex items-center justify-center"
          />
        </div>
      </div>
    </div>
  );
};

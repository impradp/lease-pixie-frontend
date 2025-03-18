"use client";

import React from "react";
import { Property } from "@/types/Property"; // Adjust path

interface PropertyTabContentProps {
  properties?: Property[];
}

export const PropertyTabContent: React.FC<PropertyTabContentProps> = ({
  properties = [],
}) => {
  return (
    <div className="w-full inline-flex flex-col justify-start items-center gap-3">
      {properties.map((property, index) => (
        <div
          key={property.id}
          className="self-stretch flex flex-col justify-start items-start gap-2 group"
        >
          <div
            className={`self-stretch p-3 rounded-xl flex flex-col justify-start items-start gap-2 transition-all duration-300 ease-in-out group-hover:pb-6 ${
              index === 0
                ? "bg-tertiary-whisperGray shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] outline outline-1 outline-offset-[-1px] outline-tertiary-blueTint"
                : "bg-secondary-fill"
            }`}
          >
            <div className="self-stretch flex flex-col justify-center items-start gap-1">
              <div className="self-stretch inline-flex justify-start items-center gap-2.5">
                <div className="justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-[18px]">
                  {property.name}
                </div>
              </div>
              <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                {property.address}
              </div>
            </div>
            {/* Buttons Container - Hidden by default, expands on hover */}
            <div className="self-stretch flex flex-col justify-center items-center gap-1 max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-300 ease-in-out">
              <div className="self-stretch inline-flex justify-center items-center gap-3">
                <div className="px-2 py-1 bg-tertiary-platinumGray rounded flex justify-start items-center gap-1 overflow-hidden">
                  <div className="justify-start text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
                    Dashboard
                  </div>
                </div>
                <div className="px-2 py-1 bg-tertiary-coolSilver rounded flex justify-start items-center gap-1">
                  <div className="justify-start text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
                    Settings
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyTabContent;

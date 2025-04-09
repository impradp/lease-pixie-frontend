"use client";

import React from "react";
import { Property } from "@/types/Property"; // Adjust path

/**
 * Props for the PropertyTabContent component
 */
interface PropertyTabContentProps {
  properties?: Property[]; // List of properties to display (defaults to empty array)
}

/**
 * Renders a list of property items with details and interactive elements
 * @param props - The properties for configuring the tab content
 * @returns JSX.Element - The rendered property tab content
 */
const PropertyTabContent: React.FC<PropertyTabContentProps> = ({
  properties = [],
}) => {
  return (
    <div className="w-full flex flex-col justify-start items-center gap-3">
      {properties.map((property, index) => (
        <div
          key={property.id} // Assumes property.id is unique
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
              <div className="text-secondary-light text-sm font-bold font-['Inter'] leading-[18px]">
                {property.name}
              </div>
              <div className="text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                {property.address}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-center items-center gap-1 max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-300 ease-in-out">
              <div className="self-stretch flex justify-center items-center gap-3">
                <button className="px-2 py-1 bg-tertiary-platinumGray rounded text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
                  Dashboard
                </button>
                <button className="px-2 py-1 bg-tertiary-coolSilver rounded text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyTabContent;

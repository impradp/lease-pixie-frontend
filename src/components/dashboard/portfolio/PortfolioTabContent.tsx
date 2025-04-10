"use client";

import React from "react";
import { Portfolio } from "@/types/Portfolio";
import CircularProgressBar from "@/components/ui/CircularProgressBar";

/**
 * Props for the PortfolioTabContent component
 */
interface PortfolioTabContentProps {
  portfolios: Portfolio[]; // List of portfolios to display
}

/**
 * Renders a list of portfolio items with details and interactive elements
 * @param props - The properties for configuring the portfolio content
 * @returns JSX.Element - The rendered portfolio tab content
 */
const PortfolioTabContent: React.FC<PortfolioTabContentProps> = ({
  portfolios,
}) => {
  return (
    <div className="flex flex-col justify-start items-center gap-3">
      {portfolios.map((portfolio, index) => (
        <div
          key={portfolio.id || index} // Prefer unique ID over index if available
          className="self-stretch shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex flex-col justify-start items-start gap-4 group"
        >
          <div className="self-stretch p-3 bg-tertiary-whisperGray rounded-xl outline outline-1 outline-tertiary-blueTint flex flex-col justify-start items-start gap-2 transition-all duration-300 ease-in-out group-hover:pb-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch text-tertiary-offBlack text-sm font-bold font-['Inter'] leading-tight">
                {portfolio.name}
              </div>
              <div className="self-stretch flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                    {portfolio?.totalProperties}{" "}
                    <span className="text-tertiary-light font-normal">
                      properties
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-icon-info rounded-full" />
                  <div className="text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                    {portfolio?.squareFootage?.toLocaleString() ?? "N/A"}{" "}
                    <span className="text-tertiary-light font-normal">
                      sqft
                    </span>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-end gap-2">
                  <div className="flex items-center gap-2">
                    <CircularProgressBar
                      percentage={portfolio?.completionPercentage ?? 0}
                    />
                    <div className="text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      {portfolio?.completionPercentage ?? 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-center items-center gap-1 max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-300 ease-in-out">
              <div className="self-stretch flex justify-center items-center gap-3">
                <button className="px-2 py-1 bg-tertiary-platinumGray rounded text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
                  Dashboard
                </button>
                <button className="px-2 py-1 bg-tertiary-platinumGray rounded text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
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

export default PortfolioTabContent;

"use client";

import React from "react";
import { Portfolio } from "@/types/Portfolio";
import { CircularProgressBar } from "@/components/ui/CircularProgressBar"; // Adjust path

interface PortfolioTabContentProps {
  portfolios: Portfolio[];
}

export const PortfolioTabContent: React.FC<PortfolioTabContentProps> = ({
  portfolios,
}) => {
  return (
    <div className="flex flex-col justify-start items-center gap-3">
      {portfolios.map((portfolio, index) => (
        <div
          key={index}
          className="self-stretch shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex flex-col justify-start items-start gap-4 group"
        >
          <div className="self-stretch p-3 bg-tertiary-whisperGray rounded-xl outline outline-1 outline-tertiary-blueTint flex flex-col justify-start items-start gap-2 transition-all duration-300 ease-in-out group-hover:pb-6">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-start">
                <div className="flex-1 justify-start text-tertiary-offBlack text-sm font-bold font-['Inter'] leading-tight">
                  {portfolio.name}
                </div>
              </div>
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="flex justify-start items-center gap-2">
                  <div className="justify-start">
                    <span className="text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      {portfolio.propertyCount}
                    </span>
                    <span className="text-tertiary-slateMist text-xs font-normal font-['Inter'] leading-[18px]">
                      {" "}
                    </span>
                    <span className="text-tertiary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      properties
                    </span>
                  </div>
                  <div className="w-2 h-2 bg-icon-info rounded-full" />
                  <div className="justify-start">
                    <span className="text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      {portfolio?.sqft?.toLocaleString()}
                    </span>
                    <span className="text-tertiary-slateMist text-xs font-normal font-['Inter'] leading-[18px]">
                      {" "}
                    </span>
                    <span className="text-tertiary-light text-xs font-normal font-['Inter'] leading-[18px]">
                      sqft
                    </span>
                  </div>
                </div>
                <div className="inline-flex flex-col justify-center items-end gap-2">
                  <div className="inline-flex justify-start items-center gap-2">
                    <CircularProgressBar
                      percentage={portfolio?.completionPercentage ?? 0}
                    />
                    <div className="justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      {portfolio.completionPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Buttons Container - Hidden by default, expands on hover */}
            <div className="self-stretch flex flex-col justify-center items-center gap-1 max-h-0 overflow-hidden group-hover:max-h-10 transition-all duration-300 ease-in-out">
              <div className="self-stretch inline-flex justify-center items-center gap-3">
                <div className="flex justify-start items-center gap-1">
                  <div className="px-2 py-1 bg-tertiary-platinumGray rounded flex justify-start items-center gap-1 overflow-hidden">
                    <div className="justify-start text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
                      Dashboard
                    </div>
                  </div>
                </div>
                <div className="flex justify-start items-center gap-1">
                  <div className="px-2 py-1 bg-tertiary-platinumGray rounded flex justify-start items-center gap-1">
                    <div className="justify-start text-secondary-light text-xs font-medium font-['Inter'] leading-[18px]">
                      Settings
                    </div>
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

export default PortfolioTabContent;

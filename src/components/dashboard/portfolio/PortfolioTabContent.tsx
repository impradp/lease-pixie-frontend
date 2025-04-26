"use client";

import React, { useState } from "react";
import { Portfolio } from "@/types/Portfolio";
import CircularProgressBar from "@/components/ui/CircularProgressBar";

/**
 * Props for the PortfolioTabContent component
 */
interface PortfolioTabContentProps {
  portfolios: Portfolio[]; // List of portfolios to display
  isEditable?: boolean;
  onEditClick?: (portfolioId: number) => void;
}

/**
 * Renders a list of portfolio items with details and interactive elements
 * @param props - The properties for configuring the portfolio content
 * @returns JSX.Element - The rendered portfolio tab content
 */
const PortfolioTabContent: React.FC<PortfolioTabContentProps> = ({
  portfolios,
  isEditable = false,
  onEditClick,
}) => {
  // Track which portfolio is currently expanded
  const [expandedId, setExpandedId] = useState<string | number | null>(null);

  // Toggle expanded state when a portfolio is clicked
  const toggleExpanded = (id: string | number) => {
    if (expandedId === id) {
      setExpandedId(null); // Collapse if already expanded
    } else {
      setExpandedId(id); // Expand the clicked portfolio
    }
  };

  return (
    <div className="flex flex-col justify-start items-center gap-3">
      {portfolios.length === 0 && (
        <div className="self-stretch p-2 bg-tertiary-whisperGray rounded-md inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="self-stretch inline-flex justify-start items-center gap-2">
                <div className="flex-1 justify-start text-dropdown-regular text-xs font-normal font-['Inter'] leading-[18px]">
                  No portfolio available
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {portfolios.map((portfolio, index) => {
        const portfolioId = portfolio.id ?? index;
        const isExpanded = expandedId === portfolioId;

        return (
          <div
            key={portfolioId}
            className="self-stretch shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05)] flex flex-col justify-start items-start gap-4"
          >
            <div
              className={`self-stretch p-3 bg-tertiary-whisperGray rounded-xl outline outline-1 outline-tertiary-blueTint flex flex-col justify-start items-start gap-2 transition-all duration-300 ease-in-out cursor-pointer ${
                isExpanded ? "pb-6" : ""
              }`}
              onClick={() => toggleExpanded(portfolioId)}
            >
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch text-tertiary-offBlack text-sm font-bold font-['Inter'] leading-tight">
                  {portfolio.name}
                </div>
                <div className="self-stretch flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="text-secondary-light text-xs font-bold font-['Inter'] leading-[18px]">
                      {portfolio?.totalProperties ?? "N/A"}{" "}
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
              <div
                className={`self-stretch flex flex-col justify-center items-center gap-1 overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? "max-h-10" : "max-h-0"
                }`}
              >
                <div className="self-stretch flex justify-center items-center gap-3">
                  <button
                    className="px-2 py-1 bg-tertiary-platinumGray rounded text-secondary-light text-xs font-medium font-['Inter'] leading-[18px] cursor-pointer"
                    onClick={(e) => e.stopPropagation()} // Prevent toggling when buttons are clicked
                  >
                    Dashboard
                  </button>
                  <button
                    disabled={!isEditable || !portfolio.id}
                    onClick={() =>
                      portfolio.id && onEditClick && onEditClick(portfolio?.id)
                    }
                    className={`px-2 py-1 bg-tertiary-platinumGray rounded text-secondary-light text-xs font-medium font-['Inter'] leading-[18px] cursor-pointer ${
                      isEditable && portfolio.id
                        ? "hover:bg-tertiary-platinumGray/80 active:cursor-progress"
                        : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    <span className="text-xs font-medium text-primary-button">
                      Settings
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioTabContent;

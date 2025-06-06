"use client";

import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import { PortfolioUser } from "@/types/Portfolio";
import LinkButton from "@/components/ui/buttons/LinkButton";

interface PortfolioUserCardContentProps {
  user: PortfolioUser;
  onDelete?: (user: PortfolioUser) => void;
  isEditable?: boolean;
  onNameClick?: (portfolioId: number) => void;
}

export const PortfolioUserCardContent: React.FC<
  PortfolioUserCardContentProps
> = ({ user, onDelete, isEditable = false, onNameClick }) => {
  const [isPortfoliosOpen, setIsPortfoliosOpen] = useState(false); // Initially collapsed

  const togglePortfolios = () => {
    setIsPortfoliosOpen(!isPortfoliosOpen);
  };

  const onClickName = async (portfolioId: number) => {
    onNameClick?.(portfolioId);
  };

  return (
    <div className="w-full p-3 bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-start gap-1">
      <div className="self-stretch inline-flex justify-start items-start gap-2">
        <div className="flex-1 inline-flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-center items-start gap-1">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-[18px]">
                {user.firstName + " " + user.lastName}
              </div>
            </div>
            <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
              {user?.email}
            </div>
            <div className="justify-start text-tertiary-midnightBlue text-xs font-normal font-['Inter'] leading-tight">
              {user?.mobileNumber}
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-px bg-tertiary-stroke" />
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div
              className="w-full h-5 inline-flex justify-between items-center cursor-pointer"
              onClick={togglePortfolios}
            >
              <div className="text-center justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-tight">
                Portfolios
              </div>
              <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                <ChevronRight
                  className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                    isPortfoliosOpen ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>
            {isPortfoliosOpen && (
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                {user?.portfolioList?.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    className="self-stretch inline-flex justify-start items-center gap-1"
                  >
                    <div className="bg-tertiary-neutralGray outline outline-1 outline-offset-[-1px] outline-black flex justify-center items-start gap-1">
                      <div className="w-6 h-6 relative">
                        <div className="w-3 left-[6px] top-0 absolute text-center justify-start text-tertiary-midnightBlue text-base font-bold font-['Inter'] leading-normal">
                          {user.id === portfolio?.primaryUserId
                            ? "1"
                            : user.id === portfolio?.secondaryUserId
                            ? "2"
                            : ""}
                        </div>
                      </div>
                    </div>
                    <LinkButton
                      label={portfolio.name}
                      onClick={() =>
                        portfolio?.id && onClickName(portfolio?.id)
                      }
                      className="justify-start text-tertiary-light text-xs font-normal font-['Inter'] underline leading-[18px]"
                      disabled={!isEditable}
                    />
                  </div>
                ))}
                {user?.portfolioList?.length === 0 && (
                  <>
                    <div className="self-stretch p-2 bg-gray-50 rounded-md inline-flex flex-col justify-start items-start gap-1 overflow-hidden">
                      <div className="self-stretch flex flex-col justify-start items-start gap-2">
                        <div className="self-stretch flex flex-col justify-start items-start gap-2">
                          <div className="self-stretch inline-flex justify-start items-center gap-2">
                            <div className="flex-1 justify-start text-dropdown-regular text-xs font-normal font-['Inter'] leading-[18px]">
                              No associated portfolio available
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center items-center w-full">
                      <LinkButton
                        label="Delete"
                        hidden={
                          !isEditable || user?.portfolioList?.length !== 0
                        }
                        onClick={() => user.id && onDelete && onDelete(user)} // Trigger onDelete callback if provided
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioUserCardContent;

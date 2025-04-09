"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PropertyUser } from "@/types/PropertyUser";
import { privilegeColors } from "@/lib/utils/privilegeColors";

interface PropertyUsersCardContentProps {
  user: PropertyUser;
  onPrivilegeClick?: (data: {
    userId: string;
    propertyId: string;
    subLevelId: string;
    privilege: string;
  }) => void;
}

export const PropertyUsersCardContent: React.FC<
  PropertyUsersCardContentProps
> = ({ user, onPrivilegeClick }) => {
  const [isAccessLevelOpen, setIsAccessLevelOpen] = useState(false);
  const [isBadgeClicked, setIsBadgeClicked] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleAccessLevel = () => {
    setIsAccessLevelOpen(!isAccessLevelOpen);
  };

  const handlePrivilegeClick = (
    userId: string,
    propertyId: string,
    subLevelId: string,
    privilege: string
  ) => {
    const key = `${userId}-${propertyId}-${subLevelId}-${privilege}`;
    setIsBadgeClicked((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
    if (onPrivilegeClick) {
      onPrivilegeClick({ userId, propertyId, subLevelId, privilege });
    }
  };

  const allPrivileges = ["M", "P", "L", "A"];

  return (
    <div className="w-full self-stretch bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-center gap-4">
      <div className="w-full p-3 flex flex-col justify-start items-start gap-1">
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <div className="w-full h-[72px] flex flex-col justify-start items-start gap-2">
            <div className="self-stretch inline-flex justify-start items-start gap-1">
              <div className="flex-1 justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-tight">
                {user.name}
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
              <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                {user.email}
              </div>
              <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                {user.phone}
              </div>
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div className="self-stretch h-px bg-tertiary-stroke" />
          </div>
          <div className="self-stretch flex flex-col justify-start items-start gap-2">
            <div
              className="w-full h-5 inline-flex justify-between items-center cursor-pointer"
              onClick={toggleAccessLevel}
            >
              <div className="text-center justify-start text-secondary-light text-xs font-bold font-['Inter'] leading-tight">
                Access level
              </div>
              <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                <ChevronDown
                  className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                    isAccessLevelOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {isAccessLevelOpen && (
              <div className="w-full flex flex-col justify-start items-start gap-1">
                {user.accessLevels.map((access) => (
                  <div
                    key={access.id}
                    className="w-full h-[118px] p-2 bg-primary-fill/95 rounded flex flex-col justify-start items-start gap-1"
                  >
                    <div className="w-[310px] flex flex-col justify-start items-start gap-1">
                      <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                        {access.propertyId}
                      </div>
                      {access.subLevels.map((subLevel) => (
                        <div
                          key={subLevel.id}
                          className="px-3 inline-flex justify-start items-center gap-1"
                        >
                          <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
                            [Property ID]
                          </div>
                          <div className="flex justify-center items-start gap-1">
                            {allPrivileges.map((privilege) => {
                              const key = `${user.id}-${access.propertyId}-${subLevel.id}-${privilege}`;
                              const isClicked = isBadgeClicked[key] || false;
                              const isHighlighted =
                                subLevel.accessAvailable.includes(privilege);
                              const baseColor = isHighlighted
                                ? privilegeColors[privilege]
                                : privilegeColors.default;
                              const displayColor = isClicked
                                ? isHighlighted
                                  ? privilegeColors.default
                                  : privilegeColors[privilege]
                                : baseColor;

                              return (
                                <div
                                  key={privilege}
                                  className="w-6 h-6 relative"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrivilegeClick(
                                      user.id,
                                      access.propertyId,
                                      subLevel.id,
                                      privilege
                                    );
                                  }}
                                  style={{
                                    backgroundColor: displayColor,
                                    cursor: "pointer",
                                    zIndex: 10,
                                  }}
                                >
                                  <div className="absolute inset-0 flex items-center justify-center text-tertiary-offWhite text-base font-bold font-['Inter'] leading-normal">
                                    {privilege}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyUsersCardContent;

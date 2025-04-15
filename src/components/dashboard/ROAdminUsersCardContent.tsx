"use client";

import React from "react";
import { ReadOnlyAdminUser } from "@/types/ReadOnlyAdminUser";
import LinkButton from "../ui/buttons/LinkButton";

interface ROAdminUsersCardContentProps {
  user: ReadOnlyAdminUser;
  onDelete?: (userId: string) => void;
}

export const ROAdminUsersCardContent: React.FC<
  ROAdminUsersCardContentProps
> = ({ user, onDelete }) => {
  return (
    <div className="w-full p-3 bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-start gap-1">
      <div className="self-stretch h-[66px] flex flex-col justify-start items-start gap-[15px]">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-center items-start gap-1">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-[18px]">
                {user.firstName + " " + user.lastName}
              </div>
              <LinkButton
                label="Delete"
                onClick={() => user.id && onDelete && onDelete(user.id)}
              />
            </div>
            <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
              {user.email}
            </div>
            <div className="justify-start text-tertiary-midnightBlue text-xs font-normal font-['Inter'] leading-tight">
              {user.mobileNumber}
            </div>
          </div>
          <div className="self-stretch h-px" />
        </div>
      </div>
    </div>
  );
};

export default ROAdminUsersCardContent;

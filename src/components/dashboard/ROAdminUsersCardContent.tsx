"use client";

import React from "react";
import { ReadOnlyAdminUser } from "@/types/ReadOnlyAdminUser";

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
                {user.name}
              </div>
              <div
                data-hierarchy="Link gray"
                data-icon="Default"
                data-size="sm"
                data-state="Default"
                className="flex justify-center items-center gap-1.5 overflow-hidden cursor-pointer"
                onClick={() => onDelete && onDelete(user.id)}
              >
                <div className="justify-start text-tertiary-light text-xs font-semibold font-['Inter'] underline leading-tight">
                  Delete
                </div>
              </div>
            </div>
            <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
              {user.email}
            </div>
            <div className="justify-start text-tertiary-midnightBlue text-xs font-normal font-['Inter'] leading-tight">
              {user.phone}
            </div>
          </div>
          <div className="self-stretch h-px" />
        </div>
      </div>
    </div>
  );
};

export default ROAdminUsersCardContent;

"use client";

import React from "react";
import { ReadOnlyAdminUser } from "@/types/ReadOnlyAdminUser";
import LinkButton from "../ui/buttons/LinkButton";

interface ROAdminUsersCardContentProps {
  user: ReadOnlyAdminUser;
  onDelete?: (user: ReadOnlyAdminUser) => void;
  isEditable?: boolean;
}

/**
 * ROAdminUsersCardContent displays a card with read-only admin user details and a delete option.
 * @param {ROAdminUsersCardContentProps} props - The component props
 * @param {ReadOnlyAdminUser} props.user - The user data to display
 * @param {(user: ReadOnlyAdminUser) => void} [props.onDelete] - Optional callback to handle user deletion
 * @returns {JSX.Element} The rendered user card component
 */
export const ROAdminUsersCardContent: React.FC<
  ROAdminUsersCardContentProps
> = ({ user, onDelete, isEditable = false }) => {
  return (
    <div className="w-full p-3 bg-secondary-fill rounded-xl inline-flex flex-col justify-start items-start gap-1">
      <div className="self-stretch h-[66px] flex flex-col justify-start items-start gap-[15px]">
        <div className="self-stretch flex flex-col justify-start items-start gap-4">
          <div className="self-stretch flex flex-col justify-center items-start gap-1">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="justify-start text-secondary-light text-sm font-bold font-['Inter'] leading-[18px]">
                {user.firstName + " " + user.lastName} {/* Display full name */}
              </div>
              <LinkButton
                disabled={!isEditable}
                label="Delete"
                onClick={() => user.id && onDelete && onDelete(user)} // Trigger onDelete callback if provided
              />
            </div>
            <div className="justify-start text-secondary-light text-xs font-normal font-['Inter'] leading-[18px]">
              {user.email} {/* Display user email */}
            </div>
            <div className="justify-start text-tertiary-midnightBlue text-xs font-normal font-['Inter'] leading-tight">
              {user.mobileNumber} {/* Display user mobile number */}
            </div>
          </div>
          <div className="self-stretch h-px" /> {/* Divider line */}
        </div>
      </div>
    </div>
  );
};

export default ROAdminUsersCardContent;

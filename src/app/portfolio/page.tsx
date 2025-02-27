"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUser } from "@/components/portfolio/PortfolioUser";
import {
  samplePrimaryUsers,
  sampleSecondaryUsers,
  sampleVendorUsers,
} from "@/data/users";
import { DropdownOption } from "@/types/user";
import PixieButton from "@/components/buttons/PixieButton";
import ConfirmationDialog from "@/components/popups/ConfirmationDialog";
import { getMessages } from "@/locales/loader";
import { Locale } from "@/locales";
import Link from "next/link";

export default function PortfolioPage() {
  const portfolioId = "";
  const isExistingPortfolio = !!portfolioId;

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const [isEditing, setIsEditing] = useState(false);
  const [isSecondaryUserLocked, setIsSecondaryUserLocked] = useState(true);
  const [isSecondaryVendorLocked, setIsSecondaryVendorLocked] = useState(true);
  const [isTertiaryVendorLocked, setIsTertiaryVendorLocked] = useState(true);
  const [primarySelectedUser, setPrimarySelectedUser] = useState<
    DropdownOption | undefined
  >();
  const [secondarySelectedUser, setSecondarySelectedUser] = useState<
    DropdownOption | undefined
  >();
  const [primarySelectedVendor, setPrimarySelectedVendor] = useState<
    DropdownOption | undefined
  >();
  const [secondarySelectedVendor, setSecondarySelectedVendor] = useState<
    DropdownOption | undefined
  >();
  const [tertiarySelectedVendor, setTertiarySelectedVendor] = useState<
    DropdownOption | undefined
  >();

  // TODO: Fetch portfolio data
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState(
    isExistingPortfolio ? "Grizwald Realty Company" : ""
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    // TODO: Implement submit logic
    setIsPopupOpen(true);
  };

  // Automatically select the empty option in secondary when primary is selected
  const handlePrimaryUserChange = (user: DropdownOption) => {
    setPrimarySelectedUser(user);
    if (user && user.value != "") {
      setIsSecondaryUserLocked(false);
      const emptyOption = sampleSecondaryUsers.find((opt) => opt.value === "");
      if (emptyOption) {
        setSecondarySelectedUser(emptyOption);
      }
    }
  };

  const handlePrimaryVendorChange = (user: DropdownOption) => {
    setPrimarySelectedVendor(user);
    if (user && user.value != "") {
      setIsSecondaryVendorLocked(false);
      setIsTertiaryVendorLocked(false);
      const emptyOption = sampleVendorUsers.find((opt) => opt.value === "");
      if (emptyOption) {
        setSecondarySelectedVendor(emptyOption);
        setTertiarySelectedVendor(emptyOption);
      }
    }
  };

  return (
    <>
      <div className="flex items-end justify-end text-xs mb-8 mt-2">
        <div className="hidden xs:flex xs:flex-col xs:items-end xs:justify-end">
          <div className="text-right mt-1">
            <Link
              href="/account/dashboard"
              className="text-primary-regular font-normal font-['Inter'] leading-tight mx-1"
            >
              <span className="text-primary-fade font-normal font-['Inter'] leading-tight">
                Account Dashboard -&gt;
              </span>
            </Link>
          </div>

          <div className="text-right mt-1">
            <span className="text-primary-regular font-normal font-['Inter'] leading-tight mx-1">
              Add Portfolio
            </span>
          </div>
        </div>
        {/* Layout for screens <= 431px (single line, right-aligned) */}
        <div className="flex xs:hidden items-center justify-end w-full">
          <Link
            href="/account/dashboard"
            className="text-primary-regular font-normal font-['Inter'] leading-tight mx-1"
          >
            <span className="text-primary-fade font-normal font-['Inter'] leading-tight">
              Account Dashboard -&gt;
            </span>
          </Link>
          <span className="text-primary-regular font-normal font-['Inter'] leading-tight mx-1">
            Add Portfolio
          </span>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto space-y-8">
        <div className="space-y-8">
          <PortfolioCard
            portfolioName={portfolioName}
            onEdit={handleEdit}
            isExistingPortfolio={isExistingPortfolio}
            onNameChange={
              isEditing || !isExistingPortfolio ? setPortfolioName : undefined
            }
          />

          <PortfolioUser
            label={messages?.portfolio?.user?.title}
            users={samplePrimaryUsers}
            selectedUser={primarySelectedUser}
            onUserChange={handlePrimaryUserChange}
            isExistingPortfolio={isExistingPortfolio}
            isLocked={false}
          />

          <PortfolioUser
            label={messages?.portfolio?.user?.titleSecondary}
            users={sampleSecondaryUsers}
            selectedUser={secondarySelectedUser}
            onUserChange={isEditing ? setSecondarySelectedUser : undefined}
            isExistingPortfolio={isExistingPortfolio}
            isLocked={isSecondaryUserLocked}
            lockMessage={"Secondary user is not active"}
          />

          <PortfolioUser
            label={messages?.portfolio?.vendor?.title}
            users={sampleVendorUsers}
            selectedUser={primarySelectedVendor}
            onUserChange={handlePrimaryVendorChange}
            isExistingPortfolio={isExistingPortfolio}
            showInfo={true}
            userType="Vendor"
            infoContent={messages?.portfolio?.vendor?.primaryInfo}
            isLocked={false}
          />

          <PortfolioUser
            label={messages?.portfolio?.vendor?.titleSecondary}
            users={sampleVendorUsers}
            selectedUser={secondarySelectedVendor}
            onUserChange={setSecondarySelectedVendor}
            isExistingPortfolio={isExistingPortfolio}
            showInfo={true}
            userType="Vendor"
            infoContent={messages?.portfolio?.vendor?.secondaryInfo}
            isLocked={isSecondaryVendorLocked}
            lockMessage={"Seat not active"}
          />

          <PortfolioUser
            label={messages?.portfolio?.vendor?.titleTertiary}
            users={sampleVendorUsers}
            selectedUser={tertiarySelectedVendor}
            onUserChange={setTertiarySelectedVendor}
            isExistingPortfolio={isExistingPortfolio}
            showInfo={true}
            userType="Vendor"
            infoContent={messages?.portfolio?.vendor?.tertiaryInfo}
            isLocked={isTertiaryVendorLocked}
            lockMessage={"Seat not active"}
          />
        </div>

        <div className="pt-8">
          <PixieButton
            label={messages?.portfolio?.button?.label}
            disabled={false}
            onClick={handleSubmit}
            className="w-full"
          />
        </div>
      </div>

      <ConfirmationDialog
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        title={messages?.portfolio?.confirmModal?.title}
        message={messages?.portfolio?.confirmModal?.message}
      />
    </>
  );
}

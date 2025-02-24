"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUser } from "@/components/portfolio/PortfolioUser";
import { sampleUsers } from "@/data/users";
import { DropdownOption } from "@/types/user";
import PixieButton from "@/components/buttons/PixieButton";
import ConfirmationDialog from "@/components/popups/ConfirmationDialog";
import { getMessages } from "@/locales/loader";
import { Locale } from "@/locales";

export default function PortfolioPage() {
  const portfolioId = "";
  const isExistingPortfolio = !!portfolioId;

  const [locale] = useState<Locale>("en");
  const messages = getMessages(locale);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    DropdownOption | undefined
  >();

  //TODO: Fetch portfolio data
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState(
    isExistingPortfolio ? "Grizwald Realty Company" : ""
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    //TODO: Implement submit logic
    setIsPopupOpen(true);
  };

  return (
    <>
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-[560px] mx-auto space-y-8">
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
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
            />

            <PortfolioUser
              label={messages?.portfolio?.user?.titleSecondary}
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
            />

            <PortfolioUser
              label={messages?.portfolio?.vendor?.title}
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
              showInfo={true}
              userType="Vendor"
              infoContent={messages?.portfolio?.vendor?.primaryInfo}
            />

            <PortfolioUser
              label={messages?.portfolio?.vendor?.titleSecondary}
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
              showInfo={true}
              userType="Vendor"
              infoContent={messages?.portfolio?.vendor?.secondaryInfo}
            />

            <PortfolioUser
              label={messages?.portfolio?.vendor?.titleTertiary}
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
              showInfo={true}
              userType="Vendor"
              infoContent={messages?.portfolio?.vendor?.tertiaryInfo}
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

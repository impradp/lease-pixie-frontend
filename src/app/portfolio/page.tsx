"use client";

import { useState } from "react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUser } from "@/components/portfolio/PortfolioUser";
import { sampleUsers } from "@/data/users";
import { DropdownOption } from "@/types/user";
import PixieButton from "@/components/buttons/PixieButton";
import ConfirmationDialog from "@/src/components/popups/ConfirmationDialog";

export default function PortfolioPage() {
  const portfolioId = "";
  const isExistingPortfolio = !!portfolioId;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<
    DropdownOption | undefined
  >();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [portfolioName, setPortfolioName] = useState(
    isExistingPortfolio ? "Grizwald Realty Company" : ""
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    //TODO: Implement submit logic
    console.log("Portfolio submitted");
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
              label="Primary Portfolio User"
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
            />

            <PortfolioUser
              label="Secondary Portfolio User"
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
            />

            <PortfolioUser
              label="Preferred Tax Reporting Seat"
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
              showInfo={true}
              userType="Vendor"
              infoContent="Accounting Seat: included in workflows to provide tax related reports to file taxes"
            />

            <PortfolioUser
              label="Preferred Insurance Seat"
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
              showInfo={true}
              userType="Vendor"
              infoContent="Property Insurance Seat: included in workflows related to property insurance coverage"
            />

            <PortfolioUser
              label="Preferred Attorney Seat"
              users={sampleUsers}
              selectedUser={selectedUser}
              onUserChange={isEditing ? setSelectedUser : undefined}
              onEdit={handleEdit}
              isExistingPortfolio={isExistingPortfolio}
              showInfo={true}
              userType="Vendor"
              infoContent="Attorney Seat: included in workflows related to legal lease document production and tenant defaults. This seat will be requested to produce legal documents and must be licensed to practice law in the state in which the property is located."
            />
          </div>

          <div className="pt-8">
            <PixieButton
              label="Create Portfolio"
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
        title="Portfolio Created"
        message="Portfolio successfully created."
      />
    </>
  );
}

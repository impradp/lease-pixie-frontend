"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { PortfolioCard } from "@/components/portfolio/PortfolioCard";
import { PortfolioUser } from "@/components/portfolio/PortfolioUser";
import { sampleUsers } from "@/data/users";
import { User } from "@/types/user";
import PixieButton from "@/components/buttons/PixieButton";

export default function PortfolioPage() {
  const searchParams = useSearchParams();
  const portfolioId = searchParams.get("id");
  const isExistingPortfolio = !!portfolioId;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const [portfolioName, setPortfolioName] = useState(
    isExistingPortfolio ? "Grizwald Realty Company" : ""
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = () => {
    //TODO: Implement submit logic
    console.log("Portfolio creation submitted");
  };

  return (
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
  );
}

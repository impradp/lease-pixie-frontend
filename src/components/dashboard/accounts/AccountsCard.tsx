"use client";

import React, { useState, useEffect } from "react";
import { sampleCompanyInfoData } from "@/data/company";
import CompanyInfo from "@/components/dashboard/CompanyInfo";
import { NewAccount } from "@/components/dashboard/accounts/NewAccount";
import PixieCardHeader from "@/components/ui/header/PixieCardHeader";
import ConfirmationDialog from "@/components/ui/dialog/ConfirmationDialog";
import PreConfirmationDialog from "@/components/ui/dialog/PreConfirmationDialog";

interface AccountsCardProps {
  isEditable?: boolean;
  onSearchChange?: (value: string) => void;
}

const AccountsCard: React.FC<AccountsCardProps> = ({
  isEditable = false,
  onSearchChange,
}) => {
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationContent, setConfirmationContent] = useState({
    title: "",
    message: "",
  });
  const [isAccessLocked, setIsAccessLocked] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCompanies, setFilteredCompanies] = useState([
    sampleCompanyInfoData,
  ]);
  const [showPreConfirmationDialog, setShowPreConfirmationDialog] =
    useState(false);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (onSearchChange) {
      onSearchChange(value);
    }

    // Filter companies based on search term
    const filtered = [sampleCompanyInfoData].filter((company) =>
      [company.companyName, company.contactName, company.email].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredCompanies(filtered);
  };

  // Handle adding a new account
  const handleAccountAdd = () => {
    setShowPreConfirmationDialog(true);
  };

  useEffect(() => {
    if (showNewAccountModal || showConfirmation) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showNewAccountModal, showConfirmation]);

  const handleAddAccount = () => {
    //Call API and handle
    setConfirmationContent({
      title: "Account Added",
      message: "Account user successfully added.",
    });
    setShowNewAccountModal(false);
    setShowConfirmation(true);
  };

  const handleCloseAccountModal = () => {
    setShowNewAccountModal(false);
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
  };

  const handlePreConfirm = () => {
    setShowPreConfirmationDialog(false);
    setShowNewAccountModal(true);
  };

  const handlePreConfirmationClose = () => {
    setShowPreConfirmationDialog(false);
  };

  return (
    <>
      <div className="relative w-[408px] bg-tertiary-offWhite rounded-[10px] flex flex-col p-5 box-border max-w-full">
        <div className="w-full">
          <PixieCardHeader
            label={"Accounts"}
            isEditable={isEditable}
            onSearchChange={handleSearchChange}
            showSearchFeat={true}
            showSearchIcon={true}
            showAddIcon={true}
            onAddClick={handleAccountAdd}
          />
        </div>
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company, index) => (
            <CompanyInfo
              key={index}
              companyName={company.companyName}
              contactName={company.contactName}
              email={company.email}
              services={company.services}
              actions={company.actions}
              isAccessLocked={isAccessLocked}
              onToggleAccess={() => setIsAccessLocked(!isAccessLocked)}
              invoices={company.invoices}
              portfolios={company.portfolios}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 text-sm">
            No companies found matching your search.
          </div>
        )}
      </div>

      {showNewAccountModal && (
        <div className="fixed inset-0 z-50">
          <div className="relative z-50">
            <NewAccount
              onClose={handleCloseAccountModal}
              onSubmit={handleAddAccount}
            />
          </div>
        </div>
      )}

      <PreConfirmationDialog
        isOpen={showPreConfirmationDialog}
        onClose={handlePreConfirmationClose}
        onConfirm={handlePreConfirm}
        title={"Create Account"}
        message={
          "Create a billing account.  This action will add an Account user to the platform."
        }
        confirmButtonLabel="Create Billing Account"
      />

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={handleConfirmationClose}
        title={confirmationContent.title}
        message={confirmationContent.message}
      />
    </>
  );
};

export default AccountsCard;

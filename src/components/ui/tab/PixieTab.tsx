"use client";

import React from "react";

interface Tab {
  label: string;
  value: string;
}

interface PixieTabProps {
  tabs: Tab[]; // List of tabs to render
  activeTab: string; // Currently active tab value
  onTabClick: (value: string) => void; // Callback for tab selection
}

export const PixieTab: React.FC<PixieTabProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => {
  return (
    <div className="inline-flex justify-center items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabClick(tab.value)}
          className={`px-4 py-2 rounded ${
            activeTab === tab.value
              ? "bg-menu-header text-tertiary-fill"
              : "text-menu-header"
          } flex justify-center items-center`}
        >
          <span className="text-sm font-bold font-['Inter'] leading-tight">
            {tab.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default PixieTab;

"use client";

import React from "react";
import { Tab } from "@/types/Tab";

/**
 * Props for the PixieTab component
 */
interface PixieTabProps {
  tabs: Tab[]; // List of tabs to render
  activeTab: string; // Currently active tab value
  onTabClick: (value: string) => void; // Callback for tab selection
}

/**
 * Renders a set of clickable tabs with active state styling
 * @param props - The properties for configuring the tabs
 * @returns JSX.Element - The rendered tab component
 */
export const PixieTab: React.FC<PixieTabProps> = ({
  tabs,
  activeTab,
  onTabClick,
}) => {
  return (
    <div className="flex justify-center items-center gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabClick(tab.value)}
          className={`px-4 py-2 rounded flex justify-center items-center ${
            activeTab === tab.value
              ? "bg-menu-header text-tertiary-fill"
              : "text-menu-header"
          }`}
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

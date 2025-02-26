import React, { useState } from "react";
import { MenuItem } from "@/types/menuItem";

type SidebarMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  position?: { top: number; right: number } | null;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  isOpen,
  onClose,
  position = { top: 20, right: 20 },
}) => {
  //TODO: Replace with actual menu items
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      title: "Dashboards",
      isExpanded: false,
      subItems: [],
    },
    {
      title: "Add",
      isExpanded: false, // Initially closed
      subItems: ["User", "Property", "Portfolio", "Tenant"],
    },
    {
      title: "Settings",
      isExpanded: false, // Initially closed
      subItems: [
        "Property",
        "Amortized Expenses",
        "Categories",
        "HVAC",
        "Metered Utilities",
        "Operating Expenses",
        "Service Expenses",
        "Scheduled Work",
        "Units",
        "Vendors",
      ],
    },
    {
      title: "Account",
      isExpanded: false,
      subItems: [],
    },
  ]);

  const toggleMenuItem = (index: number) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index].isExpanded = !updatedMenuItems[index].isExpanded;
    setMenuItems(updatedMenuItems);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20" onClick={onClose} />

      {/* Floating Menu - positioned at the top right by default */}
      <div
        style={{
          position: "absolute",
          top: `${position?.top}px`,
          right: `${position?.right}px`,
        }}
        className="h-auto max-h-screen px-6 sm:px-8 pt-5 sm:pt-6 pb-4 sm:pb-6 bg-tertiary-fill/70 rounded-xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm justify-start items-start gap-1 inline-flex z-10"
      >
        <div className="w-[240px] sm:w-[268px] self-stretch flex-col justify-between items-start inline-flex">
          <div className="self-stretch flex-col justify-start items-start gap-2 flex">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.title}>
                <div
                  className="self-stretch justify-between items-start inline-flex cursor-pointer py-1"
                  onClick={() => toggleMenuItem(index)}
                >
                  <div className="text-secondary-regular text-sm sm:text-base font-bold font-['Inter'] leading-normal">
                    {item.title}
                  </div>
                  <div data-svg-wrapper>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {item.isExpanded &&
                  item.subItems &&
                  item.subItems.map((subItem) => (
                    <div
                      key={subItem}
                      className="self-stretch px-4 sm:px-6 py-0.5 justify-start items-start inline-flex"
                    >
                      <div className="text-black text-sm sm:text-base font-normal font-['Inter'] leading-normal">
                        {subItem}
                      </div>
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </div>

          <div className="self-stretch mt-4 px-4 py-2 bg-primary-button rounded justify-center items-center gap-1 inline-flex cursor-pointer">
            <div className="text-tertiary-regular text-xs sm:text-sm font-bold font-['Inter'] leading-tight">
              Sign out
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;

import React, { useState } from "react";
import { MenuItem } from "@/types/menuItem";

type SidebarMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      title: "Dashboards",
      isExpanded: false,
      subItems: [],
    },
    {
      title: "Add",
      isExpanded: false,
      subItems: ["User", "Property", "Portfolio", "Tenant"],
    },
    {
      title: "Settings",
      isExpanded: false,
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
    <>
      {/* Menu */}

      <div className="fixed inset-0  z-40" onClick={onClose} />
      <div
        className="absolute top-full right-0 z-50 px-4 sm:px-6 pt-5 sm:pt-6 pb-4 sm:pb-6 bg-tertiary-fill/70 rounded-xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-sm justify-start items-start gap-1 inline-flex"
        style={{
          width: "clamp(200px, 20%, 300px)",
          maxHeight: "calc(100vh - 100%)",
          overflowY: "auto",
        }}
      >
        <div className="w-full self-stretch flex-col justify-between items-start inline-flex">
          <div className="self-stretch flex-col justify-start items-start gap-2 flex">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.title}>
                <div
                  className="self-stretch justify-between items-start inline-flex cursor-pointer py-1"
                  onClick={() => toggleMenuItem(index)}
                >
                  <div className="text-secondary-regular text-xs sm:text-base font-bold font-['Inter'] leading-normal truncate">
                    {item.title}
                  </div>
                  <div data-svg-wrapper>
                    <svg
                      width="16"
                      height="16"
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
                      className="self-stretch px-2 sm:px-4 py-0.5 justify-start items-start inline-flex"
                    >
                      <div className="text-black text-xs sm:text-base font-normal font-['Inter'] leading-normal truncate">
                        {subItem}
                      </div>
                    </div>
                  ))}
              </React.Fragment>
            ))}
          </div>

          <div className="self-stretch mt-2 px-2 py-1 bg-primary-button rounded justify-center items-center gap-1 inline-flex cursor-pointer">
            <div className="text-tertiary-regular text-xs font-bold font-['Inter'] leading-tight">
              Sign out
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarMenu;

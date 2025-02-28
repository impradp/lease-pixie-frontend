import React, { useState } from "react";
import { MenuItem } from "@/types/menuItem";
import { ChevronDown, ChevronRight } from "lucide-react";
import PixieButton from "../buttons/PixieButton";

type SidebarMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      title: "List",
      isExpanded: false,
      subItems: ["Vendors"],
    },
    {
      title: "Add",
      isExpanded: false,
      subItems: ["User", "Property", "Portfolio"],
    },
    {
      title: "Settings",
      isExpanded: false,
      subItems: ["User", "Portfolio"],
    },
  ]);

  const toggleMenuItem = (index: number) => {
    const updatedMenuItems = menuItems.map((item, idx) => ({
      ...item,
      isExpanded: idx === index ? !item.isExpanded : false,
    }));
    setMenuItems(updatedMenuItems);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="sidebar-menu absolute top-full right-0 z-50 
          bg-menu-background backdrop-blur-[10px] border border-card-input-stroke
          shadow-[0_4px_8px_rgba(0,0,0,0.1)] rounded-[10px]
          w-[300px] p-5
          max-h-[calc(100vh-100%)] overflow-y-auto
          text-menu-text"
      >
        <dl className="m-0 p-0 flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <div key={item.title} className="flex flex-col">
              <dt
                className={`h-6 flex justify-between items-center cursor-pointer 
                  ${item.isExpanded ? "font-bold" : "font-normal"}`}
                onClick={() => toggleMenuItem(index)}
                style={{ fontFamily: "Inter", lineHeight: "normal" }}
              >
                <span className="text-black text-base truncate">
                  {item.title}
                </span>
                {item.isExpanded ? (
                  <ChevronDown
                    size={24}
                    className={`ml-2 transition-transform font-bold stroke-[2]`}
                    stroke="black"
                  />
                ) : (
                  <ChevronRight
                    size={24}
                    className={`ml-2 transition-transform stroke-[1.5]`}
                    stroke="black"
                  />
                )}
              </dt>
              {item.isExpanded && item.subItems && (
                <div className="flex flex-col mt-1">
                  {item.subItems.map((subItem) => (
                    <dd
                      key={subItem}
                      className="pl-5 pt-1 pb-1 cursor-pointer font-regular text-menu-text"
                    >
                      {subItem}
                    </dd>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-4 flex flex-col">
            <PixieButton label={"Sign out"} disabled={false} />
          </div>
        </dl>
      </div>
    </>
  );
};

export default SidebarMenu;

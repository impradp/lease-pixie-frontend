"use client";

import { useRouter } from "next/navigation";
import React, { useState, useContext } from "react";
import { ChevronRight } from "lucide-react";
import { MenuItem } from "@/types/menuItem";
import handleInfo from "@/lib/utils/errorHandler";
import PixieButton from "@/components/ui/buttons/PixieButton";
import { LoadingContext } from "@/components/ClientLoadingWrapper";

type SidebarMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { isLoading, setLoading } = useContext(LoadingContext);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { title: "List", isExpanded: false, subItems: ["Vendors"] },
    {
      title: "Add",
      isExpanded: false,
      subItems: ["User", "Property", "Portfolio"],
    },
    { title: "Settings", isExpanded: false, subItems: ["User", "Portfolio"] },
  ]);

  const toggleMenuItem = (index: number) => {
    const updatedMenuItems = menuItems.map((item, idx) => ({
      ...item,
      isExpanded: idx === index ? !item.isExpanded : false,
    }));
    setMenuItems(updatedMenuItems);
  };

  const handleNavigation = (url: string) => {
    setLoading(true);
    onClose();
    setTimeout(() => {
      router.push(url);
    }, 300); // Match ClientLoadingWrapper delay
  };

  const handleSubItemClick = (subItem: string) => {
    if (subItem === "Portfolio") {
      handleNavigation("/portfolio");
    } else if (subItem === "Vendors") {
      handleNavigation("/vendors");
    } else if (subItem === "Property") {
      handleNavigation("/property");
    }
  };

  const handleSignOut = async () => {
    try {
      handleNavigation("/logout?msg=100303");
    } catch (err) {
      handleInfo({ code: 100302, error: err });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="sidebar-menu absolute top-full left-0 z-50 
          bg-white/70 border border-card-input-stroke
          shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] rounded-[10px]
          w-[300px] p-5
          max-h-[calc(100vh-100%)] overflow-y-auto
          text-menu-text"
        style={{ backdropFilter: "blur(4px)" }}
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
                <ChevronRight
                  className={`w-4 h-4 text-tertiary-slateMist transition-transform duration-300 ${
                    item.isExpanded ? "rotate-90" : ""
                  }`}
                />
              </dt>
              {item.isExpanded && item.subItems && (
                <div className="flex flex-col mt-1">
                  {item.subItems.map((subItem) => (
                    <dd
                      key={subItem}
                      className="pl-5 pt-1 pb-1 cursor-pointer font-regular text-menu-text hover:text-blue-600"
                      onClick={() => handleSubItemClick(subItem)}
                    >
                      {subItem}
                    </dd>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="mt-4 flex flex-col">
            <PixieButton
              label="Sign out"
              onClick={handleSignOut}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        </dl>
      </div>
    </>
  );
};

export default SidebarMenu;

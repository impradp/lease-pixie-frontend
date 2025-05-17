"use client";

import { useRouter } from "next/navigation";
import React, { useState, useContext, useEffect, useRef } from "react";

import { ChevronRight } from "lucide-react";
import { hasRole } from "@/lib/utils/authUtils";
import { MenuItemWrapper, MenuItem } from "@/types/menuItems";
import { LoadingContext } from "@/components/ClientLoadingWrapper";
import {
  accountMenu,
  adminMenu,
  defaultMenu,
  readOnlyAdminMenu,
} from "@/data/menuRouteMapping";

/**
 * @typedef {Object} SidebarMenuProps
 * @property {boolean} isOpen - Determines whether the sidebar menu is visible.
 * @property {() => void} onClose - Callback function to close the sidebar menu.
 */
interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * @function SidebarMenu
 * @param {SidebarMenuProps} props - The component props.
 * @returns {JSX.Element | null} The rendered sidebar menu or null if not open.
 * @description Renders a sidebar menu with dynamic items based on the user's role.
 * Supports expandable menu items and navigation with a loading state.
 */
const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const { setLoading } = useContext(LoadingContext);

  // Track current roles for comparison
  const [currentRoles, setCurrentRoles] = useState<string[]>([]);

  // Dynamically load menu items based on role
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [menuWrapper, setMenuWrapper] = useState<MenuItemWrapper>();

  /**
   * @function checkRolesAndUpdateMenu
   * @description Checks the current user's roles and updates the menu accordingly
   */
  const checkRolesAndUpdateMenu = () => {
    // Determine the user's current roles
    const isAdmin = hasRole("AdminUser");
    const isAccount = hasRole("AccountUser");
    const isReadOnlyAdmin = hasRole("ReadOnlyAdminUser");

    // Create a string representation of current roles for comparison
    const newRoles = [
      isAdmin ? "AdminUser" : "",
      isAccount ? "AccountUser" : "",
      isReadOnlyAdmin ? "ReadOnlyAdminUser" : "",
    ].filter(Boolean);

    // Check if roles have changed
    const rolesChanged =
      currentRoles.length !== newRoles.length ||
      !currentRoles.every((role) => newRoles.includes(role));

    // Update current roles
    if (rolesChanged) {
      setCurrentRoles(newRoles);

      // Update menu based on roles
      if (isAdmin) {
        setMenuWrapper(adminMenu);
        setMenuItems([...adminMenu.menu]);
      } else if (isAccount) {
        setMenuWrapper(accountMenu);
        setMenuItems([...accountMenu.menu]);
      } else if (isReadOnlyAdmin) {
        setMenuWrapper(readOnlyAdminMenu);
        setMenuItems([...readOnlyAdminMenu.menu]);
      } else {
        setMenuWrapper(defaultMenu);
        setMenuItems([...defaultMenu.menu]);
      }
    }
  };

  // Load menu items on mount and whenever the menu is opened
  useEffect(() => {
    if (isOpen) {
      checkRolesAndUpdateMenu();
    }
  }, [isOpen]);

  /**
   * @function toggleMenuItem
   * @param {number} index - The index of the menu item to toggle.
   * @description Toggles the expanded state of a menu item, collapsing others.
   */
  const toggleMenuItem = (index: number) => {
    const updatedMenuItems = menuItems.map((item, idx) => ({
      ...item,
      isExpanded: idx === index ? !item.isExpanded : false,
    }));
    setMenuItems(updatedMenuItems);
  };

  /**
   * @function handleNavigation
   * @param {string} url - The URL to navigate to.
   * @description Handles navigation to a specified URL with a loading state and closes the menu.
   */
  const handleNavigation = (url: string) => {
    setLoading(true);
    onClose();
    setTimeout(() => {
      router.push(url);
    }, 300);
  };

  /**
   * @function handleSubItemClick
   * @param {string} subItem - The sub-menu item clicked.
   * @param {number} index - The index of the parent menu item.
   * @param {number} subIndex - The index of the sub-menu item.
   * @description Handles clicks on sub-menu items by navigating to the corresponding route.
   */
  const handleSubItemClick = (
    subItem: string,
    index: number,
    subIndex: number
  ) => {
    const route = menuItems[index]?.routes[subIndex];
    if (route) {
      handleNavigation(route);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="sidebar-menu absolute top-full left-0 z-50 
        px-6 pt-4 pb-5 bg-tertiary-periWinkleBlue rounded-xl
        shadow-[0px_4px_4px_-1px_rgba(12,12,13,0.05),0px_4px_4px_-1px_rgba(12,12,13,0.10)]
        inline-flex justify-start items-start gap-1"
      style={{ minWidth: "156px" }}
    >
      <div className="w-[156px] inline-flex flex-col justify-start items-start gap-6">
        <div className="self-stretch flex flex-col justify-start items-start gap-3">
          <div className="self-stretch pr-6 inline-flex justify-start items-start">
            <button
              className="text-tertiary-midnightBlue text-base font-normal  hover:text-blue-600"
              style={{ fontFamily: "Inter", lineHeight: "normal" }}
              onClick={() => handleNavigation(menuWrapper?.defaultRoute || "")}
            >
              {menuWrapper?.userType}
            </button>
          </div>
          <div className="self-stretch h-px bg-tertiary-duskyBlue" />
          {menuItems.map((item, index) => (
            <div key={item.title} className="flex flex-col gap-3">
              <button
                className="w-[155px] inline-flex justify-between items-start"
                onClick={() => toggleMenuItem(index)}
                aria-expanded={item.isExpanded}
                aria-controls={`submenu-${index}`}
              >
                <span
                  className={`text-tertiary-midnightBlue text-base font-bold`}
                  style={{ fontFamily: "Inter", lineHeight: "normal" }}
                >
                  {item.title}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-tertiary-midnightBlue transition-transform duration-300 ${
                    item.isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
              {item.isExpanded && item.subItems && (
                <div className="flex flex-col gap-3">
                  {item.subItems.map((subItem, subIndex) => (
                    <button
                      key={subItem}
                      className="self-stretch pr-6 inline-flex justify-start items-start cursor-pointer"
                      onClick={() =>
                        handleSubItemClick(subItem, index, subIndex)
                      }
                    >
                      <span
                        className="text-tertiary-midnightBlue text-base font-normal hover:text-blue-600 ml-2"
                        style={{ fontFamily: "Inter", lineHeight: "normal" }}
                      >
                        {subItem}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarMenu;

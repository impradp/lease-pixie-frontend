import { useRouter } from "next/navigation";
import React, { useState, useContext } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { MenuItem } from "@/types/menuItem";
import handleInfo from "@/lib/utils/errorHandler";
import { loginService } from "@/lib/services/login";
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

  const handleSubItemClick = (subItem: string) => {
    if (subItem === "Portfolio") {
      setLoading(true); // Set loading true before navigation
      router.push("/portfolio");
      onClose(); // Optional: close the sidebar after navigation
    }
    // Add more conditions here for other subItems if needed
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      setLoading(true);
      loginService.logout();
      router.push("/login?msg=100303");
      onClose();
    } catch (err) {
      handleInfo({
        code: 100302,
        error: err,
      });
    } finally {
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

import React, { useState } from "react";
import { MenuItem } from "@/types/menuItem";
import { ChevronDown, ChevronRight } from "lucide-react";
import PixieButton from "../buttons/PixieButton";
import { loginService } from "@/lib/services/login";
import { useRouter } from "next/navigation";
import Toastr from "@/components/ui/toastrPopup/Toastr";

type SidebarMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
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
  const [isLoading, setIsLoading] = useState(false);
  const [toastr, setToastr] = useState<{
    id: string;
    message: string;
    toastrType: "warning";
  } | null>(null);

  const toggleMenuItem = (index: number) => {
    const updatedMenuItems = menuItems.map((item, idx) => ({
      ...item,
      isExpanded: idx === index ? !item.isExpanded : false,
    }));
    setMenuItems(updatedMenuItems);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      loginService.logout();
      router.push("/login?loggedOut=true");
      onClose();
    } catch {
      //TODO: Use logger
      const toastrId = `toastr-${Date.now()}-${Math.random()}`;
      setToastr({
        id: toastrId,
        message: "Failed to sign out. Please try again.",
        toastrType: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToastrClose = () => {
    setToastr(null);
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
            <PixieButton
              label="Sign out"
              onClick={handleSignOut}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </div>
        </dl>
        {toastr && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
            <Toastr
              message={toastr.message}
              toastrType={toastr.toastrType}
              onClose={handleToastrClose}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarMenu;

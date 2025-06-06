import { MenuItemWrapper } from "@/types/menuItems";

export const adminMenu: MenuItemWrapper = {
  userType: "Admin",
  defaultRoute: "/dashboard",
  menu: [
    {
      title: "Lists",
      isExpanded: false,
      subItems: ["Archived Items", "System Table"],
      routes: ["/archived-items", "/settings/system-tables"],
    },
    {
      title: "Settings",
      isExpanded: false,
      subItems: ["User", "Sign-Out"],
      routes: ["/settings/user", "/logout?msg=100303"],
    },
  ],
};

export const readOnlyAdminMenu: MenuItemWrapper = {
  userType: "Admin",
  defaultRoute: "/dashboard",
  menu: [
    {
      title: "Lists",
      isExpanded: false,
      subItems: ["Archived Items"],
      routes: ["/archived-items"],
    },
    {
      title: "Settings",
      isExpanded: false,
      subItems: ["User", "Sign-Out"],
      routes: ["/settings/user", "/logout?msg=100303"],
    },
  ],
};

export const accountMenu: MenuItemWrapper = {
  userType: "Account",
  defaultRoute: "/account",
  menu: [
    {
      title: "Lists",
      isExpanded: false,
      subItems: ["Archived Items", "Vendors"],
      routes: ["/archived-items", "/vendors"],
    },
    {
      title: "Settings",
      isExpanded: false,
      subItems: ["User", "Sign-Out"],
      routes: ["/settings/user", "/logout?msg=100303"],
    },
  ],
};

export const defaultMenu: MenuItemWrapper = {
  userType: "User",
  defaultRoute: "/portfolio",
  menu: [
    {
      title: "Settings",
      isExpanded: false,
      subItems: ["Sign-Out"],
      routes: ["/logout?msg=100303"],
    },
  ],
};

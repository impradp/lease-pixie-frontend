export type MenuItem = {
  title: string;
  isExpanded: boolean;
  subItems: string[];
  routes: string[];
};

export type MenuItemWrapper = {
  userType: string;
  defaultRoute: string;
  menu: MenuItem[];
};

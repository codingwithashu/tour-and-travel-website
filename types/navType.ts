import { Icon, IconProps } from "@tabler/icons-react";
import { RefAttributes } from "react";

export type SidebarMenuLink = {
    title: string;
    url: string;
    icon?: React.ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
    isActive?: boolean;
};

export type SidebarMenuGroup = {
    title: string;
    url?: string;
    items: SidebarMenuLink[];
};

export type SidebarNavigationItems = {
    navMain: SidebarMenuGroup[];
    navSecondary?: SidebarMenuLink[];
};
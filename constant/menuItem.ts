import { SidebarNavigationItems } from "@/types/navType";
import {
    IconLayoutDashboard,
    IconPackage,
    IconTrendingUp,
    IconTrendingDown,
    IconUsers,
    IconChartBar,
    IconSettings,
    IconRulerMeasure,
    IconFolders,
    IconHomeStats,
    IconBookOff,
    IconMapPin,
    IconBookmarkAi,
} from "@tabler/icons-react";


export const navItems: SidebarNavigationItems = {
    navMain: [
        {
            title: "Overview",
            url: "/dashboard",
            items: [
                {
                    title: "Dashboard",
                    url: "/admin/dashboard",
                    icon: IconLayoutDashboard,
                },
            ],
        },
        {
            title: "Management",
            url: "#",
            items: [
                {
                    title: "Categories",
                    url: "/admin/categories",
                    icon: IconFolders,
                },
                {
                    title: "Destinations",
                    url: "/admin/destinations",
                    icon: IconMapPin,
                },
                {
                    title: "Packages",
                    url: "/admin/packages",
                    icon: IconPackage,
                },
                {
                    title: "Bookings",
                    url: "/admin/bookings",
                    icon: IconBookmarkAi,
                },
            ],
        },
        {
            title: "Analytics",
            url: "#",
            items: [
                {
                    title: "Reports",
                    url: "/reports",
                    icon: IconChartBar,
                },
            ],
        },
        {
            title: "Preferences",
            url: "#",
            items: [
                {
                    title: "Settings",
                    url: "/settings",
                    icon: IconSettings,
                },
            ],
        },
    ],
};
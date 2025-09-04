"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import { SidebarMenuGroup } from "@/types/navType";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavMainProps = {
  items: SidebarMenuGroup[];
};
export function NavMain({ items }: NavMainProps) {
  const pathname = usePathname();

  
  return (
    <SidebarGroup>
      {items.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel className="text-sidebar-foreground text-sm">
            {group.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {group.items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.url}>
                        {item.icon && <item.icon className="mr-2 size-4" />}
                        {item.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarGroup>
  );
}

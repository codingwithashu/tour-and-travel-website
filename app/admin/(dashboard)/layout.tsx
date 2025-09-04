"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar collapsible="icon" />
      <SidebarInset className="pb-5">
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

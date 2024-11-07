"use client";

import { Home } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Menu items.
const items = [
  {
    title: "Tasks",
    url: "#",
    icon: Home,
  },
];

export function AppSidebar() {
  const { user } = useUser();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mt-4 p-2 rounded-lg hover:bg-accent cursor-pointer">
            <Avatar className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              {user?.imageUrl ? (
                <AvatarImage src={user.imageUrl} alt="User Avatar" />
              ) : (
                <AvatarFallback>UN</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.username}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
          {/* <UserButton /> */}
        </div>
      </Sidebar>
    </SidebarProvider>
  );
}

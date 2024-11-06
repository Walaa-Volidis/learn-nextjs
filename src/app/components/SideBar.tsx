"use client";
import React, { useState } from "react";
import { ListTodo, ChevronLeft, ChevronRight } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const Sidebar = ({ className = "" }) => {
  const { user } = useUser();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`relative flex flex-col h-screen bg-background border-r transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-60"
      } ${className}`}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 p-1.5 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90"
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      <div className="p-6">
        <h2
          className={`text-lg font-semibold truncate ${
            isCollapsed ? "text-center" : ""
          }`}
        >
          {isCollapsed ? "📝" : "todo list"}
        </h2>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          <SidebarItem
            icon={ListTodo}
            label="Tasks"
            isCollapsed={isCollapsed}
          />
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mt-4 p-2 rounded-lg hover:bg-accent cursor-pointer">
          {/* first solution */}
          <Avatar className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            {user?.imageUrl ? (
              <AvatarImage src={user.imageUrl} alt="User Avatar" />
            ) : (
              <AvatarFallback>UN</AvatarFallback>
            )}
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate">
                {user?.username}
              </span>
              <span className="text-xs text-muted-foreground truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          )}
          {/* second solution */}
          {/* <UserButton showName /> */}
        </div>
      </div>
    </div>
  );
};

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isCollapsed,
}) => {
  return (
    <div
      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent cursor-pointer"
      title={isCollapsed ? label : undefined}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {!isCollapsed && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}
    </div>
  );
};

export default Sidebar;

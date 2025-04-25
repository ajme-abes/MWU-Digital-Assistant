
import { NavLink } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../../lib/utils";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function HODSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "border-r bg-sidebar flex flex-col h-screen transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex justify-between items-center p-4 h-16 border-b">
        {!collapsed && (
          <div className="font-semibold">Computer Science</div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("ml-auto", collapsed && "mx-auto")}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          <NavItem
            to="/hod"
            icon={<LayoutDashboard size={20} />}
            title="Dashboard"
            collapsed={collapsed}
          />
          <NavItem
            to="/hod/Courses"
            icon={<BookOpen size={20} />}
            title="Manage Courses"
            collapsed={collapsed}
          />
          <NavItem
            to="/hod/resources"
            icon={<FileCheck size={20} />}
            title="Approve Resources"
            collapsed={collapsed}
          />
          <NavItem
            to="/hod/teachers"
            icon={<User size={20} />}
            title="View Teachers"
            collapsed={collapsed}
          />
          <NavItem
            to="/hod/enrollment"
            icon={<Users size={20} />}
            title="Enrollment"
            collapsed={collapsed}
          />
          <NavItem
            to="/hod/invitations"
            icon={<KeyRound size={20} />}
            title="Invitation Codes"
            collapsed={collapsed}
          />
          <NavItem
            to="/hod/analytics"
            icon={<BarChart3 size={20} />}
            title="Analytics"
            collapsed={collapsed}
          />
          <NavItem
            to="/hod/settings"
            icon={<Settings size={20} />}
            title="Settings"
            collapsed={collapsed}
          />
          <Separator className="my-2" />
          <NavItem
            to="/hod/logout"
            icon={<LogOut size={20} />}
            title="/hod/Logout"
            collapsed={collapsed}
            variant="destructive"
          />
        </nav>
      </ScrollArea>
    </div>
  );
}

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  collapsed: boolean;
  variant?: "default" | "destructive";
}

function NavItem({ to, icon, title, collapsed, variant = "default" }: NavItemProps) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          isActive
            ? variant === "destructive"
              ? "bg-destructive text-destructive-foreground"
              : "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            : variant === "destructive"
            ? "text-destructive hover:bg-destructive/10"
            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )
      }
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span className="truncate">{title}</span>}
    </NavLink>
  );
}

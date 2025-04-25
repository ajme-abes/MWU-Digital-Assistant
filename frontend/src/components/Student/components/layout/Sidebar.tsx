
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  LayoutDashboard,
  FileText,
  ChartBar,
  FileSearch,
  Bot,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/student",
    },
    {
      title: "My Courses",
      icon: BookOpen,
      path: "/student/courses",
    },
    {
      title: "Assignments",
      icon: FileText,
      path: "/student/assignments",
    },
    {
      title: "Grades",
      icon: ChartBar,
      path: "/student/grades",
    },
    {
      title: "Study Materials",
      icon: FileSearch,
      path: "/student/materials",
    },
    {
      title: "AI Assistant",
      icon: Bot,
      path: "student/ai",
    },
    {
      title: "Profile Settings",
      icon: Settings,
      path: "/student/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      <div className="flex h-14 items-center border-b px-3 py-2">
        {!collapsed && (
          <span className="font-semibold text-lg text-student-purple">
            StudentSpark
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed ? "mx-auto" : "")}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ScrollArea className="flex flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground font-medium",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </ScrollArea>
      <div className="mt-auto p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-sidebar-foreground justify-start px-3",
            collapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0 mr-2" />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}

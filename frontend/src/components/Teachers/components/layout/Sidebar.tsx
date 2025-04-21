
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils"
import { useSidebar } from "../../context/SidebarContext";
import { Button } from "../../components/ui/button";
import { 
  ChevronLeft,
  LayoutDashboard,
  BookOpen,
  Upload,
  FilePlus,
  FileCheck,
  BarChart3,
  UserRound,
  LogOut
} from "lucide-react";
import { motion } from "framer-motion";

const navItems = [
  { title: "Dashboard", icon: "layout-dashboard", path: "/" },
  { title: "My Courses", icon: "book-open", path: "/courses" },
  { title: "Upload Resources", icon: "upload", path: "/resources" },
  { title: "Create Assignments", icon: "file-plus", path: "/assignments" },
  { title: "Grade Submissions", icon: "file-check", path: "/grading" },
  { title: "Analytics", icon: "chart-bar", path: "/analytics" },
  { title: "Profile", icon: "user-round", path: "/profile" },
];

const iconMap: Record<string, React.ReactNode> = {
  'layout-dashboard': <LayoutDashboard className="w-5 h-5" />,
  'book-open': <BookOpen className="w-5 h-5" />,
  'upload': <Upload className="w-5 h-5" />,
  'file-plus': <FilePlus className="w-5 h-5" />,
  'file-check': <FileCheck className="w-5 h-5" />,
  'chart-bar': <BarChart3 className="w-5 h-5" />,
  'user-round': <UserRound className="w-5 h-5" />,
};

export function Sidebar() {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const location = useLocation();

  return (
    <aside
      className={cn(
        "h-screen fixed left-0 top-0 z-20 flex flex-col bg-sidebar shadow-md transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64",
        "md:translate-x-0"
      )}
      style={{
        transform: window.innerWidth < 768 && !isCollapsed ? "translateX(0)" : 
                  window.innerWidth < 768 && isCollapsed ? "translateX(-100%)" : undefined
      }}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b">
        {!isCollapsed && (
          <span className="font-semibold text-primary">CampusTeach</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={cn("ml-auto", isCollapsed && "mx-auto")}
        >
          <ChevronLeft
            className={cn(
              "h-5 w-5 transition-transform",
              isCollapsed && "rotate-180"
            )}
          />
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item, index) => (
            <motion.li 
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <Button
                variant={location.pathname === item.path ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  location.pathname === item.path && "bg-sidebar-accent text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2"
                )}
                asChild
              >
                <Link to={item.path}>
                  {iconMap[item.icon]}
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            </motion.li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20",
            isCollapsed && "justify-center px-2"
          )}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
}

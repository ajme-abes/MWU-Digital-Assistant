
import { TeacherNavbar } from "./TeacherNavbar";
import { TeacherSidebar } from "./TeacherSidebar";
import { useSidebar } from "../../context/SidebarContext";
import { cn } from "../../lib/utils"

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isCollapsed } = useSidebar();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <TeacherSidebar />
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-16" : "ml-64",
          "md:ml-0 md:pl-16 lg:pl-64"
        )}
        style={{
          // Override for mobile view
          marginLeft: window.innerWidth < 768 ? "0" : undefined
        }}
      >
        <TeacherNavbar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

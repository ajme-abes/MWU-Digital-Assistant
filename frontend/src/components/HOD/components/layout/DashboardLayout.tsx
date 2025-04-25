
import { HODNavbar } from "./HODNavbar";
import { HODSidebar } from "./HODSidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <HODSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HODNavbar />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

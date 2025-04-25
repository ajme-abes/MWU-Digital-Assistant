
import { Outlet } from "react-router-dom";
import { StudentNavbar } from "./StudentNavbar";
import { Sidebar } from "./Sidebar";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <StudentNavbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

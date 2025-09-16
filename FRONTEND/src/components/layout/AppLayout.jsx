import { Outlet } from "react-router-dom";
import SidebarButtons from "./SidebarButtons";
import SidebarMain from "./SidebarMain";

function AppLayout() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <SidebarButtons />
      <SidebarMain />
      <main className="flex-1 overflow-y-auto ">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;

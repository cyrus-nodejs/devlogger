import { Outlet} from 'react-router-dom';
import { useState } from "react";
import LeftSidebar from '../../../components/Sidebar/LeftSidebar';
import Offcanvas from '../../../components/Sidebar/Offcanvas';

const Layout = () => {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // For desktop collapse

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  return (
   <div className="flex h-screen overflow-hidden">
      {/* Sidebar (off-canvas on mobile) */}
      <LeftSidebar
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col">
        {/* Navbar only on small/medium */}
        <Offcanvas onMenuClick={toggleSidebar} />

        {/* Main content */}
    <Outlet />
      </div>
    </div>
  );
};

export default Layout;

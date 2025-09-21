import React, { useState } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pinnedSidebar, setPinnedSidebar] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const togglePinSidebar = () => {
    setPinnedSidebar(!pinnedSidebar);
    if (!pinnedSidebar) {
      setSidebarOpen(true);
    }
  };

  return (
    <div className="perplexity-layout">
      {/* Left Sidebar - Always positioned on the left like Perplexity */}
      <Sidebar
        isOpen={sidebarOpen || pinnedSidebar}
        isPinned={pinnedSidebar}
        onClose={() => setSidebarOpen(false)}
        onTogglePin={togglePinSidebar}
      />

      {/* Main Content Area */}
      <div className={`main-content-area ${(sidebarOpen || pinnedSidebar) ? 'with-sidebar' : ''}`}>
        {/* Sidebar Toggle Button - positioned like Perplexity */}
        {!sidebarOpen && !pinnedSidebar && (
          <button
            onClick={toggleSidebar}
            className="perplexity-sidebar-toggle"
            title="Open sidebar"
          >
            <Bars3Icon className="icon" />
          </button>
        )}

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
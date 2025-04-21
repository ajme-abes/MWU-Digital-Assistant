import React, { createContext, useContext, useState } from 'react';
import { useIsMobile } from '../hooks/use-mobile';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;
  expandSidebar: () => void;
  isMobile: boolean;
  state: 'expanded' | 'collapsed';
  openMobile: boolean;
  setOpenMobile: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const isMobile = useIsMobile();

  const toggleSidebar = () => setIsCollapsed(prev => !prev);
  const collapseSidebar = () => setIsCollapsed(true);
  const expandSidebar = () => setIsCollapsed(false);
  const state = isCollapsed ? 'collapsed' : 'expanded';

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      toggleSidebar, 
      collapseSidebar, 
      expandSidebar,
      isMobile,
      state,
      openMobile,
      setOpenMobile
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}

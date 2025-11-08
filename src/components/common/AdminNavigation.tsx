'use client';

import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface AdminNavigationProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const AdminNavigation = ({ isCollapsed = false, onToggleCollapse }: AdminNavigationProps) => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin-dashboard',
      icon: 'ChartBarIcon',
      description: 'System overview and analytics'
    },
    {
      name: 'Driver Management',
      href: '/driver-management',
      icon: 'UserGroupIcon',
      description: 'Manage drivers and assignments'
    },
    {
      name: 'Schedule Management',
      href: '/schedule-management',
      icon: 'ClockIcon',
      description: 'Route schedules and timetables'
    }
  ];

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col lg:w-64 lg:bg-surface lg:border-r lg:border-border lg:shadow-elevation z-200 transition-all duration-300 ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="TruckIcon" size={20} className="text-primary-foreground" />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">EthioBus</span>
                <span className="text-xs text-text-secondary">Admin Portal</span>
              </div>
            )}
          </div>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded-md hover:bg-muted transition-colors duration-200"
            >
              <Icon 
                name={isCollapsed ? 'ChevronRightIcon' : 'ChevronLeftIcon'} 
                size={16} 
                className="text-text-secondary" 
              />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`nav-link group ${isActiveRoute(item.href) ? 'nav-link-active' : ''}`}
            >
              <Icon 
                name={item.icon as any} 
                size={20} 
                className={`flex-shrink-0 ${isActiveRoute(item.href) ? 'text-primary-foreground' : 'text-text-secondary group-hover:text-foreground'}`} 
              />
              {!isCollapsed && (
                <div className="ml-3 flex-1">
                  <span className="text-sm font-medium">{item.name}</span>
                  <p className="text-xs text-current opacity-75 mt-0.5">{item.description}</p>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <Icon name="UserIcon" size={16} className="text-text-secondary" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Admin User</p>
                <p className="text-xs text-text-secondary truncate">Transport Authority</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-surface border-b border-border shadow-elevation z-300 sticky top-0">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="TruckIcon" size={20} className="text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground">EthioBus</span>
              <span className="text-xs text-text-secondary">Admin Portal</span>
            </div>
          </div>
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name="Bars3Icon" size={24} className="text-text-secondary" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="border-t border-border bg-surface">
            <nav className="px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`nav-link ${isActiveRoute(item.href) ? 'nav-link-active' : ''}`}
                >
                  <Icon 
                    name={item.icon as any} 
                    size={20} 
                    className={`flex-shrink-0 ${isActiveRoute(item.href) ? 'text-primary-foreground' : 'text-text-secondary'}`} 
                  />
                  <div className="ml-3 flex-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <p className="text-xs text-current opacity-75 mt-0.5">{item.description}</p>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
};

export default AdminNavigation;
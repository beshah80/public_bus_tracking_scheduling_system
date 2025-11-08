'use client';

import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';

interface PassengerNavigationProps {
  onSearch?: (query: string) => void;
}

const PassengerNavigation = ({ onSearch }: PassengerNavigationProps) => {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      name: 'Route Search',
      href: '/passenger-portal',
      icon: 'MagnifyingGlassIcon',
      description: 'Find bus routes and schedules'
    },
    {
      name: 'Live Tracking',
      href: '/passenger-portal#tracking',
      icon: 'MapIcon',
      description: 'Track buses in real-time'
    },
    {
      name: 'Schedules',
      href: '/passenger-portal#schedules',
      icon: 'ClockIcon',
      description: 'View timetables'
    },
    {
      name: 'Feedback',
      href: '/passenger-portal#feedback',
      icon: 'ChatBubbleLeftRightIcon',
      description: 'Share your experience'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActiveRoute = (href: string) => {
    if (href.includes('#')) {
      return pathname === href.split('#')[0];
    }
    return pathname === href;
  };

  return (
    <>
      {/* Main Header */}
      <header className="bg-surface border-b border-border shadow-elevation sticky top-0 z-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="TruckIcon" size={24} className="text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">EthioBus</h1>
                <p className="text-xs text-text-secondary">Public Transport Tracker</p>
              </div>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search routes, stops, or destinations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input pl-10 pr-4 w-full"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon name="MagnifyingGlassIcon" size={16} className="text-text-secondary" />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <Icon name="XMarkIcon" size={16} className="text-text-secondary hover:text-foreground" />
                  </button>
                )}
              </form>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.slice(1).map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`nav-link ${isActiveRoute(item.href) ? 'nav-link-active' : ''}`}
                >
                  <Icon 
                    name={item.icon as any} 
                    size={18} 
                    className={`${isActiveRoute(item.href) ? 'text-primary-foreground' : 'text-text-secondary'}`} 
                  />
                  <span className="ml-2 text-sm font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors duration-200"
            >
              <Icon name="Bars3Icon" size={24} className="text-text-secondary" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search routes or destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4 w-full"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="MagnifyingGlassIcon" size={16} className="text-text-secondary" />
              </div>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <Icon name="XMarkIcon" size={16} className="text-text-secondary hover:text-foreground" />
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-surface">
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

      {/* Quick Access Bar */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Icon name="ClockIcon" size={16} className="text-success" />
                <span className="text-sm text-foreground">Live Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MapPinIcon" size={16} className="text-primary" />
                <span className="text-sm text-foreground">Real-time Tracking</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <Icon name="InformationCircleIcon" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-secondary">Service Status: Normal</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PassengerNavigation;
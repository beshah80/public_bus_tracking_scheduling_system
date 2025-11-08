'use client';

import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import React, { useState } from 'react';

interface DriverInterfaceProps {
  driverName?: string;
  busNumber?: string;
  routeName?: string;
}

const DriverInterface = ({ 
  driverName = "Driver", 
  busNumber = "ET-001", 
  routeName = "Route 1" 
}: DriverInterfaceProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const quickActions = [
    {
      name: 'Report Incident',
      icon: 'ExclamationTriangleIcon',
      color: 'bg-warning',
      textColor: 'text-warning-foreground',
      action: () => console.log('Report incident')
    },
    {
      name: 'Update Location',
      icon: 'MapPinIcon',
      color: 'bg-primary',
      textColor: 'text-primary-foreground',
      action: () => console.log('Update location')
    },
    {
      name: 'Emergency',
      icon: 'PhoneIcon',
      color: 'bg-error',
      textColor: 'text-error-foreground',
      action: () => console.log('Emergency call')
    },
    {
      name: 'Break Time',
      icon: 'PauseIcon',
      color: 'bg-secondary',
      textColor: 'text-secondary-foreground',
      action: () => console.log('Break time')
    }
  ];

  const scheduleItems = [
    { time: '08:00', location: 'Central Station', status: 'completed' },
    { time: '08:30', location: 'Market Square', status: 'completed' },
    { time: '09:00', location: 'University Campus', status: 'current' },
    { time: '09:30', location: 'Hospital Junction', status: 'upcoming' },
    { time: '10:00', location: 'Airport Terminal', status: 'upcoming' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="bg-primary text-primary-foreground shadow-elevation sticky top-0 z-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Icon name="TruckIcon" size={24} className="text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">EthioBus Driver</h1>
                <p className="text-sm opacity-90">Welcome, {driverName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-mono">{currentTime.toLocaleTimeString()}</p>
              <p className="text-xs opacity-90">{currentTime.toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6">
        {/* Current Assignment Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Current Assignment</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm text-success font-medium">Active</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-secondary">Bus Number</p>
              <p className="text-xl font-mono font-semibold text-foreground">{busNumber}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary">Route</p>
              <p className="text-lg font-medium text-foreground">{routeName}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.name}
                onClick={action.action}
                className={`${action.color} ${action.textColor} p-4 rounded-lg flex flex-col items-center space-y-2 transition-transform duration-200 hover:scale-105 active:scale-95`}
              >
                <Icon name={action.icon as any} size={24} />
                <span className="text-sm font-medium text-center">{action.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {scheduleItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center space-x-4 p-3 rounded-lg transition-colors duration-200 ${
                  item.status === 'current' ?'bg-primary/10 border border-primary/20' 
                    : item.status === 'completed' ?'bg-success/10 border border-success/20' :'bg-muted border border-border'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.status === 'current' ?'bg-primary text-primary-foreground' 
                      : item.status === 'completed' ?'bg-success text-success-foreground' :'bg-muted-foreground/20 text-text-secondary'
                  }`}>
                    {item.status === 'completed' ? (
                      <Icon name="CheckIcon" size={16} />
                    ) : item.status === 'current' ? (
                      <Icon name="MapPinIcon" size={16} />
                    ) : (
                      <Icon name="ClockIcon" size={16} />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{item.location}</p>
                    <p className="font-mono text-sm text-text-secondary">{item.time}</p>
                  </div>
                  <p className={`text-xs capitalize ${
                    item.status === 'current' ?'text-primary font-medium' 
                      : item.status === 'completed' ?'text-success' :'text-text-secondary'
                  }`}>
                    {item.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation to Full Dashboard */}
        <div className="card p-6">
          <Link
            href="/driver-dashboard"
            className="flex items-center justify-between p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200"
          >
            <div className="flex items-center space-x-3">
              <Icon name="ChartBarIcon" size={20} className="text-text-secondary" />
              <span className="font-medium text-foreground">View Full Dashboard</span>
            </div>
            <Icon name="ChevronRightIcon" size={20} className="text-text-secondary" />
          </Link>
        </div>
      </main>
    </div>
  );
};

export default DriverInterface;
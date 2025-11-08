'use client';

import Icon from '@/components/ui/AppIcon';
import { useEffect, useState } from 'react';

interface SystemStatusProps {
  lastUpdated?: string;
}

const SystemStatus = ({ lastUpdated }: SystemStatusProps) => {
  const [currentTime, setCurrentTime] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const systemServices = [
    { name: 'Bus Tracking Service', status: 'operational', uptime: '99.9%' },
    { name: 'Driver Communication', status: 'operational', uptime: '99.8%' },
    { name: 'Schedule Management', status: 'operational', uptime: '100%' },
    { name: 'Passenger Portal', status: 'maintenance', uptime: '98.5%' },
    { name: 'Incident Reporting', status: 'operational', uptime: '99.7%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-success';
      case 'maintenance':
        return 'text-warning';
      case 'down':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return 'CheckCircleIcon';
      case 'maintenance':
        return 'WrenchScrewdriverIcon';
      case 'down':
        return 'XCircleIcon';
      default:
        return 'QuestionMarkCircleIcon';
    }
  };

  if (!isHydrated) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">System Status</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary">All Systems Operational</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {systemServices.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
              <div className="flex items-center space-x-3">
                <Icon 
                  name={getStatusIcon(service.status) as any} 
                  size={16} 
                  className={getStatusColor(service.status)} 
                />
                <span className="text-sm font-medium text-foreground">{service.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-text-secondary">{service.uptime}</span>
                <span className={`text-xs font-medium capitalize ${getStatusColor(service.status)}`}>
                  {service.status}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Last Updated:</span>
            <span className="font-mono text-foreground">{currentTime}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span className="text-text-secondary">Data Refresh:</span>
            <span className="text-foreground">Every 30 seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
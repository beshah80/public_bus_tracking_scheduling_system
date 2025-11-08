'use client';

import { useEffect, useState } from 'react';
import IncidentReportsTable from './IncidentReportsTable';
import MetricsCard from './MetricsCard';
import QuickActions from './QuickActions';
import ScheduleOverview from './ScheduleOverview';
import SystemStatus from './SystemStatus';

interface AdminDashboardInteractiveProps {}

const AdminDashboardInteractive = ({}: AdminDashboardInteractiveProps) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Mock data for metrics
  const metricsData = [
    {
      title: 'Total Buses',
      value: 156,
      icon: 'TruckIcon',
      status: 'normal' as const,
      trend: { value: 2.5, isPositive: true }
    },
    {
      title: 'Active Buses',
      value: 142,
      icon: 'PlayIcon',
      status: 'normal' as const,
      trend: { value: 1.2, isPositive: true }
    },
    {
      title: 'Unreported Buses',
      value: 8,
      icon: 'ExclamationTriangleIcon',
      status: 'warning' as const,
      trend: { value: 0.8, isPositive: false }
    },
    {
      title: 'Delayed Buses',
      value: 6,
      icon: 'ClockIcon',
      status: 'error' as const,
      trend: { value: 1.5, isPositive: false }
    }
  ];

  // Mock data for incident reports
  const incidentReports = [
    {
      id: '1',
      busNumber: 'ET-001',
      route: 'Route 1 - Central to Airport',
      incidentType: 'Traffic Delay',
      timestamp: '08:45 AM',
      status: 'investigating' as const,
      severity: 'medium' as const
    },
    {
      id: '2',
      busNumber: 'ET-045',
      route: 'Route 3 - University Campus',
      incidentType: 'Mechanical Issue',
      timestamp: '08:30 AM',
      status: 'pending' as const,
      severity: 'high' as const
    },
    {
      id: '3',
      busNumber: 'ET-023',
      route: 'Route 2 - Market Square',
      incidentType: 'Road Blockage',
      timestamp: '08:15 AM',
      status: 'resolved' as const,
      severity: 'low' as const
    },
    {
      id: '4',
      busNumber: 'ET-067',
      route: 'Route 4 - Industrial Zone',
      incidentType: 'Passenger Complaint',
      timestamp: '08:00 AM',
      status: 'resolved' as const,
      severity: 'low' as const
    },
    {
      id: '5',
      busNumber: 'ET-089',
      route: 'Route 5 - Residential Area',
      incidentType: 'Schedule Deviation',
      timestamp: '07:45 AM',
      status: 'investigating' as const,
      severity: 'medium' as const
    }
  ];

  // Mock data for route performances
  const routePerformances = [
    {
      routeName: 'Route 1 - Central to Airport',
      totalBuses: 25,
      onTime: 22,
      delayed: 3,
      averageDelay: 8,
      status: 'good' as const
    },
    {
      routeName: 'Route 2 - Market Square Loop',
      totalBuses: 18,
      onTime: 17,
      delayed: 1,
      averageDelay: 3,
      status: 'excellent' as const
    },
    {
      routeName: 'Route 3 - University Campus',
      totalBuses: 22,
      onTime: 19,
      delayed: 3,
      averageDelay: 12,
      status: 'good' as const
    },
    {
      routeName: 'Route 4 - Industrial Zone',
      totalBuses: 15,
      onTime: 10,
      delayed: 5,
      averageDelay: 18,
      status: 'poor' as const
    },
    {
      routeName: 'Route 5 - Residential Area',
      totalBuses: 20,
      onTime: 18,
      delayed: 2,
      averageDelay: 5,
      status: 'excellent' as const
    }
  ];

  // Mock data for quick actions
  const quickActions = [
    {
      title: 'Bus Management',
      description: 'Add, edit, or remove buses from the fleet. Manage bus assignments and maintenance schedules.',
      href: '/driver-management',
      icon: 'TruckIcon',
      color: 'bg-primary',
      count: 156
    },
    {
      title: 'Schedule Management',
      description: 'Create and modify route schedules. Manage timetables and prevent scheduling conflicts.',
      href: '/schedule-management',
      icon: 'CalendarIcon',
      color: 'bg-secondary',
      count: 45
    },
    {
      title: 'Driver Management',
      description: 'Manage driver profiles, assignments, and performance tracking. Handle driver communications.',
      href: '/driver-management',
      icon: 'UserGroupIcon',
      color: 'bg-accent',
      count: 89
    },
    {
      title: 'Incident Monitoring',
      description: 'View and respond to real-time incident reports from drivers and passengers.',
      href: '/admin-dashboard#incidents',
      icon: 'ExclamationTriangleIcon',
      color: 'bg-warning',
      count: 12
    },
    {
      title: 'Performance Reports',
      description: 'Generate detailed analytics and performance reports for transport operations.',
      href: '/admin-dashboard#reports',
      icon: 'ChartBarIcon',
      color: 'bg-success',
      count: 8
    },
    {
      title: 'Passenger Feedback',
      description: 'Review and respond to passenger feedback, complaints, and suggestions.',
      href: '/admin-dashboard#feedback',
      icon: 'ChatBubbleLeftRightIcon',
      color: 'bg-error',
      count: 23
    }
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-muted rounded-lg"></div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="p-6 space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-text-secondary mt-2">
              Monitor and manage EthioBus transport operations across the city
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-text-secondary">Last Updated</p>
              <p className="font-mono text-sm text-foreground">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </p>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metricsData.map((metric, index) => (
            <MetricsCard
              key={index}
              title={metric.title}
              value={metric.value}
              icon={metric.icon}
              status={metric.status}
              trend={metric.trend}
            />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Incident Reports */}
          <div className="lg:col-span-2 space-y-8">
            <IncidentReportsTable reports={incidentReports} />
            <ScheduleOverview routePerformances={routePerformances} />
          </div>

          {/* Right Column - Quick Actions & System Status */}
          <div className="space-y-8">
            <QuickActions actions={quickActions} />
            <SystemStatus />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardInteractive;
'use client';

import { useAuth } from '@/components/common/AuthenticationWrapper';
import { useEffect, useState } from 'react';
import AdminMessages from './AdminMessages';
import DriverStats from './DriverStats';
import QuickActions from './QuickActions';
import RouteProgressPanel from './RouteProgressPanel';
import ScheduleCard from './ScheduleCard';

interface Schedule {
  id: string;
  routeName: string;
  busNumber: string;
  startTime: string;
  endTime: string;
  currentStop: string;
  nextStop: string;
  totalStops: number;
  completedStops: number;
  status: 'on-time' | 'delayed' | 'early';
}

interface Stop {
  id: string;
  name: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'completed' | 'current' | 'upcoming';
  passengerLoad?: number;
  estimatedArrival?: string;
}

interface Message {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  isRead: boolean;
  sender: string;
}

interface DriverStatsData {
  tripsCompleted: number;
  onTimePercentage: number;
  totalDistance: number;
  averageRating: number;
  incidentsReported: number;
  hoursWorked: number;
}

const DriverDashboardInteractive = () => {
  const { user } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }));
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const mockSchedule: Schedule = {
    id: "1",
    routeName: "Route 1 - Central to Airport",
    busNumber: user?.busNumber || "ET-001",
    startTime: "06:00",
    endTime: "22:00",
    currentStop: "University Campus",
    nextStop: "Hospital Junction",
    totalStops: 12,
    completedStops: 6,
    status: "on-time"
  };

  const mockStops: Stop[] = [
    {
      id: "1",
      name: "Central Station",
      scheduledTime: "08:00",
      actualTime: "08:02",
      status: "completed",
      passengerLoad: 85
    },
    {
      id: "2", 
      name: "Market Square",
      scheduledTime: "08:15",
      actualTime: "08:17",
      status: "completed",
      passengerLoad: 92
    },
    {
      id: "3",
      name: "City Mall",
      scheduledTime: "08:30",
      actualTime: "08:31",
      status: "completed",
      passengerLoad: 78
    },
    {
      id: "4",
      name: "University Campus",
      scheduledTime: "08:45",
      status: "current",
      passengerLoad: 65
    },
    {
      id: "5",
      name: "Hospital Junction",
      scheduledTime: "09:00",
      status: "upcoming",
      estimatedArrival: "09:02"
    },
    {
      id: "6",
      name: "Business District",
      scheduledTime: "09:15",
      status: "upcoming",
      estimatedArrival: "09:17"
    },
    {
      id: "7",
      name: "Airport Terminal",
      scheduledTime: "09:30",
      status: "upcoming",
      estimatedArrival: "09:32"
    }
  ];

  const mockMessages: Message[] = [
    {
      id: "1",
      title: "Route Update - Construction Alert",
      content: "Due to ongoing construction on Bole Road, please use the alternative route via Mexico Square. Expected delay: 10-15 minutes. Update passengers accordingly.",
      priority: "high",
      timestamp: "08:30",
      isRead: false,
      sender: "Traffic Control"
    },
    {
      id: "2",
      title: "Weather Advisory",
      content: "Light rain expected between 10:00-12:00. Please drive carefully and maintain safe following distance. Reduce speed in residential areas.",
      priority: "medium",
      timestamp: "07:45",
      isRead: false,
      sender: "Operations Center"
    },
    {
      id: "3",
      title: "Passenger Feedback - Positive",
      content: "Excellent service on Route 1 yesterday. Passenger commended your punctuality and professional driving. Keep up the good work!",
      priority: "low",
      timestamp: "07:15",
      isRead: true,
      sender: "Customer Service"
    }
  ];

  const mockStats: DriverStatsData = {
    tripsCompleted: 4,
    onTimePercentage: 94,
    totalDistance: 156,
    averageRating: 4.7,
    incidentsReported: 0,
    hoursWorked: 6.5
  };

  const handleUpdateLocation = (stopId: string) => {
    console.log(`Location updated for stop: ${stopId}`);
    // In a real app, this would update the backend
  };

  const handleUpdatePassengerLoad = (stopId: string, load: number) => {
    console.log(`Passenger load updated for stop ${stopId}: ${load}%`);
    // In a real app, this would update the backend
  };

  const handleReportIncident = (type: string, description: string) => {
    console.log(`Incident reported - Type: ${type}, Description: ${description}`);
    // In a real app, this would send to backend
  };

  const handleEmergencyCall = () => {
    console.log('Emergency call initiated');
    // In a real app, this would initiate emergency protocol
  };

  const handleBreakRequest = () => {
    console.log('Break time requested');
    // In a real app, this would notify dispatch
  };

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, isRead: true } : msg
      )
    );
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 bg-primary-foreground rounded opacity-75"></div>
          </div>
          <p className="text-text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-elevation sticky top-0 z-200">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">Driver Dashboard</h1>
              <p className="text-sm opacity-90">Welcome back, {user?.name || 'Driver'}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-mono font-semibold">{currentTime}</p>
              <p className="text-xs opacity-90">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-6 max-w-7xl mx-auto">
        {/* Current Schedule */}
        <ScheduleCard schedule={mockSchedule} />

        {/* Performance Stats */}
        <DriverStats stats={mockStats} />

        {/* Quick Actions */}
        <QuickActions
          onReportIncident={handleReportIncident}
          onEmergencyCall={handleEmergencyCall}
          onBreakRequest={handleBreakRequest}
        />

        {/* Route Progress */}
        <RouteProgressPanel
          stops={mockStops}
          onUpdateLocation={handleUpdateLocation}
          onUpdatePassengerLoad={handleUpdatePassengerLoad}
        />

        {/* Admin Messages */}
        <AdminMessages
          messages={messages}
          onMarkAsRead={handleMarkAsRead}
        />
      </main>
    </div>
  );
};

export default DriverDashboardInteractive;
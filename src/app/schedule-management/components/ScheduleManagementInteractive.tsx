'use client';

import Icon from '@/components/ui/AppIcon';
import { useEffect, useState } from 'react';
import BulkScheduleModal from './BulkScheduleModal';
import ScheduleCalendar from './ScheduleCalendar';
import ScheduleModal from './ScheduleModal';
import ScheduleStats from './ScheduleStats';
import ScheduleTable from './ScheduleTable';

interface ScheduleEntry {
  id: string;
  routeName: string;
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
  driverName: string;
  status: 'scheduled' | 'active' | 'completed' | 'conflict';
  date: string;
  routeId: string;
  busId: string;
  driverId: string;
}

interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
}

interface Bus {
  id: string;
  number: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'inactive';
}

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  status: 'available' | 'assigned' | 'off-duty';
}

const ScheduleManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleEntry | null>(null);
  const [schedules, setSchedules] = useState<ScheduleEntry[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockSchedules: ScheduleEntry[] = [
      {
        id: '1',
        routeName: 'Route 1 - Central to Airport',
        busNumber: 'ET-001',
        departureTime: '08:00',
        arrivalTime: '09:30',
        driverName: 'Abebe Kebede',
        status: 'active',
        date: '2025-11-08',
        routeId: 'route1',
        busId: 'bus1',
        driverId: 'driver1'
      },
      {
        id: '2',
        routeName: 'Route 2 - Market to University',
        busNumber: 'ET-002',
        departureTime: '08:30',
        arrivalTime: '10:00',
        driverName: 'Tigist Haile',
        status: 'scheduled',
        date: '2025-11-08',
        routeId: 'route2',
        busId: 'bus2',
        driverId: 'driver2'
      },
      {
        id: '3',
        routeName: 'Route 1 - Central to Airport',
        busNumber: 'ET-003',
        departureTime: '09:00',
        arrivalTime: '10:30',
        driverName: 'Dawit Tadesse',
        status: 'conflict',
        date: '2025-11-08',
        routeId: 'route1',
        busId: 'bus3',
        driverId: 'driver3'
      },
      {
        id: '4',
        routeName: 'Route 3 - Stadium to Mall',
        busNumber: 'ET-004',
        departureTime: '07:30',
        arrivalTime: '08:45',
        driverName: 'Meron Assefa',
        status: 'completed',
        date: '2025-11-08',
        routeId: 'route3',
        busId: 'bus4',
        driverId: 'driver4'
      },
      {
        id: '5',
        routeName: 'Route 2 - Market to University',
        busNumber: 'ET-005',
        departureTime: '10:00',
        arrivalTime: '11:30',
        driverName: 'Yohannes Bekele',
        status: 'scheduled',
        date: '2025-11-08',
        routeId: 'route2',
        busId: 'bus5',
        driverId: 'driver5'
      }
    ];
    setSchedules(mockSchedules);
  };

  const mockRoutes: Route[] = [
    { id: 'route1', name: 'Route 1 - Central to Airport', startPoint: 'Central Station', endPoint: 'Bole Airport' },
    { id: 'route2', name: 'Route 2 - Market to University', startPoint: 'Merkato', endPoint: 'Addis Ababa University' },
    { id: 'route3', name: 'Route 3 - Stadium to Mall', startPoint: 'Addis Ababa Stadium', endPoint: 'Edna Mall' }
  ];

  const mockBuses: Bus[] = [
    { id: 'bus1', number: 'ET-001', capacity: 45, status: 'active' },
    { id: 'bus2', number: 'ET-002', capacity: 50, status: 'active' },
    { id: 'bus3', number: 'ET-003', capacity: 45, status: 'active' },
    { id: 'bus4', number: 'ET-004', capacity: 40, status: 'active' },
    { id: 'bus5', number: 'ET-005', capacity: 50, status: 'active' },
    { id: 'bus6', number: 'ET-006', capacity: 45, status: 'maintenance' }
  ];

  const mockDrivers: Driver[] = [
    { id: 'driver1', name: 'Abebe Kebede', licenseNumber: 'DL001234', status: 'assigned' },
    { id: 'driver2', name: 'Tigist Haile', licenseNumber: 'DL001235', status: 'available' },
    { id: 'driver3', name: 'Dawit Tadesse', licenseNumber: 'DL001236', status: 'available' },
    { id: 'driver4', name: 'Meron Assefa', licenseNumber: 'DL001237', status: 'available' },
    { id: 'driver5', name: 'Yohannes Bekele', licenseNumber: 'DL001238', status: 'available' },
    { id: 'driver6', name: 'Sara Wolde', licenseNumber: 'DL001239', status: 'off-duty' }
  ];

  const handleScheduleClick = (schedule: ScheduleEntry) => {
    setEditingSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleSave = (data: any) => {
    if (editingSchedule) {
      // Update existing schedule
      setSchedules(prev => prev.map(s => 
        s.id === editingSchedule.id 
          ? { ...s, ...data, id: editingSchedule.id }
          : s
      ));
    } else {
      // Create new schedule
      const newSchedule: ScheduleEntry = {
        id: `schedule_${Date.now()}`,
        routeName: mockRoutes.find(r => r.id === data.routeId)?.name || '',
        busNumber: mockBuses.find(b => b.id === data.busId)?.number || '',
        driverName: mockDrivers.find(d => d.id === data.driverId)?.name || '',
        status: 'scheduled',
        ...data
      };
      setSchedules(prev => [...prev, newSchedule]);
    }
    setEditingSchedule(null);
  };

  const handleScheduleEdit = (schedule: ScheduleEntry) => {
    setEditingSchedule(schedule);
    setIsScheduleModalOpen(true);
  };

  const handleScheduleDelete = (scheduleId: string) => {
    if (confirm('Are you sure you want to delete this schedule?')) {
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
    }
  };

  const handleStatusChange = (scheduleId: string, status: string) => {
    setSchedules(prev => prev.map(s => 
      s.id === scheduleId ? { ...s, status: status as any } : s
    ));
  };

  const handleBulkScheduleSave = (data: any) => {
    // In a real app, this would generate multiple schedules based on the bulk data
    console.log('Bulk schedule data:', data);
    // For demo purposes, we'll just close the modal
  };

  const handleExportSchedules = () => {
    // In a real app, this would generate and download a report
    console.log('Exporting schedules...');
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 bg-primary-foreground rounded opacity-75"></div>
          </div>
          <p className="text-text-secondary">Loading Schedule Management...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalSchedules: schedules.length,
    activeSchedules: schedules.filter(s => s.status === 'active').length,
    completedSchedules: schedules.filter(s => s.status === 'completed').length,
    conflictSchedules: schedules.filter(s => s.status === 'conflict').length
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Schedule Management</h1>
          <p className="text-text-secondary mt-1">Create and manage bus schedules with automated conflict detection</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors duration-200"
          >
            <Icon name="CalendarDaysIcon" size={16} />
            <span>Bulk Schedule</span>
          </button>
          
          <button
            onClick={() => setIsScheduleModalOpen(true)}
            className="btn-primary flex items-center justify-center space-x-2 px-4 py-2 rounded-md"
          >
            <Icon name="PlusIcon" size={16} />
            <span>New Schedule</span>
          </button>
          
          <button
            onClick={handleExportSchedules}
            className="flex items-center justify-center space-x-2 px-4 py-2 border border-border text-text-secondary hover:text-foreground hover:bg-muted rounded-md transition-colors duration-200"
          >
            <Icon name="ArrowDownTrayIcon" size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      <ScheduleStats {...stats} />

      {/* Schedule Calendar */}
      <ScheduleCalendar
        schedules={schedules}
        onScheduleClick={handleScheduleClick}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
      />

      {/* Schedule Table */}
      <ScheduleTable
        schedules={schedules}
        onEdit={handleScheduleEdit}
        onDelete={handleScheduleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setEditingSchedule(null);
        }}
        onSave={handleScheduleSave}
        editingSchedule={editingSchedule}
        routes={mockRoutes}
        buses={mockBuses}
        drivers={mockDrivers}
      />

      {/* Bulk Schedule Modal */}
      <BulkScheduleModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSave={handleBulkScheduleSave}
        routes={mockRoutes}
        buses={mockBuses}
        drivers={mockDrivers}
      />
    </div>
  );
};

export default ScheduleManagementInteractive;
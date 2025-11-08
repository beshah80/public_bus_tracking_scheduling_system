'use client';

import Icon from '@/components/ui/AppIcon';
import { useState } from 'react';

interface ScheduleEntry {
  id: string;
  routeName: string;
  busNumber: string;
  departureTime: string;
  arrivalTime: string;
  driverName: string;
  status: 'scheduled' | 'active' | 'completed' | 'conflict';
}

interface ScheduleCalendarProps {
  schedules: ScheduleEntry[];
  onScheduleClick: (schedule: ScheduleEntry) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const ScheduleCalendar = ({ schedules, onScheduleClick, selectedDate, onDateChange }: ScheduleCalendarProps) => {
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const timeSlots = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00'
  ];

  const getSchedulesForTimeSlot = (date: Date, time: string) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedules.filter(schedule => {
      const scheduleTime = schedule.departureTime.substring(0, 5);
      return scheduleTime === time;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'active': return 'bg-green-100 border-green-300 text-green-800';
      case 'completed': return 'bg-gray-100 border-gray-300 text-gray-600';
      case 'conflict': return 'bg-red-100 border-red-300 text-red-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const weekDays = getWeekDays(selectedDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction === 'next' ? 7 : -7));
    onDateChange(newDate);
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation">
      {/* Calendar Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-foreground">Schedule Calendar</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                  viewMode === 'week' ?'bg-primary text-primary-foreground' :'bg-muted text-text-secondary hover:bg-muted/80'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                  viewMode === 'day' ?'bg-primary text-primary-foreground' :'bg-muted text-text-secondary hover:bg-muted/80'
                }`}
              >
                Day
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
            >
              <Icon name="ChevronLeftIcon" size={20} className="text-text-secondary" />
            </button>
            <span className="text-sm font-medium text-foreground px-4">
              {selectedDate.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric',
                day: 'numeric'
              })}
            </span>
            <button
              onClick={() => navigateWeek('next')}
              className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
            >
              <Icon name="ChevronRightIcon" size={20} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div>
            <span className="text-text-secondary">Scheduled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
            <span className="text-text-secondary">Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
            <span className="text-text-secondary">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
            <span className="text-text-secondary">Conflict</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {viewMode === 'week' ? (
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Week Header */}
              <div className="grid grid-cols-8 gap-2 mb-4">
                <div className="text-sm font-medium text-text-secondary p-2">Time</div>
                {weekDays.map((day, index) => (
                  <div key={index} className="text-center p-2">
                    <div className="text-sm font-medium text-foreground">{dayNames[day.getDay()]}</div>
                    <div className="text-xs text-text-secondary">{day.getDate()}</div>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div className="space-y-1">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-2">
                    <div className="text-sm text-text-secondary p-2 font-mono">{time}</div>
                    {weekDays.map((day, dayIndex) => {
                      const daySchedules = getSchedulesForTimeSlot(day, time);
                      return (
                        <div key={dayIndex} className="min-h-[60px] p-1">
                          {daySchedules.map((schedule) => (
                            <button
                              key={schedule.id}
                              onClick={() => onScheduleClick(schedule)}
                              className={`w-full text-left p-2 rounded border text-xs mb-1 hover:shadow-md transition-all duration-200 ${getStatusColor(schedule.status)}`}
                            >
                              <div className="font-medium truncate">{schedule.routeName}</div>
                              <div className="truncate">{schedule.busNumber}</div>
                              <div className="truncate">{schedule.driverName}</div>
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Day View */
          <div className="space-y-2">
            {timeSlots.map((time) => {
              const daySchedules = getSchedulesForTimeSlot(selectedDate, time);
              return (
                <div key={time} className="flex items-start space-x-4 p-3 border border-border rounded-lg">
                  <div className="text-sm font-mono text-text-secondary w-16">{time}</div>
                  <div className="flex-1 space-y-2">
                    {daySchedules.length > 0 ? (
                      daySchedules.map((schedule) => (
                        <button
                          key={schedule.id}
                          onClick={() => onScheduleClick(schedule)}
                          className={`w-full text-left p-3 rounded border hover:shadow-md transition-all duration-200 ${getStatusColor(schedule.status)}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{schedule.routeName}</div>
                              <div className="text-sm">{schedule.busNumber} • {schedule.driverName}</div>
                            </div>
                            <div className="text-sm font-mono">
                              {schedule.departureTime} - {schedule.arrivalTime}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="text-sm text-text-secondary italic">No schedules</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCalendar;
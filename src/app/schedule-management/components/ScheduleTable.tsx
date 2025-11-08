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
  date: string;
}

interface ScheduleTableProps {
  schedules: ScheduleEntry[];
  onEdit: (schedule: ScheduleEntry) => void;
  onDelete: (scheduleId: string) => void;
  onStatusChange: (scheduleId: string, status: string) => void;
}

const ScheduleTable = ({ schedules, onEdit, onDelete, onStatusChange }: ScheduleTableProps) => {
  const [sortField, setSortField] = useState<keyof ScheduleEntry>('departureTime');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRoute, setFilterRoute] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: keyof ScheduleEntry) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredSchedules = schedules.filter(schedule => {
    const statusMatch = filterStatus === 'all' || schedule.status === filterStatus;
    const routeMatch = filterRoute === 'all' || schedule.routeName === filterRoute;
    return statusMatch && routeMatch;
  });

  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedSchedules.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedules = sortedSchedules.slice(startIndex, startIndex + itemsPerPage);

  const uniqueRoutes = [...new Set(schedules.map(s => s.routeName))];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      scheduled: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Scheduled' },
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Completed' },
      conflict: { bg: 'bg-red-100', text: 'text-red-800', label: 'Conflict' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.scheduled;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const SortIcon = ({ field }: { field: keyof ScheduleEntry }) => {
    if (sortField !== field) {
      return <Icon name="ChevronUpDownIcon" size={16} className="text-text-secondary" />;
    }
    return (
      <Icon 
        name={sortDirection === 'asc' ? 'ChevronUpIcon' : 'ChevronDownIcon'} 
        size={16} 
        className="text-primary" 
      />
    );
  };

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <h3 className="text-lg font-semibold text-foreground">Schedule Details</h3>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="conflict">Conflict</option>
            </select>
            
            <select
              value={filterRoute}
              onChange={(e) => setFilterRoute(e.target.value)}
              className="input w-full sm:w-auto"
            >
              <option value="all">All Routes</option>
              {uniqueRoutes.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('routeName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Route</span>
                  <SortIcon field="routeName" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('busNumber')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Bus Number</span>
                  <SortIcon field="busNumber" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('departureTime')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Departure</span>
                  <SortIcon field="departureTime" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('arrivalTime')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Arrival</span>
                  <SortIcon field="arrivalTime" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('driverName')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Driver</span>
                  <SortIcon field="driverName" />
                </button>
              </th>
              <th className="px-6 py-3 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 text-sm font-medium text-foreground hover:text-primary"
                >
                  <span>Status</span>
                  <SortIcon field="status" />
                </button>
              </th>
              <th className="px-6 py-3 text-right text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedSchedules.map((schedule) => (
              <tr key={schedule.id} className="hover:bg-muted/50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <div className="font-medium text-foreground">{schedule.routeName}</div>
                  <div className="text-sm text-text-secondary">{schedule.date}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-foreground">{schedule.busNumber}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-foreground">{schedule.departureTime}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-sm text-foreground">{schedule.arrivalTime}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-foreground">{schedule.driverName}</span>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(schedule.status)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(schedule)}
                      className="p-2 text-text-secondary hover:text-primary hover:bg-muted rounded-md transition-colors duration-200"
                    >
                      <Icon name="PencilIcon" size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(schedule.id)}
                      className="p-2 text-text-secondary hover:text-error hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      <Icon name="TrashIcon" size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden p-4 space-y-4">
        {paginatedSchedules.map((schedule) => (
          <div key={schedule.id} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground">{schedule.routeName}</h4>
                <p className="text-sm text-text-secondary">{schedule.date}</p>
              </div>
              {getStatusBadge(schedule.status)}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-text-secondary">Bus:</span>
                <span className="ml-2 font-mono text-foreground">{schedule.busNumber}</span>
              </div>
              <div>
                <span className="text-text-secondary">Driver:</span>
                <span className="ml-2 text-foreground">{schedule.driverName}</span>
              </div>
              <div>
                <span className="text-text-secondary">Departure:</span>
                <span className="ml-2 font-mono text-foreground">{schedule.departureTime}</span>
              </div>
              <div>
                <span className="text-text-secondary">Arrival:</span>
                <span className="ml-2 font-mono text-foreground">{schedule.arrivalTime}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-border">
              <button
                onClick={() => onEdit(schedule)}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
              >
                <Icon name="PencilIcon" size={16} />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(schedule.id)}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-error hover:bg-red-50 rounded-md transition-colors duration-200"
              >
                <Icon name="TrashIcon" size={16} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-text-secondary">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedSchedules.length)} of {sortedSchedules.length} schedules
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Icon name="ChevronLeftIcon" size={16} className="text-text-secondary" />
              </button>
              <span className="text-sm text-foreground px-3 py-1">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Icon name="ChevronRightIcon" size={16} className="text-text-secondary" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTable;
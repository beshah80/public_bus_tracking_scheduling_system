'use client';

import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { useState } from 'react';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  assignedBus: string | null;
  status: 'active' | 'inactive' | 'suspended';
  operator: string;
  licenseExpiry: string;
  joinDate: string;
  profileImage: string;
  alt: string;
}

interface DriverTableProps {
  drivers: Driver[];
  onEdit: (driver: Driver) => void;
  onViewHistory: (driverId: string) => void;
  onStatusChange: (driverId: string, status: string) => void;
  selectedDrivers: string[];
  onSelectionChange: (driverIds: string[]) => void;
}

const DriverTable = ({ 
  drivers, 
  onEdit, 
  onViewHistory, 
  onStatusChange, 
  selectedDrivers, 
  onSelectionChange 
}: DriverTableProps) => {
  const [sortField, setSortField] = useState<keyof Driver>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof Driver) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(drivers.map(driver => driver.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectDriver = (driverId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedDrivers, driverId]);
    } else {
      onSelectionChange(selectedDrivers.filter(id => id !== driverId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-muted-foreground text-white';
      case 'suspended':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const SortIcon = ({ field }: { field: keyof Driver }) => {
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
    <div className="bg-surface rounded-lg border border-border shadow-elevation overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedDrivers.length === drivers.length && drivers.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-border focus:ring-2 focus:ring-primary"
                />
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Driver</th>
              <th 
                className="px-6 py-4 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('licenseNumber')}
              >
                <div className="flex items-center space-x-2">
                  <span>License</span>
                  <SortIcon field="licenseNumber" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Contact</th>
              <th 
                className="px-6 py-4 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('assignedBus')}
              >
                <div className="flex items-center space-x-2">
                  <span>Assigned Bus</span>
                  <SortIcon field="assignedBus" />
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-sm font-medium text-foreground cursor-pointer hover:bg-muted/80"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-2">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedDrivers.map((driver) => (
              <tr key={driver.id} className="hover:bg-muted/50 transition-colors duration-200">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedDrivers.includes(driver.id)}
                    onChange={(e) => handleSelectDriver(driver.id, e.target.checked)}
                    className="rounded border-border focus:ring-2 focus:ring-primary"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      <AppImage
                        src={driver.profileImage}
                        alt={driver.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{driver.name}</p>
                      <p className="text-xs text-text-secondary">{driver.operator}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm font-mono text-foreground">{driver.licenseNumber}</p>
                    <p className="text-xs text-text-secondary">Expires: {driver.licenseExpiry}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="text-sm text-foreground">{driver.phone}</p>
                    <p className="text-xs text-text-secondary">{driver.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {driver.assignedBus ? (
                    <div>
                      <p className="text-sm font-medium text-foreground">{driver.assignedBus}</p>
                      <p className="text-xs text-text-secondary">Active Assignment</p>
                    </div>
                  ) : (
                    <span className="text-sm text-text-secondary">Unassigned</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                    {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(driver)}
                      className="p-1 rounded-md hover:bg-muted transition-colors duration-200"
                      title="Edit Driver"
                    >
                      <Icon name="PencilIcon" size={16} className="text-text-secondary hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => onViewHistory(driver.id)}
                      className="p-1 rounded-md hover:bg-muted transition-colors duration-200"
                      title="View History"
                    >
                      <Icon name="ClockIcon" size={16} className="text-text-secondary hover:text-foreground" />
                    </button>
                    <button
                      onClick={() => onStatusChange(driver.id, driver.status)}
                      className="p-1 rounded-md hover:bg-muted transition-colors duration-200"
                      title="Change Status"
                    >
                      <Icon name="EllipsisVerticalIcon" size={16} className="text-text-secondary hover:text-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {sortedDrivers.map((driver) => (
          <div key={driver.id} className="bg-surface border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={selectedDrivers.includes(driver.id)}
                  onChange={(e) => handleSelectDriver(driver.id, e.target.checked)}
                  className="rounded border-border focus:ring-2 focus:ring-primary mt-1"
                />
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <AppImage
                    src={driver.profileImage}
                    alt={driver.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">{driver.name}</h3>
                  <p className="text-xs text-text-secondary">{driver.operator}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                {driver.status.charAt(0).toUpperCase() + driver.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-text-secondary">License</p>
                <p className="font-mono text-foreground">{driver.licenseNumber}</p>
              </div>
              <div>
                <p className="text-text-secondary">Phone</p>
                <p className="text-foreground">{driver.phone}</p>
              </div>
              <div>
                <p className="text-text-secondary">Assigned Bus</p>
                <p className="text-foreground">{driver.assignedBus || 'Unassigned'}</p>
              </div>
              <div>
                <p className="text-text-secondary">License Expiry</p>
                <p className="text-foreground">{driver.licenseExpiry}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-xs text-text-secondary">Joined: {driver.joinDate}</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(driver)}
                  className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="PencilIcon" size={16} className="text-text-secondary" />
                </button>
                <button
                  onClick={() => onViewHistory(driver.id)}
                  className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="ClockIcon" size={16} className="text-text-secondary" />
                </button>
                <button
                  onClick={() => onStatusChange(driver.id, driver.status)}
                  className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
                >
                  <Icon name="EllipsisVerticalIcon" size={16} className="text-text-secondary" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverTable;
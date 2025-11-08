'use client';

import Icon from '@/components/ui/AppIcon';
import React, { useEffect, useState } from 'react';

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

interface ScheduleFormData {
  routeId: string;
  busId: string;
  driverId: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  recurring: boolean;
  recurringDays: string[];
}

interface ConflictWarning {
  type: 'bus' | 'driver' | 'route';
  message: string;
}

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ScheduleFormData) => void;
  editingSchedule?: any;
  routes: Route[];
  buses: Bus[];
  drivers: Driver[];
}

const ScheduleModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingSchedule, 
  routes, 
  buses, 
  drivers 
}: ScheduleModalProps) => {
  const [formData, setFormData] = useState<ScheduleFormData>({
    routeId: '',
    busId: '',
    driverId: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    recurring: false,
    recurringDays: []
  });

  const [conflicts, setConflicts] = useState<ConflictWarning[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const weekDays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    if (editingSchedule) {
      setFormData({
        routeId: editingSchedule.routeId || '',
        busId: editingSchedule.busId || '',
        driverId: editingSchedule.driverId || '',
        date: editingSchedule.date || '',
        departureTime: editingSchedule.departureTime || '',
        arrivalTime: editingSchedule.arrivalTime || '',
        recurring: editingSchedule.recurring || false,
        recurringDays: editingSchedule.recurringDays || []
      });
    } else {
      resetForm();
    }
  }, [editingSchedule, isOpen]);

  useEffect(() => {
    if (formData.busId || formData.driverId || formData.date || formData.departureTime) {
      validateSchedule();
    }
  }, [formData.busId, formData.driverId, formData.date, formData.departureTime, formData.arrivalTime]);

  const resetForm = () => {
    setFormData({
      routeId: '',
      busId: '',
      driverId: '',
      date: '',
      departureTime: '',
      arrivalTime: '',
      recurring: false,
      recurringDays: []
    });
    setConflicts([]);
  };

  const validateSchedule = async () => {
    setIsValidating(true);
    const newConflicts: ConflictWarning[] = [];

    // Simulate conflict detection
    await new Promise(resolve => setTimeout(resolve, 500));

    // Bus availability check
    if (formData.busId && formData.date && formData.departureTime) {
      const bus = buses.find(b => b.id === formData.busId);
      if (bus?.status !== 'active') {
        newConflicts.push({
          type: 'bus',
          message: `Bus ${bus?.number} is currently ${bus?.status}`
        });
      }
      
      // Simulate overlapping schedule check
      if (Math.random() > 0.8) {
        newConflicts.push({
          type: 'bus',
          message: `Bus ${bus?.number} has overlapping schedule at ${formData.departureTime}`
        });
      }
    }

    // Driver availability check
    if (formData.driverId && formData.date && formData.departureTime) {
      const driver = drivers.find(d => d.id === formData.driverId);
      if (driver?.status !== 'available') {
        newConflicts.push({
          type: 'driver',
          message: `Driver ${driver?.name} is currently ${driver?.status}`
        });
      }
      
      // Simulate driver schedule conflict
      if (Math.random() > 0.9) {
        newConflicts.push({
          type: 'driver',
          message: `Driver ${driver?.name} has another assignment at this time`
        });
      }
    }

    // Route capacity check
    if (formData.routeId && formData.departureTime) {
      if (Math.random() > 0.95) {
        newConflicts.push({
          type: 'route',
          message: 'Route has reached maximum capacity for this time slot'
        });
      }
    }

    setConflicts(newConflicts);
    setIsValidating(false);
  };

  const handleInputChange = (field: keyof ScheduleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRecurringDayToggle = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(dayId)
        ? prev.recurringDays.filter(d => d !== dayId)
        : [...prev.recurringDays, dayId]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflicts.length === 0) {
      onSave(formData);
      onClose();
      resetForm();
    }
  };

  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'bus': return 'TruckIcon';
      case 'driver': return 'UserIcon';
      case 'route': return 'MapIcon';
      default: return 'ExclamationTriangleIcon';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
      <div className="bg-surface rounded-lg shadow-elevation-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingSchedule ? 'Edit Schedule' : 'Create New Schedule'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-200"
          >
            <Icon name="XMarkIcon" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Route Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Route <span className="text-error">*</span>
            </label>
            <select
              value={formData.routeId}
              onChange={(e) => handleInputChange('routeId', e.target.value)}
              className="input w-full"
              required
            >
              <option value="">Select a route</option>
              {routes.map(route => (
                <option key={route.id} value={route.id}>
                  {route.name} ({route.startPoint} → {route.endPoint})
                </option>
              ))}
            </select>
          </div>

          {/* Bus and Driver Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Bus <span className="text-error">*</span>
              </label>
              <select
                value={formData.busId}
                onChange={(e) => handleInputChange('busId', e.target.value)}
                className="input w-full"
                required
              >
                <option value="">Select a bus</option>
                {buses.filter(bus => bus.status === 'active').map(bus => (
                  <option key={bus.id} value={bus.id}>
                    {bus.number} (Capacity: {bus.capacity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Driver <span className="text-error">*</span>
              </label>
              <select
                value={formData.driverId}
                onChange={(e) => handleInputChange('driverId', e.target.value)}
                className="input w-full"
                required
              >
                <option value="">Select a driver</option>
                {drivers.filter(driver => driver.status === 'available').map(driver => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name} ({driver.licenseNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Departure Time <span className="text-error">*</span>
              </label>
              <input
                type="time"
                value={formData.departureTime}
                onChange={(e) => handleInputChange('departureTime', e.target.value)}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Arrival Time <span className="text-error">*</span>
              </label>
              <input
                type="time"
                value={formData.arrivalTime}
                onChange={(e) => handleInputChange('arrivalTime', e.target.value)}
                className="input w-full"
                required
              />
            </div>
          </div>

          {/* Recurring Schedule */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) => handleInputChange('recurring', e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-foreground">
                Recurring Schedule
              </label>
            </div>

            {formData.recurring && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Repeat on days:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {weekDays.map(day => (
                    <label key={day.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.recurringDays.includes(day.id)}
                        onChange={() => handleRecurringDayToggle(day.id)}
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-foreground">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conflict Warnings */}
          {(conflicts.length > 0 || isValidating) && (
            <div className="border border-warning/20 bg-warning/10 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-warning" />
                <h4 className="font-medium text-warning">
                  {isValidating ? 'Validating Schedule...' : 'Schedule Conflicts Detected'}
                </h4>
              </div>
              
              {isValidating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-warning border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm text-warning">Checking for conflicts...</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {conflicts.map((conflict, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Icon name={getConflictIcon(conflict.type) as any} size={16} className="text-warning mt-0.5" />
                      <span className="text-sm text-warning">{conflict.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground border border-border rounded-md hover:bg-muted transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={conflicts.length > 0 || isValidating}
              className="btn-primary px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editingSchedule ? 'Update Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
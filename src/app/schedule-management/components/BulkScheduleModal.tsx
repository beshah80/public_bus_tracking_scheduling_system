'use client';

import Icon from '@/components/ui/AppIcon';
import React, { useState } from 'react';

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

interface BulkScheduleData {
  routeId: string;
  startDate: string;
  endDate: string;
  timeSlots: {
    departureTime: string;
    arrivalTime: string;
    busId: string;
    driverId: string;
  }[];
  selectedDays: string[];
}

interface BulkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BulkScheduleData) => void;
  routes: Route[];
  buses: Bus[];
  drivers: Driver[];
}

const BulkScheduleModal = ({ isOpen, onClose, onSave, routes, buses, drivers }: BulkScheduleModalProps) => {
  const [formData, setFormData] = useState<BulkScheduleData>({
    routeId: '',
    startDate: '',
    endDate: '',
    timeSlots: [{ departureTime: '', arrivalTime: '', busId: '', driverId: '' }],
    selectedDays: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [previewSchedules, setPreviewSchedules] = useState<any[]>([]);

  const weekDays = [
    { id: 'monday', label: 'Monday' },
    { id: 'tuesday', label: 'Tuesday' },
    { id: 'wednesday', label: 'Wednesday' },
    { id: 'thursday', label: 'Thursday' },
    { id: 'friday', label: 'Friday' },
    { id: 'saturday', label: 'Saturday' },
    { id: 'sunday', label: 'Sunday' }
  ];

  const handleInputChange = (field: keyof BulkScheduleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTimeSlotChange = (index: number, field: string, value: string) => {
    const newTimeSlots = [...formData.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    setFormData(prev => ({ ...prev, timeSlots: newTimeSlots }));
  };

  const addTimeSlot = () => {
    setFormData(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { departureTime: '', arrivalTime: '', busId: '', driverId: '' }]
    }));
  };

  const removeTimeSlot = (index: number) => {
    if (formData.timeSlots.length > 1) {
      setFormData(prev => ({
        ...prev,
        timeSlots: prev.timeSlots.filter((_, i) => i !== index)
      }));
    }
  };

  const handleDayToggle = (dayId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedDays: prev.selectedDays.includes(dayId)
        ? prev.selectedDays.filter(d => d !== dayId)
        : [...prev.selectedDays, dayId]
    }));
  };

  const generatePreview = async () => {
    setIsGenerating(true);
    
    // Simulate schedule generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPreview = [];
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      
      if (formData.selectedDays.includes(dayName)) {
        formData.timeSlots.forEach((slot, index) => {
          if (slot.departureTime && slot.arrivalTime && slot.busId && slot.driverId) {
            const bus = buses.find(b => b.id === slot.busId);
            const driver = drivers.find(d => d.id === slot.driverId);
            const route = routes.find(r => r.id === formData.routeId);
            
            mockPreview.push({
              id: `${date.toISOString().split('T')[0]}-${index}`,
              date: date.toISOString().split('T')[0],
              routeName: route?.name || '',
              busNumber: bus?.number || '',
              driverName: driver?.name || '',
              departureTime: slot.departureTime,
              arrivalTime: slot.arrivalTime,
              status: 'scheduled'
            });
          }
        });
      }
    }
    
    setPreviewSchedules(mockPreview);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      routeId: '',
      startDate: '',
      endDate: '',
      timeSlots: [{ departureTime: '', arrivalTime: '', busId: '', driverId: '' }],
      selectedDays: []
    });
    setPreviewSchedules([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
      <div className="bg-surface rounded-lg shadow-elevation-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">Bulk Schedule Creation</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-200"
          >
            <Icon name="XMarkIcon" size={20} className="text-text-secondary" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Route and Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {route.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Start Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                End Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="input w-full"
                required
              />
            </div>
          </div>

          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Operating Days <span className="text-error">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {weekDays.map(day => (
                <label key={day.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.selectedDays.includes(day.id)}
                    onChange={() => handleDayToggle(day.id)}
                    className="rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-foreground">{day.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium text-foreground">
                Time Slots <span className="text-error">*</span>
              </label>
              <button
                type="button"
                onClick={addTimeSlot}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors duration-200"
              >
                <Icon name="PlusIcon" size={16} />
                <span>Add Slot</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.timeSlots.map((slot, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-foreground">Time Slot {index + 1}</h4>
                    {formData.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(index)}
                        className="p-1 text-error hover:bg-red-50 rounded-md transition-colors duration-200"
                      >
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Departure Time
                      </label>
                      <input
                        type="time"
                        value={slot.departureTime}
                        onChange={(e) => handleTimeSlotChange(index, 'departureTime', e.target.value)}
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Arrival Time
                      </label>
                      <input
                        type="time"
                        value={slot.arrivalTime}
                        onChange={(e) => handleTimeSlotChange(index, 'arrivalTime', e.target.value)}
                        className="input w-full"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Bus
                      </label>
                      <select
                        value={slot.busId}
                        onChange={(e) => handleTimeSlotChange(index, 'busId', e.target.value)}
                        className="input w-full"
                        required
                      >
                        <option value="">Select bus</option>
                        {buses.filter(bus => bus.status === 'active').map(bus => (
                          <option key={bus.id} value={bus.id}>
                            {bus.number}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Driver
                      </label>
                      <select
                        value={slot.driverId}
                        onChange={(e) => handleTimeSlotChange(index, 'driverId', e.target.value)}
                        className="input w-full"
                        required
                      >
                        <option value="">Select driver</option>
                        {drivers.filter(driver => driver.status === 'available').map(driver => (
                          <option key={driver.id} value={driver.id}>
                            {driver.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={generatePreview}
              disabled={!formData.routeId || !formData.startDate || !formData.endDate || formData.selectedDays.length === 0 || isGenerating}
              className="flex items-center space-x-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-secondary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Preview...</span>
                </>
              ) : (
                <>
                  <Icon name="EyeIcon" size={16} />
                  <span>Generate Preview</span>
                </>
              )}
            </button>
          </div>

          {/* Preview Results */}
          {previewSchedules.length > 0 && (
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">
                Preview: {previewSchedules.length} schedules will be created
              </h4>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {previewSchedules.slice(0, 10).map((schedule) => (
                  <div key={schedule.id} className="flex items-center justify-between p-2 bg-muted rounded text-sm">
                    <div>
                      <span className="font-medium">{schedule.date}</span>
                      <span className="mx-2">•</span>
                      <span>{schedule.routeName}</span>
                    </div>
                    <div className="text-text-secondary">
                      {schedule.departureTime} - {schedule.arrivalTime}
                    </div>
                  </div>
                ))}
                {previewSchedules.length > 10 && (
                  <div className="text-center text-sm text-text-secondary py-2">
                    ... and {previewSchedules.length - 10} more schedules
                  </div>
                )}
              </div>
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
              disabled={previewSchedules.length === 0}
              className="btn-primary px-4 py-2 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create {previewSchedules.length} Schedules
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkScheduleModal;
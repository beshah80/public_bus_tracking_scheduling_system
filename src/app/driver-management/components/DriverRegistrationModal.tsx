'use client';

import Icon from '@/components/ui/AppIcon';
import React, { useState } from 'react';

interface DriverFormData {
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  operator: string;
  licenseExpiry: string;
  emergencyContact: string;
  emergencyPhone: string;
  address: string;
  assignedBus: string;
}

interface DriverRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DriverFormData) => void;
  editingDriver?: any;
}

const DriverRegistrationModal = ({ isOpen, onClose, onSubmit, editingDriver }: DriverRegistrationModalProps) => {
  const [formData, setFormData] = useState<DriverFormData>({
    name: editingDriver?.name || '',
    licenseNumber: editingDriver?.licenseNumber || '',
    phone: editingDriver?.phone || '',
    email: editingDriver?.email || '',
    operator: editingDriver?.operator || '',
    licenseExpiry: editingDriver?.licenseExpiry || '',
    emergencyContact: editingDriver?.emergencyContact || '',
    emergencyPhone: editingDriver?.emergencyPhone || '',
    address: editingDriver?.address || '',
    assignedBus: editingDriver?.assignedBus || ''
  });

  const [errors, setErrors] = useState<Partial<DriverFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableBuses = [
    'ET-001-AA', 'ET-002-AA', 'ET-003-AA', 'ET-004-AA', 'ET-005-AA',
    'ET-006-AA', 'ET-007-AA', 'ET-008-AA', 'ET-009-AA', 'ET-010-AA'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<DriverFormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.operator) newErrors.operator = 'Operator is required';
    if (!formData.licenseExpiry) newErrors.licenseExpiry = 'License expiry date is required';

    // Validate license number format (Ethiopian format)
    const licenseRegex = /^[A-Z]{2}\d{6}$/;
    if (formData.licenseNumber && !licenseRegex.test(formData.licenseNumber)) {
      newErrors.licenseNumber = 'Invalid license format (e.g., AA123456)';
    }

    // Validate phone number format
    const phoneRegex = /^(\+251|0)[79]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format (+251912345678 or 0912345678)';
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      onSubmit(formData);
      onClose();
      // Reset form
      setFormData({
        name: '',
        licenseNumber: '',
        phone: '',
        email: '',
        operator: '',
        licenseExpiry: '',
        emergencyContact: '',
        emergencyPhone: '',
        address: '',
        assignedBus: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof DriverFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-500 p-4">
      <div className="bg-surface rounded-lg shadow-elevation-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingDriver ? 'Edit Driver' : 'Register New Driver'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted transition-colors duration-200"
          >
            <Icon name="XMarkIcon" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`input w-full ${errors.name ? 'border-error' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`input w-full ${errors.phone ? 'border-error' : ''}`}
                  placeholder="+251912345678"
                />
                {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input w-full ${errors.email ? 'border-error' : ''}`}
                  placeholder="driver@example.com"
                />
                {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="input w-full"
                  placeholder="Enter address"
                />
              </div>
            </div>
          </div>

          {/* License Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">License Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  License Number *
                </label>
                <input
                  type="text"
                  value={formData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value.toUpperCase())}
                  className={`input w-full font-mono ${errors.licenseNumber ? 'border-error' : ''}`}
                  placeholder="AA123456"
                />
                {errors.licenseNumber && <p className="text-error text-sm mt-1">{errors.licenseNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  License Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.licenseExpiry}
                  onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                  className={`input w-full ${errors.licenseExpiry ? 'border-error' : ''}`}
                />
                {errors.licenseExpiry && <p className="text-error text-sm mt-1">{errors.licenseExpiry}</p>}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Emergency Contact Name
                </label>
                <input
                  type="text"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="input w-full"
                  placeholder="Enter emergency contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Emergency Contact Phone
                </label>
                <input
                  type="tel"
                  value={formData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="input w-full"
                  placeholder="+251912345678"
                />
              </div>
            </div>
          </div>

          {/* Assignment Information */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4">Assignment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Operator *
                </label>
                <select
                  value={formData.operator}
                  onChange={(e) => handleInputChange('operator', e.target.value)}
                  className={`input w-full ${errors.operator ? 'border-error' : ''}`}
                >
                  <option value="">Select Operator</option>
                  <option value="Anbessa City Bus">Anbessa City Bus</option>
                  <option value="Sheger Bus">Sheger Bus</option>
                  <option value="Alliance Bus">Alliance Bus</option>
                  <option value="Selam Bus">Selam Bus</option>
                </select>
                {errors.operator && <p className="text-error text-sm mt-1">{errors.operator}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assigned Bus (Optional)
                </label>
                <select
                  value={formData.assignedBus}
                  onChange={(e) => handleInputChange('assignedBus', e.target.value)}
                  className="input w-full"
                >
                  <option value="">No Assignment</option>
                  {availableBuses.map(bus => (
                    <option key={bus} value={bus}>{bus}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-foreground transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && <Icon name="ArrowPathIcon" size={16} className="animate-spin" />}
              <span>{editingDriver ? 'Update Driver' : 'Register Driver'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DriverRegistrationModal;
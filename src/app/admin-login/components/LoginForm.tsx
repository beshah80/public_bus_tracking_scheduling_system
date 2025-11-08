'use client';

import React, { useState } from 'react';

import Icon from '@/components/ui/AppIcon';

interface LoginFormProps {
  onSubmit: (email: string, password: string, role: 'admin' | 'driver') => Promise<boolean>;
  isLoading: boolean;
}

const LoginForm = ({ onSubmit, isLoading }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin\' as \'admin\' | \'driver',
    rememberMe: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const success = await onSubmit(formData.email, formData.password, formData.role);
      
      if (!success) {
        setSubmitError('Invalid credentials. Please check your email and password.');
      }
    } catch (error) {
      setSubmitError('Login failed. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (submitError) {
      setSubmitError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Role Selection */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-3">
          Login As
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleInputChange('role', 'admin')}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              formData.role === 'admin' ?'border-primary bg-primary/5 text-primary' :'border-border bg-surface text-text-secondary hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon name="UserIcon" size={20} />
              <span className="font-medium">Administrator</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('role', 'driver')}
            className={`p-3 rounded-lg border-2 transition-all duration-200 ${
              formData.role === 'driver' ?'border-primary bg-primary/5 text-primary' :'border-border bg-surface text-text-secondary hover:border-primary/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Icon name="TruckIcon" size={20} />
              <span className="font-medium">Driver</span>
            </div>
          </button>
        </div>
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`input pl-10 ${errors.email ? 'border-error focus:ring-error' : ''}`}
            placeholder="Enter your email address"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="EnvelopeIcon" size={16} className="text-text-secondary" />
          </div>
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className={`input pl-10 pr-10 ${errors.password ? 'border-error focus:ring-error' : ''}`}
            placeholder="Enter your password"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="LockClosedIcon" size={16} className="text-text-secondary" />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            disabled={isLoading}
          >
            <Icon 
              name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} 
              size={16} 
              className="text-text-secondary hover:text-foreground" 
            />
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-error flex items-center">
            <Icon name="ExclamationCircleIcon" size={16} className="mr-1" />
            {errors.password}
          </p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
            disabled={isLoading}
          />
          <span className="ml-2 text-sm text-text-secondary">Remember me</span>
        </label>
        <button
          type="button"
          className="text-sm text-primary hover:text-primary/80 transition-colors duration-200"
          disabled={isLoading}
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20">
          <p className="text-sm text-error flex items-center">
            <Icon name="ExclamationTriangleIcon" size={16} className="mr-2" />
            {submitError}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary py-3 px-4 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2"></div>
            Signing In...
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Icon name="ArrowRightOnRectangleIcon" size={20} className="mr-2" />
            Sign In to EthioBus
          </div>
        )}
      </button>
    </form>
  );
};

export default LoginForm;
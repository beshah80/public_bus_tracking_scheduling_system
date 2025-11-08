'use client';

import Icon from '@/components/ui/AppIcon';
import { useState } from 'react';

interface QuickActionsProps {
  onReportIncident: (type: string, description: string) => void;
  onEmergencyCall: () => void;
  onBreakRequest: () => void;
}

const QuickActions = ({ onReportIncident, onEmergencyCall, onBreakRequest }: QuickActionsProps) => {
  const [showIncidentForm, setShowIncidentForm] = useState(false);
  const [incidentType, setIncidentType] = useState('');
  const [incidentDescription, setIncidentDescription] = useState('');

  const incidentTypes = [
    { value: 'traffic', label: 'Traffic Delay', icon: 'ExclamationTriangleIcon' },
    { value: 'mechanical', label: 'Mechanical Issue', icon: 'WrenchScrewdriverIcon' },
    { value: 'accident', label: 'Accident', icon: 'ShieldExclamationIcon' },
    { value: 'passenger', label: 'Passenger Issue', icon: 'UserGroupIcon' },
    { value: 'weather', label: 'Weather Condition', icon: 'CloudIcon' },
    { value: 'other', label: 'Other', icon: 'InformationCircleIcon' }
  ];

  const handleSubmitIncident = () => {
    if (incidentType && incidentDescription.trim()) {
      onReportIncident(incidentType, incidentDescription.trim());
      setIncidentType('');
      setIncidentDescription('');
      setShowIncidentForm(false);
    }
  };

  const quickActionButtons = [
    {
      name: 'Report Incident',
      icon: 'ExclamationTriangleIcon',
      color: 'bg-warning hover:bg-warning/90',
      textColor: 'text-warning-foreground',
      action: () => setShowIncidentForm(true)
    },
    {
      name: 'Emergency Call',
      icon: 'PhoneIcon',
      color: 'bg-error hover:bg-error/90',
      textColor: 'text-error-foreground',
      action: onEmergencyCall
    },
    {
      name: 'Request Break',
      icon: 'PauseIcon',
      color: 'bg-secondary hover:bg-secondary/90',
      textColor: 'text-secondary-foreground',
      action: onBreakRequest
    }
  ];

  return (
    <>
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActionButtons.map((action) => (
            <button
              key={action.name}
              onClick={action.action}
              className={`${action.color} ${action.textColor} p-4 rounded-lg flex flex-col items-center space-y-2 transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-ring focus:ring-offset-2`}
            >
              <Icon name={action.icon as any} size={24} />
              <span className="text-sm font-medium text-center">{action.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Incident Report Modal */}
      {showIncidentForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-300">
          <div className="bg-surface rounded-lg shadow-elevation-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Report Incident</h3>
                <button
                  onClick={() => setShowIncidentForm(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors duration-200"
                >
                  <Icon name="XMarkIcon" size={20} className="text-text-secondary" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Incident Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {incidentTypes.map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setIncidentType(type.value)}
                        className={`p-3 rounded-lg border text-left transition-colors duration-200 ${
                          incidentType === type.value
                            ? 'border-primary bg-primary/10 text-primary' :'border-border hover:bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <Icon name={type.icon as any} size={16} />
                          <span className="text-sm font-medium">{type.label}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Description
                  </label>
                  <textarea
                    value={incidentDescription}
                    onChange={(e) => setIncidentDescription(e.target.value)}
                    placeholder="Describe the incident in detail..."
                    rows={4}
                    className="input resize-none"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <button
                    onClick={handleSubmitIncident}
                    disabled={!incidentType || !incidentDescription.trim()}
                    className="btn-primary flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Report
                  </button>
                  <button
                    onClick={() => setShowIncidentForm(false)}
                    className="px-6 py-3 border border-border rounded-md hover:bg-muted transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
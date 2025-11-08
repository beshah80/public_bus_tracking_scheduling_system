'use client';

import Icon from '@/components/ui/AppIcon';
import { useState } from 'react';

interface ScheduleStop {
  name: string;
  arrivalTime: string;
  departureTime: string;
  delay?: number;
}

interface ScheduleViewerProps {
  routeNumber: string;
  routeName: string;
  schedules: ScheduleStop[];
  onClose: () => void;
}

const ScheduleViewer = ({ routeNumber, routeName, schedules, onClose }: ScheduleViewerProps) => {
  const [selectedDirection, setSelectedDirection] = useState<'outbound' | 'inbound'>('outbound');

  const formatTime = (time: string) => {
    return time;
  };

  const getDelayStatus = (delay?: number) => {
    if (!delay || delay === 0) return { text: 'On Time', color: 'text-success' };
    if (delay > 0) return { text: `+${delay}min`, color: 'text-warning' };
    return { text: `${delay}min`, color: 'text-success' };
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-500">
      <div className="bg-surface rounded-lg shadow-elevation-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Schedule Details</h2>
            <p className="text-sm text-text-secondary">
              <span className="font-mono font-medium">{routeNumber}</span> - {routeName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-200"
          >
            <Icon name="XMarkIcon" size={24} className="text-text-secondary" />
          </button>
        </div>

        {/* Direction Toggle */}
        <div className="p-6 border-b border-border">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setSelectedDirection('outbound')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedDirection === 'outbound' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-foreground'
              }`}
            >
              <Icon name="ArrowRightIcon" size={16} className="inline mr-2" />
              Outbound
            </button>
            <button
              onClick={() => setSelectedDirection('inbound')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                selectedDirection === 'inbound' ?'bg-primary text-primary-foreground' :'text-text-secondary hover:text-foreground'
              }`}
            >
              <Icon name="ArrowLeftIcon" size={16} className="inline mr-2" />
              Inbound
            </button>
          </div>
        </div>

        {/* Schedule List */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="space-y-3">
            {schedules.map((stop, index) => {
              const delayStatus = getDelayStatus(stop.delay);
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-primary-foreground">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{stop.name}</p>
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <span>Arr: {formatTime(stop.arrivalTime)}</span>
                        <span>Dep: {formatTime(stop.departureTime)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-medium ${delayStatus.color}`}>
                      {delayStatus.text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-sm text-text-secondary">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-success rounded-full mr-2"></div>
                <span>On Time</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-warning rounded-full mr-2"></div>
                <span>Delayed</span>
              </div>
            </div>
            <p>Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleViewer;
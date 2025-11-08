'use client';

import Icon from '@/components/ui/AppIcon';

interface RouteMapViewerProps {
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  onClose: () => void;
}

const RouteMapViewer = ({ routeNumber, routeName, startPoint, endPoint, onClose }: RouteMapViewerProps) => {
  // Mock coordinates for Addis Ababa route
  const mockLat = 9.0320;
  const mockLng = 38.7469;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-500">
      <div className="bg-surface rounded-lg shadow-elevation-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Route Map</h2>
            <p className="text-sm text-text-secondary">
              <span className="font-mono font-medium">{routeNumber}</span> - {routeName}
            </p>
            <p className="text-sm text-text-secondary mt-1">
              {startPoint} → {endPoint}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-md transition-colors duration-200"
          >
            <Icon name="XMarkIcon" size={24} className="text-text-secondary" />
          </button>
        </div>

        {/* Map Container */}
        <div className="relative h-96 bg-muted">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={`${routeName} Route Map`}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${mockLat},${mockLng}&z=14&output=embed`}
            className="border-0"
          />
          
          {/* Map Overlay Info */}
          <div className="absolute top-4 left-4 bg-surface/95 backdrop-blur-sm rounded-lg p-4 shadow-elevation max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="MapPinIcon" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Route Information</span>
            </div>
            <div className="space-y-1 text-xs text-text-secondary">
              <p><strong>Start:</strong> {startPoint}</p>
              <p><strong>End:</strong> {endPoint}</p>
              <p><strong>Distance:</strong> ~15.2 km</p>
              <p><strong>Avg. Time:</strong> 45-60 min</p>
            </div>
          </div>
        </div>

        {/* Route Legend */}
        <div className="p-6 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-3">Route Legend</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-primary rounded-full"></div>
              <span className="text-sm text-text-secondary">Bus Stops</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Major Terminals</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-warning rounded-full"></div>
              <span className="text-sm text-text-secondary">Transfer Points</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteMapViewer;
import Icon from '@/components/ui/AppIcon';

interface Stop {
  id: string;
  name: string;
  scheduledTime: string;
  actualTime?: string;
  status: 'completed' | 'current' | 'upcoming';
  passengerLoad?: number;
  estimatedArrival?: string;
}

interface RouteProgressPanelProps {
  stops: Stop[];
  onUpdateLocation: (stopId: string) => void;
  onUpdatePassengerLoad: (stopId: string, load: number) => void;
}

const RouteProgressPanel = ({ stops, onUpdateLocation, onUpdatePassengerLoad }: RouteProgressPanelProps) => {
  const getStopStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'current':
        return 'bg-primary text-primary-foreground';
      case 'upcoming':
        return 'bg-muted text-text-secondary';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  const getStopIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'CheckIcon';
      case 'current':
        return 'MapPinIcon';
      case 'upcoming':
        return 'ClockIcon';
      default:
        return 'CircleStackIcon';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Route Progress</h3>
        <div className="flex items-center space-x-2">
          <Icon name="MapIcon" size={16} className="text-text-secondary" />
          <span className="text-sm text-text-secondary">Live Updates</span>
        </div>
      </div>

      <div className="space-y-4">
        {stops.map((stop, index) => (
          <div key={stop.id} className="relative">
            {/* Connection Line */}
            {index < stops.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-8 bg-border"></div>
            )}
            
            <div className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-200 ${
              stop.status === 'current' ?'bg-primary/5 border border-primary/20' :'bg-background hover:bg-muted/50'
            }`}>
              {/* Status Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getStopStatusColor(stop.status)}`}>
                <Icon name={getStopIcon(stop.status) as any} size={20} />
              </div>

              {/* Stop Information */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground truncate">{stop.name}</h4>
                  <div className="flex items-center space-x-2 text-sm">
                    <Icon name="ClockIcon" size={14} className="text-text-secondary" />
                    <span className="font-mono text-text-secondary">{stop.scheduledTime}</span>
                  </div>
                </div>

                {/* Time Information */}
                <div className="flex items-center space-x-4 mb-3">
                  {stop.actualTime && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-text-secondary">Actual:</span>
                      <span className="text-sm font-mono text-foreground">{stop.actualTime}</span>
                    </div>
                  )}
                  {stop.estimatedArrival && stop.status === 'upcoming' && (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs text-text-secondary">ETA:</span>
                      <span className="text-sm font-mono text-primary">{stop.estimatedArrival}</span>
                    </div>
                  )}
                </div>

                {/* Passenger Load */}
                {stop.passengerLoad !== undefined && (
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="UserGroupIcon" size={14} className="text-text-secondary" />
                    <span className="text-sm text-text-secondary">Load:</span>
                    <span className="text-sm font-medium text-foreground">{stop.passengerLoad}%</span>
                    <div className="flex-1 max-w-20 bg-muted rounded-full h-1.5">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          stop.passengerLoad > 80 ? 'bg-error' : 
                          stop.passengerLoad > 60 ? 'bg-warning' : 'bg-success'
                        }`}
                        style={{ width: `${stop.passengerLoad}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {stop.status === 'current' && (
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => onUpdateLocation(stop.id)}
                      className="btn-primary px-3 py-1.5 text-xs rounded-md flex items-center space-x-1"
                    >
                      <Icon name="MapPinIcon" size={14} />
                      <span>Mark Arrived</span>
                    </button>
                    <button
                      onClick={() => onUpdatePassengerLoad(stop.id, stop.passengerLoad || 0)}
                      className="btn-secondary px-3 py-1.5 text-xs rounded-md flex items-center space-x-1"
                    >
                      <Icon name="UserGroupIcon" size={14} />
                      <span>Update Load</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RouteProgressPanel;
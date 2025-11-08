import Icon from '@/components/ui/AppIcon';

interface RouteStop {
  name: string;
  time?: string;
}

interface RouteCardProps {
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  majorStops: RouteStop[];
  frequency: string;
  status: 'active' | 'delayed' | 'maintenance';
  nextDeparture?: string;
  estimatedTime?: string;
  onViewSchedule: (routeNumber: string) => void;
  onViewMap: (routeNumber: string) => void;
}

const RouteCard = ({
  routeNumber,
  routeName,
  startPoint,
  endPoint,
  majorStops,
  frequency,
  status,
  nextDeparture,
  estimatedTime,
  onViewSchedule,
  onViewMap
}: RouteCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'delayed':
        return 'bg-warning text-warning-foreground';
      case 'maintenance':
        return 'bg-error text-error-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return 'CheckCircleIcon';
      case 'delayed':
        return 'ClockIcon';
      case 'maintenance':
        return 'WrenchScrewdriverIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  return (
    <div className="card p-6 hover:shadow-elevation-lg transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="text-lg font-bold text-primary font-mono">{routeNumber}</span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              <Icon name={getStatusIcon(status) as any} size={12} className="mr-1" />
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">{routeName}</h3>
          <div className="flex items-center text-sm text-text-secondary">
            <Icon name="MapPinIcon" size={16} className="mr-1" />
            <span>{startPoint}</span>
            <Icon name="ArrowRightIcon" size={16} className="mx-2" />
            <span>{endPoint}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-text-secondary mb-1">Major Stops</p>
          <div className="space-y-1">
            {majorStops.slice(0, 3).map((stop, index) => (
              <div key={index} className="flex items-center text-sm text-foreground">
                <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                <span>{stop.name}</span>
                {stop.time && <span className="ml-auto font-mono text-text-secondary">{stop.time}</span>}
              </div>
            ))}
            {majorStops.length > 3 && (
              <p className="text-xs text-text-secondary ml-4">+{majorStops.length - 3} more stops</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-text-secondary">Frequency</p>
            <p className="text-sm font-medium text-foreground">{frequency}</p>
          </div>
          {nextDeparture && (
            <div>
              <p className="text-sm text-text-secondary">Next Departure</p>
              <p className="text-sm font-medium text-foreground font-mono">{nextDeparture}</p>
            </div>
          )}
          {estimatedTime && (
            <div>
              <p className="text-sm text-text-secondary">Journey Time</p>
              <p className="text-sm font-medium text-foreground">{estimatedTime}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
        <button
          onClick={() => onViewSchedule(routeNumber)}
          className="flex-1 btn-primary py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center"
        >
          <Icon name="ClockIcon" size={16} className="mr-2" />
          View Schedule
        </button>
        <button
          onClick={() => onViewMap(routeNumber)}
          className="flex-1 btn-secondary py-2 px-4 text-sm font-medium rounded-md flex items-center justify-center"
        >
          <Icon name="MapIcon" size={16} className="mr-2" />
          View Route Map
        </button>
      </div>
    </div>
  );
};

export default RouteCard;
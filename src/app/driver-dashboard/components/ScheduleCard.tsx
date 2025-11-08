import Icon from '@/components/ui/AppIcon';

interface Schedule {
  id: string;
  routeName: string;
  busNumber: string;
  startTime: string;
  endTime: string;
  currentStop: string;
  nextStop: string;
  totalStops: number;
  completedStops: number;
  status: 'on-time' | 'delayed' | 'early';
}

interface ScheduleCardProps {
  schedule: Schedule;
}

const ScheduleCard = ({ schedule }: ScheduleCardProps) => {
  const progressPercentage = (schedule.completedStops / schedule.totalStops) * 100;
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'text-success bg-success/10 border-success/20';
      case 'delayed':
        return 'text-error bg-error/10 border-error/20';
      case 'early':
        return 'text-primary bg-primary/10 border-primary/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time':
        return 'CheckCircleIcon';
      case 'delayed':
        return 'ExclamationTriangleIcon';
      case 'early':
        return 'ClockIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  return (
    <div className="card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{schedule.routeName}</h2>
          <p className="text-sm text-text-secondary">Bus {schedule.busNumber}</p>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(schedule.status)}`}>
          <div className="flex items-center space-x-1">
            <Icon name={getStatusIcon(schedule.status) as any} size={12} />
            <span className="capitalize">{schedule.status.replace('-', ' ')}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs text-text-secondary uppercase tracking-wide">Start Time</p>
          <p className="text-lg font-mono font-semibold text-foreground">{schedule.startTime}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-text-secondary uppercase tracking-wide">End Time</p>
          <p className="text-lg font-mono font-semibold text-foreground">{schedule.endTime}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">Route Progress</span>
          <span className="text-sm text-text-secondary">{schedule.completedStops}/{schedule.totalStops} stops</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Icon name="MapPinIcon" size={16} className="text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary">Current Stop</p>
            <p className="text-sm font-medium text-foreground truncate">{schedule.currentStop}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-background border border-border rounded-lg">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="ArrowRightIcon" size={16} className="text-secondary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-text-secondary">Next Stop</p>
            <p className="text-sm font-medium text-foreground truncate">{schedule.nextStop}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduleCard;
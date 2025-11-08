import Icon from '@/components/ui/AppIcon';

interface DriverStatsData {
  tripsCompleted: number;
  onTimePercentage: number;
  totalDistance: number;
  averageRating: number;
  incidentsReported: number;
  hoursWorked: number;
}

interface DriverStatsProps {
  stats: DriverStatsData;
}

const DriverStats = ({ stats }: DriverStatsProps) => {
  const statItems = [
    {
      label: 'Trips Today',
      value: stats.tripsCompleted.toString(),
      icon: 'TruckIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'On-Time Rate',
      value: `${stats.onTimePercentage}%`,
      icon: 'ClockIcon',
      color: stats.onTimePercentage >= 90 ? 'text-success' : stats.onTimePercentage >= 75 ? 'text-warning' : 'text-error',
      bgColor: stats.onTimePercentage >= 90 ? 'bg-success/10' : stats.onTimePercentage >= 75 ? 'bg-warning/10' : 'bg-error/10'
    },
    {
      label: 'Distance',
      value: `${stats.totalDistance} km`,
      icon: 'MapIcon',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      label: 'Rating',
      value: stats.averageRating.toFixed(1),
      icon: 'StarIcon',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Incidents',
      value: stats.incidentsReported.toString(),
      icon: 'ExclamationTriangleIcon',
      color: stats.incidentsReported === 0 ? 'text-success' : 'text-warning',
      bgColor: stats.incidentsReported === 0 ? 'bg-success/10' : 'bg-warning/10'
    },
    {
      label: 'Hours Worked',
      value: `${stats.hoursWorked}h`,
      icon: 'ClockIcon',
      color: 'text-text-secondary',
      bgColor: 'bg-muted'
    }
  ];

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Today's Performance</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
              <Icon name={item.icon as any} size={20} className={item.color} />
            </div>
            <p className="text-xl font-semibold text-foreground mb-1">{item.value}</p>
            <p className="text-xs text-text-secondary">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DriverStats;
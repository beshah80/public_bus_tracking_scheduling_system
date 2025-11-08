import Icon from '@/components/ui/AppIcon';

interface ScheduleStatsProps {
  totalSchedules: number;
  activeSchedules: number;
  completedSchedules: number;
  conflictSchedules: number;
}

const ScheduleStats = ({ 
  totalSchedules, 
  activeSchedules, 
  completedSchedules, 
  conflictSchedules 
}: ScheduleStatsProps) => {
  const stats = [
    {
      label: 'Total Schedules',
      value: totalSchedules,
      icon: 'CalendarDaysIcon',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      label: 'Active Now',
      value: activeSchedules,
      icon: 'PlayIcon',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      label: 'Completed Today',
      value: completedSchedules,
      icon: 'CheckCircleIcon',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      label: 'Conflicts',
      value: conflictSchedules,
      icon: 'ExclamationTriangleIcon',
      color: 'text-error',
      bgColor: 'bg-error/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => (
        <div key={stat.label} className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
            <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
              <Icon name={stat.icon as any} size={24} className={stat.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ScheduleStats;
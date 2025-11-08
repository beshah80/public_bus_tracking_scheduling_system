import Icon from '@/components/ui/AppIcon';

interface RoutePerformance {
  routeName: string;
  totalBuses: number;
  onTime: number;
  delayed: number;
  averageDelay: number;
  status: 'excellent' | 'good' | 'poor';
}

interface ScheduleOverviewProps {
  routePerformances: RoutePerformance[];
}

const ScheduleOverview = ({ routePerformances }: ScheduleOverviewProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return { icon: 'CheckCircleIcon', color: 'text-success' };
      case 'good':
        return { icon: 'ClockIcon', color: 'text-warning' };
      default:
        return { icon: 'ExclamationCircleIcon', color: 'text-error' };
    }
  };

  const getPerformancePercentage = (onTime: number, total: number) => {
    return Math.round((onTime / total) * 100);
  };

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Today's Schedule Overview</h3>
          <div className="flex items-center space-x-2">
            <Icon name="CalendarIcon" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">November 8, 2025</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {routePerformances.map((route, index) => {
            const statusInfo = getStatusIcon(route.status);
            const performancePercentage = getPerformancePercentage(route.onTime, route.totalBuses);
            
            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-200">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name={statusInfo.icon as any} 
                      size={20} 
                      className={statusInfo.color} 
                    />
                    <div>
                      <h4 className="font-medium text-foreground">{route.routeName}</h4>
                      <p className="text-sm text-text-secondary">
                        {route.totalBuses} buses • {route.onTime} on time • {route.delayed} delayed
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-border rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            performancePercentage >= 90 ? 'bg-success' :
                            performancePercentage >= 70 ? 'bg-warning' : 'bg-error'
                          }`}
                          style={{ width: `${performancePercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-foreground">{performancePercentage}%</span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      Avg delay: {route.averageDelay} min
                    </p>
                  </div>
                  <button className="text-primary hover:text-primary/80 transition-colors duration-200">
                    <Icon name="ChevronRightIcon" size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScheduleOverview;
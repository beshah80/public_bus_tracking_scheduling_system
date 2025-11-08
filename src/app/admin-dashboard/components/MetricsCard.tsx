import Icon from '@/components/ui/AppIcon';

interface MetricsCardProps {
  title: string;
  value: number;
  icon: string;
  status: 'normal' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const MetricsCard = ({ title, value, icon, status, trend }: MetricsCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-success';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'warning':
        return 'bg-warning/10 border-warning/20';
      case 'error':
        return 'bg-error/10 border-error/20';
      default:
        return 'bg-success/10 border-success/20';
    }
  };

  return (
    <div className={`card p-6 ${getBackgroundColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            status === 'warning' ? 'bg-warning' : 
            status === 'error' ? 'bg-error' : 'bg-success'
          }`}>
            <Icon 
              name={icon as any} 
              size={24} 
              className="text-white" 
            />
          </div>
          <div>
            <p className="text-sm text-text-secondary font-medium">{title}</p>
            <p className={`text-3xl font-bold ${getStatusColor()}`}>{value}</p>
          </div>
        </div>
        {trend && (
          <div className="text-right">
            <div className={`flex items-center space-x-1 ${
              trend.isPositive ? 'text-success' : 'text-error'
            }`}>
              <Icon 
                name={trend.isPositive ? 'ArrowUpIcon' : 'ArrowDownIcon'} 
                size={16} 
              />
              <span className="text-sm font-medium">{Math.abs(trend.value)}%</span>
            </div>
            <p className="text-xs text-text-secondary mt-1">vs yesterday</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;
import Icon from '@/components/ui/AppIcon';

interface IncidentReport {
  id: string;
  busNumber: string;
  route: string;
  incidentType: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'investigating';
  severity: 'low' | 'medium' | 'high';
}

interface IncidentReportsTableProps {
  reports: IncidentReport[];
}

const IncidentReportsTable = ({ reports }: IncidentReportsTableProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-success text-success-foreground';
      case 'investigating':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent Incident Reports</h3>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
            <span className="text-sm text-text-secondary">Live Updates</span>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Bus & Route
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Incident Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-surface divide-y divide-border">
            {reports.map((report) => (
              <tr key={report.id} className="hover:bg-muted/50 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-foreground">{report.busNumber}</div>
                    <div className="text-sm text-text-secondary">{report.route}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name="ExclamationTriangleIcon" 
                      size={16} 
                      className="text-warning" 
                    />
                    <span className="text-sm text-foreground">{report.incidentType}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary font-mono">
                  {report.timestamp}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-primary hover:text-primary/80 transition-colors duration-200">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncidentReportsTable;
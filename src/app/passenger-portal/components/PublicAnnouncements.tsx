import Icon from '@/components/ui/AppIcon';

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'maintenance' | 'emergency';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  affectedRoutes?: string[];
}

interface PublicAnnouncementsProps {
  announcements: Announcement[];
}

const PublicAnnouncements = ({ announcements }: PublicAnnouncementsProps) => {
  const getAnnouncementStyle = (type: string, priority: string) => {
    const baseClasses = "border-l-4 p-4 rounded-r-lg";
    
    switch (type) {
      case 'emergency':
        return `${baseClasses} bg-error/10 border-error`;
      case 'warning':
        return `${baseClasses} bg-warning/10 border-warning`;
      case 'maintenance':
        return `${baseClasses} bg-secondary/10 border-secondary`;
      default:
        return `${baseClasses} bg-primary/10 border-primary`;
    }
  };

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'ExclamationTriangleIcon';
      case 'warning':
        return 'ExclamationCircleIcon';
      case 'maintenance':
        return 'WrenchScrewdriverIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'emergency':
        return 'text-error';
      case 'warning':
        return 'text-warning';
      case 'maintenance':
        return 'text-secondary';
      default:
        return 'text-primary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (announcements.length === 0) {
    return (
      <div className="card p-8 text-center">
        <Icon name="SpeakerWaveIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">No Announcements</h3>
        <p className="text-text-secondary">All services are running normally. Check back later for updates.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="SpeakerWaveIcon" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Public Announcements</h2>
        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
          {announcements.length}
        </span>
      </div>

      {announcements.map((announcement) => (
        <div key={announcement.id} className={getAnnouncementStyle(announcement.type, announcement.priority)}>
          <div className="flex items-start space-x-3">
            <Icon 
              name={getAnnouncementIcon(announcement.type) as any} 
              size={20} 
              className={`flex-shrink-0 mt-0.5 ${getIconColor(announcement.type)}`} 
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-base font-semibold text-foreground">{announcement.title}</h3>
                <div className="flex items-center space-x-2 ml-4">
                  {announcement.priority === 'high' && (
                    <span className="bg-error text-error-foreground text-xs px-2 py-1 rounded-full font-medium">
                      High Priority
                    </span>
                  )}
                  <span className="text-xs text-text-secondary whitespace-nowrap">
                    {formatTimestamp(announcement.timestamp)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-foreground mb-3 leading-relaxed">
                {announcement.message}
              </p>
              
              {announcement.affectedRoutes && announcement.affectedRoutes.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Icon name="MapIcon" size={14} className="text-text-secondary" />
                  <span className="text-xs text-text-secondary">Affected Routes:</span>
                  <div className="flex flex-wrap gap-1">
                    {announcement.affectedRoutes.map((route, index) => (
                      <span 
                        key={index}
                        className="bg-muted text-foreground text-xs px-2 py-0.5 rounded font-mono"
                      >
                        {route}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PublicAnnouncements;
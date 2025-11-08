import Icon from '@/components/ui/AppIcon';

interface Message {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  isRead: boolean;
  sender: string;
}

interface AdminMessagesProps {
  messages: Message[];
  onMarkAsRead: (messageId: string) => void;
}

const AdminMessages = ({ messages, onMarkAsRead }: AdminMessagesProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-error bg-error/10 border-error/20';
      case 'high':
        return 'text-warning bg-warning/10 border-warning/20';
      case 'medium':
        return 'text-primary bg-primary/10 border-primary/20';
      case 'low':
        return 'text-text-secondary bg-muted border-border';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'ExclamationTriangleIcon';
      case 'high':
        return 'ExclamationCircleIcon';
      case 'medium':
        return 'InformationCircleIcon';
      case 'low':
        return 'ChatBubbleLeftIcon';
      default:
        return 'InformationCircleIcon';
    }
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Admin Messages</h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <span className="text-sm text-text-secondary">Live Updates</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="InboxIcon" size={48} className="text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">No messages at this time</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                message.isRead 
                  ? 'bg-background border-border' :'bg-primary/5 border-primary/20'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getPriorityColor(message.priority)}`}>
                  <Icon name={getPriorityIcon(message.priority) as any} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-medium truncate ${message.isRead ? 'text-foreground' : 'text-foreground font-semibold'}`}>
                      {message.title}
                    </h4>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(message.priority)}`}>
                        {message.priority.toUpperCase()}
                      </span>
                      {!message.isRead && (
                        <button
                          onClick={() => onMarkAsRead(message.id)}
                          className="p-1 hover:bg-muted rounded transition-colors duration-200"
                          title="Mark as read"
                        >
                          <Icon name="CheckIcon" size={14} className="text-text-secondary" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-text-secondary mb-3 line-clamp-3">
                    {message.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <Icon name="UserIcon" size={12} />
                      <span>From: {message.sender}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="ClockIcon" size={12} />
                      <span className="font-mono">{message.timestamp}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
'use client';

import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: string;
  color: string;
  count?: number;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

const QuickActions = ({ actions }: QuickActionsProps) => {
  return (
    <div className="card">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-text-secondary mt-1">Access key management functions</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="group p-4 rounded-lg border border-border hover:border-primary/30 hover:shadow-elevation transition-all duration-200 bg-surface"
            >
              <div className="flex items-start space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon 
                    name={action.icon as any} 
                    size={20} 
                    className="text-white" 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                      {action.title}
                    </h4>
                    {action.count !== undefined && (
                      <span className="text-xs bg-muted text-text-secondary px-2 py-1 rounded-full">
                        {action.count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                    {action.description}
                  </p>
                  <div className="flex items-center mt-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-xs font-medium">Access now</span>
                    <Icon name="ArrowRightIcon" size={12} className="ml-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
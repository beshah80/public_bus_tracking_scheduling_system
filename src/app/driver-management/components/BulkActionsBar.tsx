'use client';

import Icon from '@/components/ui/AppIcon';
import { useState } from 'react';

interface BulkActionsBarProps {
  selectedCount: number;
  onBulkStatusChange: (status: string) => void;
  onBulkAssignment: () => void;
  onBulkExport: () => void;
  onClearSelection: () => void;
}

const BulkActionsBar = ({ 
  selectedCount, 
  onBulkStatusChange, 
  onBulkAssignment, 
  onBulkExport, 
  onClearSelection 
}: BulkActionsBarProps) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  if (selectedCount === 0) return null;

  const handleStatusChange = (status: string) => {
    onBulkStatusChange(status);
    setShowStatusMenu(false);
  };

  return (
    <div className="bg-primary text-primary-foreground rounded-lg p-4 shadow-elevation flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircleIcon" size={20} />
          <span className="font-medium">{selectedCount} driver{selectedCount > 1 ? 's' : ''} selected</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Status Change Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowStatusMenu(!showStatusMenu)}
            className="bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <Icon name="UserIcon" size={16} />
            <span>Change Status</span>
            <Icon name="ChevronDownIcon" size={16} />
          </button>

          {showStatusMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-elevation-lg z-200">
              <div className="py-2">
                <button
                  onClick={() => handleStatusChange('active')}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>Set as Active</span>
                </button>
                <button
                  onClick={() => handleStatusChange('inactive')}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                  <span>Set as Inactive</span>
                </button>
                <button
                  onClick={() => handleStatusChange('suspended')}
                  className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors duration-200 flex items-center space-x-2"
                >
                  <div className="w-2 h-2 bg-error rounded-full"></div>
                  <span>Suspend</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bulk Assignment */}
        <button
          onClick={onBulkAssignment}
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Icon name="TruckIcon" size={16} />
          <span>Assign Buses</span>
        </button>

        {/* Export */}
        <button
          onClick={onBulkExport}
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
        >
          <Icon name="ArrowDownTrayIcon" size={16} />
          <span>Export</span>
        </button>

        {/* Clear Selection */}
        <button
          onClick={onClearSelection}
          className="bg-primary-foreground/20 hover:bg-primary-foreground/30 p-2 rounded-md transition-colors duration-200"
          title="Clear Selection"
        >
          <Icon name="XMarkIcon" size={16} />
        </button>
      </div>
    </div>
  );
};

export default BulkActionsBar;
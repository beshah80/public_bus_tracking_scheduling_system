'use client';

import Icon from '@/components/ui/AppIcon';

interface FilterOptions {
  status: string;
  assignment: string;
  operator: string;
  search: string;
}

interface DriverFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  driverCounts: {
    total: number;
    active: number;
    inactive: number;
    suspended: number;
    assigned: number;
    unassigned: number;
  };
}

const DriverFilters = ({ filters, onFilterChange, driverCounts }: DriverFiltersProps) => {
  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      assignment: '',
      operator: '',
      search: ''
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="bg-surface rounded-lg border border-border shadow-elevation p-6 space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search drivers by name or license number..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="input pl-10 pr-4 w-full"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name="MagnifyingGlassIcon" size={16} className="text-text-secondary" />
        </div>
        {filters.search && (
          <button
            onClick={() => handleFilterChange('search', '')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <Icon name="XMarkIcon" size={16} className="text-text-secondary hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input w-full"
          >
            <option value="">All Status ({driverCounts.total})</option>
            <option value="active">Active ({driverCounts.active})</option>
            <option value="inactive">Inactive ({driverCounts.inactive})</option>
            <option value="suspended">Suspended ({driverCounts.suspended})</option>
          </select>
        </div>

        {/* Assignment Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Assignment</label>
          <select
            value={filters.assignment}
            onChange={(e) => handleFilterChange('assignment', e.target.value)}
            className="input w-full"
          >
            <option value="">All Assignments</option>
            <option value="assigned">Assigned ({driverCounts.assigned})</option>
            <option value="unassigned">Unassigned ({driverCounts.unassigned})</option>
          </select>
        </div>

        {/* Operator Filter */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Operator</label>
          <select
            value={filters.operator}
            onChange={(e) => handleFilterChange('operator', e.target.value)}
            className="input w-full"
          >
            <option value="">All Operators</option>
            <option value="Anbessa City Bus">Anbessa City Bus</option>
            <option value="Sheger Bus">Sheger Bus</option>
            <option value="Alliance Bus">Alliance Bus</option>
            <option value="Selam Bus">Selam Bus</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="btn-secondary px-4 py-2 rounded-md text-sm font-medium w-full flex items-center justify-center space-x-2"
            >
              <Icon name="XMarkIcon" size={16} />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-semibold text-foreground">{driverCounts.total}</p>
          <p className="text-sm text-text-secondary">Total Drivers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-success">{driverCounts.active}</p>
          <p className="text-sm text-text-secondary">Active</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-primary">{driverCounts.assigned}</p>
          <p className="text-sm text-text-secondary">Assigned</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-semibold text-warning">{driverCounts.unassigned}</p>
          <p className="text-sm text-text-secondary">Unassigned</p>
        </div>
      </div>
    </div>
  );
};

export default DriverFilters;
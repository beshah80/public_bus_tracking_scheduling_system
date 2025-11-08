'use client';

import Icon from '@/components/ui/AppIcon';
import { useState } from 'react';

interface Route {
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  operator: string;
  area: string;
  frequency: string;
  status: 'active' | 'delayed' | 'maintenance';
}

interface RouteBrowserProps {
  routes: Route[];
  onRouteSelect: (route: Route) => void;
}

const RouteBrowser = ({ routes, onRouteSelect }: RouteBrowserProps) => {
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedOperator, setSelectedOperator] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const areas = ['all', ...Array.from(new Set(routes.map(route => route.area)))];
  const operators = ['all', ...Array.from(new Set(routes.map(route => route.operator)))];

  const filteredRoutes = routes.filter(route => {
    const areaMatch = selectedArea === 'all' || route.area === selectedArea;
    const operatorMatch = selectedOperator === 'all' || route.operator === selectedOperator;
    return areaMatch && operatorMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'delayed':
        return 'text-warning';
      case 'maintenance':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Icon name="MapIcon" size={24} className="text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Browse Routes</h2>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Area</label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="input w-full"
            >
              {areas.map(area => (
                <option key={area} value={area}>
                  {area === 'all' ? 'All Areas' : area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Operator</label>
            <select
              value={selectedOperator}
              onChange={(e) => setSelectedOperator(e.target.value)}
              className="input w-full"
            >
              {operators.map(operator => (
                <option key={operator} value={operator}>
                  {operator === 'all' ? 'All Operators' : operator}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Departure Time</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="input w-full"
            >
              <option value="all">All Times</option>
              <option value="morning">Morning (6AM-12PM)</option>
              <option value="afternoon">Afternoon (12PM-6PM)</option>
              <option value="evening">Evening (6PM-10PM)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Route Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRoutes.map((route) => (
          <div
            key={route.routeNumber}
            onClick={() => onRouteSelect(route)}
            className="card p-4 hover:shadow-elevation-lg transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-lg font-bold text-primary font-mono">{route.routeNumber}</span>
                <span className={`ml-2 inline-flex items-center text-xs ${getStatusColor(route.status)}`}>
                  <div className={`w-2 h-2 rounded-full mr-1 ${
                    route.status === 'active' ? 'bg-success' :
                    route.status === 'delayed' ? 'bg-warning' : 'bg-error'
                  }`}></div>
                  {route.status}
                </span>
              </div>
              <Icon 
                name="ChevronRightIcon" 
                size={16} 
                className="text-text-secondary group-hover:text-primary transition-colors duration-200" 
              />
            </div>

            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
              {route.routeName}
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-text-secondary">
                <Icon name="MapPinIcon" size={14} className="mr-2" />
                <span className="truncate">{route.startPoint}</span>
              </div>
              <div className="flex items-center text-text-secondary">
                <Icon name="FlagIcon" size={14} className="mr-2" />
                <span className="truncate">{route.endPoint}</span>
              </div>
              <div className="flex items-center text-text-secondary">
                <Icon name="BuildingOfficeIcon" size={14} className="mr-2" />
                <span>{route.operator}</span>
              </div>
              <div className="flex items-center text-text-secondary">
                <Icon name="ClockIcon" size={14} className="mr-2" />
                <span>{route.frequency}</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                {route.area}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredRoutes.length === 0 && (
        <div className="card p-8 text-center">
          <Icon name="MagnifyingGlassIcon" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Routes Found</h3>
          <p className="text-text-secondary">Try adjusting your filters to see more routes.</p>
        </div>
      )}
    </div>
  );
};

export default RouteBrowser;
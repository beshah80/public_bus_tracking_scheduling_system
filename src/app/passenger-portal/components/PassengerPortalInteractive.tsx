'use client';

import PassengerNavigation from '@/components/common/PassengerNavigation';
import { useEffect, useState } from 'react';
import FeedbackForm from './FeedbackForm';
import PublicAnnouncements from './PublicAnnouncements';
import RouteBrowser from './RouteBrowser';
import RouteCard from './RouteCard';
import RouteMapViewer from './RouteMapViewer';
import RouteSearchBar from './RouteSearchBar';
import ScheduleViewer from './ScheduleViewer';

interface Route {
  routeNumber: string;
  routeName: string;
  startPoint: string;
  endPoint: string;
  operator: string;
  area: string;
  frequency: string;
  status: 'active' | 'delayed' | 'maintenance';
  majorStops: Array<{ name: string; time?: string }>;
  nextDeparture?: string;
  estimatedTime?: string;
}

interface ScheduleStop {
  name: string;
  arrivalTime: string;
  departureTime: string;
  delay?: number;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'maintenance' | 'emergency';
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  affectedRoutes?: string[];
}

const PassengerPortalInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchResults, setSearchResults] = useState<Route[]>([]);
  const [selectedSchedule, setSelectedSchedule] = useState<{
    routeNumber: string;
    routeName: string;
    schedules: ScheduleStop[];
  } | null>(null);
  const [selectedMap, setSelectedMap] = useState<{
    routeNumber: string;
    routeName: string;
    startPoint: string;
    endPoint: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockRoutes: Route[] = [
    {
      routeNumber: "Route 1",
      routeName: "Central Station - Airport Terminal",
      startPoint: "Central Station (Merkato)",
      endPoint: "Bole International Airport",
      operator: "Anbessa City Bus",
      area: "Central Addis",
      frequency: "Every 15 minutes",
      status: "active",
      majorStops: [
        { name: "Merkato", time: "06:00" },
        { name: "Piazza", time: "06:15" },
        { name: "Mexico Square", time: "06:30" },
        { name: "Bole Road", time: "06:45" },
        { name: "Airport Terminal", time: "07:00" }
      ],
      nextDeparture: "08:15 AM",
      estimatedTime: "45-60 minutes"
    },
    {
      routeNumber: "Route 2",
      routeName: "University Campus - Kazanchis",
      startPoint: "Addis Ababa University",
      endPoint: "Kazanchis Business District",
      operator: "Sheger Bus",
      area: "University Area",
      frequency: "Every 20 minutes",
      status: "delayed",
      majorStops: [
        { name: "AAU Main Gate", time: "06:30" },
        { name: "Sidist Kilo", time: "06:45" },
        { name: "Arat Kilo", time: "07:00" },
        { name: "Kazanchis", time: "07:15" }
      ],
      nextDeparture: "08:35 AM",
      estimatedTime: "30-40 minutes"
    },
    {
      routeNumber: "Route 3",
      routeName: "Megenagna - Lebu",
      startPoint: "Megenagna",
      endPoint: "Lebu",
      operator: "Alliance Bus",
      area: "Eastern Addis",
      frequency: "Every 25 minutes",
      status: "active",
      majorStops: [
        { name: "Megenagna", time: "06:00" },
        { name: "CMC", time: "06:20" },
        { name: "Hayat Hospital", time: "06:35" },
        { name: "Lebu", time: "06:50" }
      ],
      nextDeparture: "08:20 AM",
      estimatedTime: "35-45 minutes"
    },
    {
      routeNumber: "Route 4",
      routeName: "Kality - Gotera",
      startPoint: "Kality",
      endPoint: "Gotera",
      operator: "Public Transport",
      area: "Southern Addis",
      frequency: "Every 30 minutes",
      status: "maintenance",
      majorStops: [
        { name: "Kality", time: "07:00" },
        { name: "Akaki", time: "07:20" },
        { name: "Kaliti", time: "07:35" },
        { name: "Gotera", time: "07:50" }
      ],
      nextDeparture: "Suspended",
      estimatedTime: "40-50 minutes"
    }
  ];

  const mockSchedules: ScheduleStop[] = [
    { name: "Central Station (Merkato)", arrivalTime: "06:00", departureTime: "06:00", delay: 0 },
    { name: "Piazza", arrivalTime: "06:15", departureTime: "06:17", delay: 2 },
    { name: "Mexico Square", arrivalTime: "06:30", departureTime: "06:32", delay: 0 },
    { name: "Bole Road", arrivalTime: "06:45", departureTime: "06:47", delay: -1 },
    { name: "Airport Terminal", arrivalTime: "07:00", departureTime: "07:00", delay: 0 }
  ];

  const mockAnnouncements: Announcement[] = [
    {
      id: "1",
      title: "Route 4 Temporary Suspension",
      message: "Due to scheduled maintenance on Kality-Gotera route, services are temporarily suspended. Alternative routes via Route 1 and Route 3 are available. Expected resumption: Tomorrow 6:00 AM.",
      type: "maintenance",
      timestamp: "2025-11-08T06:00:00Z",
      priority: "high",
      affectedRoutes: ["Route 4"]
    },
    {
      id: "2",
      title: "Traffic Delays on Bole Road",
      message: "Heavy traffic reported on Bole Road due to construction work. Routes passing through this area may experience 10-15 minute delays. Please plan accordingly.",
      type: "warning",
      timestamp: "2025-11-08T07:30:00Z",
      priority: "medium",
      affectedRoutes: ["Route 1", "Route 2"]
    },
    {
      id: "3",
      title: "New Bus Stop Added",
      message: "A new bus stop has been added at Hayat Medical College on Route 3. This will improve accessibility for students and medical staff in the area.",
      type: "info",
      timestamp: "2025-11-07T14:00:00Z",
      priority: "low",
      affectedRoutes: ["Route 3"]
    }
  ];

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          <div className="h-16 bg-muted"></div>
          <div className="h-12 bg-muted/50"></div>
          <div className="p-8 space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-12 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockRoutes.filter(route =>
        route.routeNumber.toLowerCase().includes(query.toLowerCase()) ||
        route.routeName.toLowerCase().includes(query.toLowerCase()) ||
        route.startPoint.toLowerCase().includes(query.toLowerCase()) ||
        route.endPoint.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleRouteSelect = (route: Route) => {
    // Scroll to route details or show more info
    console.log('Selected route:', route);
  };

  const handleViewSchedule = (routeNumber: string) => {
    const route = mockRoutes.find(r => r.routeNumber === routeNumber);
    if (route) {
      setSelectedSchedule({
        routeNumber: route.routeNumber,
        routeName: route.routeName,
        schedules: mockSchedules
      });
    }
  };

  const handleViewMap = (routeNumber: string) => {
    const route = mockRoutes.find(r => r.routeNumber === routeNumber);
    if (route) {
      setSelectedMap({
        routeNumber: route.routeNumber,
        routeName: route.routeName,
        startPoint: route.startPoint,
        endPoint: route.endPoint
      });
    }
  };

  const handleFeedbackSubmit = (feedback: any) => {
    console.log('Feedback submitted:', feedback);
  };

  return (
    <div className="min-h-screen bg-background">
      <PassengerNavigation onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section with Search */}
        <section className="text-center py-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Find Your Route
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Search for bus routes, view real-time schedules, and track your journey across Addis Ababa
          </p>
          <RouteSearchBar onSearch={handleSearch} />
        </section>

        {/* Search Results */}
        {searchQuery && (
          <section>
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Search Results for "{searchQuery}"
            </h2>
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {searchResults.map((route) => (
                  <RouteCard
                    key={route.routeNumber}
                    {...route}
                    onViewSchedule={handleViewSchedule}
                    onViewMap={handleViewMap}
                  />
                ))}
              </div>
            ) : (
              <div className="card p-8 text-center">
                <p className="text-text-secondary">No routes found matching your search.</p>
              </div>
            )}
          </section>
        )}

        {/* Route Browser */}
        {!searchQuery && (
          <section>
            <RouteBrowser routes={mockRoutes} onRouteSelect={handleRouteSelect} />
          </section>
        )}

        {/* Public Announcements */}
        <section>
          <PublicAnnouncements announcements={mockAnnouncements} />
        </section>

        {/* Feedback Form */}
        <section>
          <FeedbackForm onSubmit={handleFeedbackSubmit} />
        </section>
      </main>

      {/* Modals */}
      {selectedSchedule && (
        <ScheduleViewer
          {...selectedSchedule}
          onClose={() => setSelectedSchedule(null)}
        />
      )}

      {selectedMap && (
        <RouteMapViewer
          {...selectedMap}
          onClose={() => setSelectedMap(null)}
        />
      )}
    </div>
  );
};

export default PassengerPortalInteractive;
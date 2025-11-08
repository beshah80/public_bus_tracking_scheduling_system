import type { Metadata } from 'next';
import DriverDashboardInteractive from './components/DriverDashboardInteractive';

export const metadata: Metadata = {
  title: 'Driver Dashboard - EthioBus Tracker',
  description: 'Real-time driver interface for route management, schedule tracking, and incident reporting in Ethiopian public transport system.',
};

export default function DriverDashboardPage() {
  return <DriverDashboardInteractive />;
}
import AdminNavigation from '@/components/common/AdminNavigation';
import type { Metadata } from 'next';
import AdminDashboardInteractive from './components/AdminDashboardInteractive';

export const metadata: Metadata = {
  title: 'Admin Dashboard - EthioBus Tracker',
  description: 'Monitor and manage EthioBus transport operations with real-time analytics, incident reports, and system performance metrics for Ethiopian urban transportation.',
};

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      {/* Main Content Area */}
      <div className="lg:pl-64">
        <AdminDashboardInteractive />
      </div>
    </div>
  );
}
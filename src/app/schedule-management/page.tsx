import AdminNavigation from '@/components/common/AdminNavigation';
import type { Metadata } from 'next';
import ScheduleManagementInteractive from './components/ScheduleManagementInteractive';

export const metadata: Metadata = {
  title: 'Schedule Management - EthioBus Tracker',
  description: 'Create and manage bus schedules with automated conflict detection and bulk scheduling operations for efficient transport coordination.',
};

export default function ScheduleManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation />
      
      {/* Main Content */}
      <main className="lg:pl-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ScheduleManagementInteractive />
        </div>
      </main>
    </div>
  );
}
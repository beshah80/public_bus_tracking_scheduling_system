import type { Metadata } from 'next';
import DriverManagementInteractive from './components/DriverManagementInteractive';

export const metadata: Metadata = {
  title: 'Driver Management - EthioBus Tracker',
  description: 'Manage driver registrations, license information, bus assignments, and monitor driver status in the Ethiopian public transport system.',
};

export default function DriverManagementPage() {
  return <DriverManagementInteractive />;
}
import type { Metadata } from 'next';
import PassengerPortalInteractive from './components/PassengerPortalInteractive';

export const metadata: Metadata = {
  title: 'Passenger Portal - EthioBus Tracker',
  description: 'Find bus routes, view schedules, track real-time locations, and provide feedback for public transportation in Ethiopian cities.',
};

export default function PassengerPortalPage() {
  return <PassengerPortalInteractive />;
}
import type { Metadata } from 'next';
import LoginInteractive from './components/LoginInteractive';

export const metadata: Metadata = {
  title: 'Admin Login - EthioBus Tracker',
  description: 'Secure authentication portal for transport administrators and bus operators to access the EthioBus management system.',
};

export default function AdminLoginPage() {
  return <LoginInteractive />;
}
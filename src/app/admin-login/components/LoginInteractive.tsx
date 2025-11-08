'use client';

import { useAuth } from '@/components/common/AuthenticationWrapper';
import LoginCredentials from './LoginCredentials';
import LoginForm from './LoginForm';
import LoginHeader from './LoginHeader';

const LoginInteractive = () => {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl shadow-elevation-lg border border-border p-8">
          <LoginHeader />
          <LoginForm onSubmit={login} isLoading={isLoading} />
          <LoginCredentials />
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-text-secondary">
            © {new Date()?.getFullYear()} Ethiopian Transport Authority. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginInteractive;
import Icon from '@/components/ui/AppIcon';

const LoginHeader = () => {
  return (
    <div className="text-center mb-8">
      {/* Logo */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-elevation">
          <Icon name="TruckIcon" size={32} className="text-primary-foreground" />
        </div>
      </div>

      {/* Title and Description */}
      <h1 className="text-3xl font-semibold text-foreground mb-2">
        Welcome to EthioBus
      </h1>
      <p className="text-text-secondary mb-4">
        Transport Management System
      </p>
      <p className="text-sm text-text-secondary max-w-md mx-auto">
        Sign in to access the administrative dashboard and manage Ethiopia's urban public transportation system.
      </p>
    </div>
  );
};

export default LoginHeader;
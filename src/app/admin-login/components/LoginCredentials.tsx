import Icon from '@/components/ui/AppIcon';

const LoginCredentials = () => {
  const credentials = [
    {
      role: 'Administrator',
      email: 'admin@ethiobus.gov.et',
      password: 'password123',
      icon: 'UserIcon',
      description: 'Full system access and management'
    },
    {
      role: 'Driver',
      email: 'driver@ethiobus.gov.et', 
      password: 'password123',
      icon: 'TruckIcon',
      description: 'Route updates and incident reporting'
    }
  ];

  return (
    <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
      <div className="flex items-center mb-3">
        <Icon name="InformationCircleIcon" size={16} className="text-primary mr-2" />
        <h3 className="text-sm font-medium text-foreground">Demo Credentials</h3>
      </div>
      <div className="space-y-3">
        {credentials.map((cred, index) => (
          <div key={index} className="bg-surface p-3 rounded-md border border-border">
            <div className="flex items-center mb-2">
              <Icon name={cred.icon as any} size={16} className="text-primary mr-2" />
              <span className="text-sm font-medium text-foreground">{cred.role}</span>
            </div>
            <div className="text-xs space-y-1">
              <p className="text-text-secondary">
                <span className="font-medium">Email:</span> {cred.email}
              </p>
              <p className="text-text-secondary">
                <span className="font-medium">Password:</span> {cred.password}
              </p>
              <p className="text-text-secondary italic">{cred.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoginCredentials;
'use client';

import AdminNavigation from '@/components/common/AdminNavigation';
import Icon from '@/components/ui/AppIcon';
import { useEffect, useState } from 'react';
import BulkActionsBar from './BulkActionsBar';
import DriverFilters from './DriverFilters';
import DriverRegistrationModal from './DriverRegistrationModal';
import DriverTable from './DriverTable';

interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  assignedBus: string | null;
  status: 'active' | 'inactive' | 'suspended';
  operator: string;
  licenseExpiry: string;
  joinDate: string;
  profileImage: string;
  alt: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  address?: string;
}

interface FilterOptions {
  status: string;
  assignment: string;
  operator: string;
  search: string;
}

const DriverManagementInteractive = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    status: '',
    assignment: '',
    operator: '',
    search: ''
  });

  useEffect(() => {
    setIsHydrated(true);
    loadMockDrivers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [drivers, filters]);

  const loadMockDrivers = () => {
    const mockDrivers: Driver[] = [
    {
      id: '1',
      name: 'Abebe Kebede',
      licenseNumber: 'AA123456',
      phone: '+251911234567',
      email: 'abebe.kebede@ethiobus.gov.et',
      assignedBus: 'ET-001-AA',
      status: 'active',
      operator: 'Anbessa City Bus',
      licenseExpiry: '2025-12-15',
      joinDate: '2023-01-15',
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_161302dcc-1762274535486.png",
      alt: 'Professional headshot of Ethiopian man with short black hair wearing blue uniform shirt',
      emergencyContact: 'Almaz Kebede',
      emergencyPhone: '+251911234568',
      address: 'Bole, Addis Ababa'
    },
    {
      id: '2',
      name: 'Tigist Haile',
      licenseNumber: 'BB789012',
      phone: '+251922345678',
      email: 'tigist.haile@ethiobus.gov.et',
      assignedBus: 'ET-002-AA',
      status: 'active',
      operator: 'Sheger Bus',
      licenseExpiry: '2026-03-20',
      joinDate: '2023-02-10',
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_161302dcc-1762274535486.png",
      alt: 'Professional headshot of Ethiopian woman with shoulder-length black hair wearing white uniform shirt',
      emergencyContact: 'Dawit Haile',
      emergencyPhone: '+251922345679',
      address: 'Kirkos, Addis Ababa'
    },
    {
      id: '3',
      name: 'Mulugeta Tadesse',
      licenseNumber: 'CC345678',
      phone: '+251933456789',
      email: 'mulugeta.tadesse@ethiobus.gov.et',
      assignedBus: null,
      status: 'inactive',
      operator: 'Alliance Bus',
      licenseExpiry: '2025-08-10',
      joinDate: '2022-11-05',
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_170c96297-1762274286869.png",
      alt: 'Professional headshot of Ethiopian man with beard wearing gray uniform shirt',
      emergencyContact: 'Hanna Tadesse',
      emergencyPhone: '+251933456790',
      address: 'Yeka, Addis Ababa'
    },
    {
      id: '4',
      name: 'Selamawit Bekele',
      licenseNumber: 'DD901234',
      phone: '+251944567890',
      email: 'selamawit.bekele@ethiobus.gov.et',
      assignedBus: 'ET-004-AA',
      status: 'active',
      operator: 'Selam Bus',
      licenseExpiry: '2026-01-25',
      joinDate: '2023-03-20',
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_161302dcc-1762274535486.png",
      alt: 'Professional headshot of Ethiopian woman with curly black hair wearing blue uniform shirt',
      emergencyContact: 'Yohannes Bekele',
      emergencyPhone: '+251944567891',
      address: 'Nifas Silk, Addis Ababa'
    },
    {
      id: '5',
      name: 'Getachew Molla',
      licenseNumber: 'EE567890',
      phone: '+251955678901',
      email: 'getachew.molla@ethiobus.gov.et',
      assignedBus: null,
      status: 'suspended',
      operator: 'Anbessa City Bus',
      licenseExpiry: '2024-11-30',
      joinDate: '2022-08-12',
      profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_161302dcc-1762274535486.png",
      alt: 'Professional headshot of Ethiopian man with mustache wearing white uniform shirt',
      emergencyContact: 'Meron Molla',
      emergencyPhone: '+251955678902',
      address: 'Gulele, Addis Ababa'
    }];


    setDrivers(mockDrivers);
  };

  const applyFilters = () => {
    let filtered = [...drivers];

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter((driver) => driver.status === filters.status);
    }

    // Apply assignment filter
    if (filters.assignment) {
      if (filters.assignment === 'assigned') {
        filtered = filtered.filter((driver) => driver.assignedBus !== null);
      } else if (filters.assignment === 'unassigned') {
        filtered = filtered.filter((driver) => driver.assignedBus === null);
      }
    }

    // Apply operator filter
    if (filters.operator) {
      filtered = filtered.filter((driver) => driver.operator === filters.operator);
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((driver) =>
      driver.name.toLowerCase().includes(searchTerm) ||
      driver.licenseNumber.toLowerCase().includes(searchTerm)
      );
    }

    setFilteredDrivers(filtered);
  };

  const getDriverCounts = () => {
    return {
      total: drivers.length,
      active: drivers.filter((d) => d.status === 'active').length,
      inactive: drivers.filter((d) => d.status === 'inactive').length,
      suspended: drivers.filter((d) => d.status === 'suspended').length,
      assigned: drivers.filter((d) => d.assignedBus !== null).length,
      unassigned: drivers.filter((d) => d.assignedBus === null).length
    };
  };

  const handleAddDriver = () => {
    setEditingDriver(null);
    setIsModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setEditingDriver(driver);
    setIsModalOpen(true);
  };

  const handleSubmitDriver = (formData: any) => {
    if (editingDriver) {
      // Update existing driver
      setDrivers((prev) => prev.map((driver) =>
      driver.id === editingDriver.id ?
      { ...driver, ...formData } :
      driver
      ));
    } else {
      // Add new driver
      const newDriver: Driver = {
        id: Date.now().toString(),
        ...formData,
        status: 'active' as const,
        joinDate: new Date().toISOString().split('T')[0],
        profileImage: "https://img.rocket.new/generatedImages/rocket_gen_img_1a0cb2d53-1762274332896.png",
        alt: 'Professional headshot of new driver in uniform'
      };
      setDrivers((prev) => [...prev, newDriver]);
    }
  };

  const handleViewHistory = (driverId: string) => {
    console.log('View history for driver:', driverId);
    // Implementation for viewing driver history
  };

  const handleStatusChange = (driverId: string, currentStatus: string) => {
    console.log('Change status for driver:', driverId, currentStatus);
    // Implementation for status change
  };

  const handleBulkStatusChange = (status: string) => {
    setDrivers((prev) => prev.map((driver) =>
    selectedDrivers.includes(driver.id) ?
    { ...driver, status: status as 'active' | 'inactive' | 'suspended' } :
    driver
    ));
    setSelectedDrivers([]);
  };

  const handleBulkAssignment = () => {
    console.log('Bulk assignment for drivers:', selectedDrivers);
    // Implementation for bulk assignment
  };

  const handleBulkExport = () => {
    console.log('Export drivers:', selectedDrivers);
    // Implementation for export functionality
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-6 h-6 bg-primary-foreground rounded opacity-75"></div>
          </div>
          <p className="text-text-secondary">Loading Driver Management...</p>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigation
        isCollapsed={isNavCollapsed}
        onToggleCollapse={() => setIsNavCollapsed(!isNavCollapsed)} />

      
      <main className={`transition-all duration-300 ${isNavCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Driver Management</h1>
              <p className="text-text-secondary mt-1">
                Manage driver registrations, assignments, and licensing information
              </p>
            </div>
            <button
              onClick={handleAddDriver}
              className="btn-primary px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">

              <Icon name="PlusIcon" size={16} />
              <span>Add New Driver</span>
            </button>
          </div>

          {/* Bulk Actions Bar */}
          <BulkActionsBar
            selectedCount={selectedDrivers.length}
            onBulkStatusChange={handleBulkStatusChange}
            onBulkAssignment={handleBulkAssignment}
            onBulkExport={handleBulkExport}
            onClearSelection={() => setSelectedDrivers([])} />


          {/* Filters */}
          <DriverFilters
            filters={filters}
            onFilterChange={setFilters}
            driverCounts={getDriverCounts()} />


          {/* Driver Table */}
          <DriverTable
            drivers={filteredDrivers}
            onEdit={handleEditDriver}
            onViewHistory={handleViewHistory}
            onStatusChange={handleStatusChange}
            selectedDrivers={selectedDrivers}
            onSelectionChange={setSelectedDrivers} />


          {/* Registration Modal */}
          <DriverRegistrationModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleSubmitDriver}
            editingDriver={editingDriver} />

        </div>
      </main>
    </div>);

};

export default DriverManagementInteractive;
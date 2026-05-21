import React from 'react';
import RoleDirectoryPage from './RoleDirectoryPage';

const ManagerManagement = () => (
  <RoleDirectoryPage
    title="Managers"
    role="manager"
    subtitle="Manage all manager users from a single directory."
    accent={{
      card: 'text-fuchsia-600',
      header: 'from-fuchsia-50 to-pink-50',
      chip: 'bg-fuchsia-100 text-fuchsia-800',
      button: 'bg-fuchsia-700 hover:bg-fuchsia-800',
    }}
  />
);

export default ManagerManagement;

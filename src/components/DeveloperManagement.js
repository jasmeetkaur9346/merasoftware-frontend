import React from 'react';
import RoleDirectoryPage from './RoleDirectoryPage';

const DeveloperManagement = () => (
  <RoleDirectoryPage
    title="Developers"
    role="developer"
    subtitle="Manage all developer users from a single directory."
    accent={{
      card: 'text-indigo-600',
      header: 'from-indigo-50 to-blue-50',
      chip: 'bg-indigo-100 text-indigo-800',
      button: 'bg-indigo-700 hover:bg-indigo-800',
    }}
  />
);

export default DeveloperManagement;

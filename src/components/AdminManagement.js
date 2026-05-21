import React from 'react';
import RoleDirectoryPage from './RoleDirectoryPage';

const AdminManagement = () => (
  <RoleDirectoryPage
    title="Admins"
    role="admin"
    subtitle="Manage all admin users from a single directory."
    accent={{
      card: 'text-pink-600',
      header: 'from-pink-50 to-rose-50',
      chip: 'bg-pink-100 text-pink-800',
      button: 'bg-pink-700 hover:bg-pink-800',
    }}
  />
);

export default AdminManagement;

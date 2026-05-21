import React from 'react';
import RoleDirectoryPage from './RoleDirectoryPage';

const CustomerManagement = () => (
  <RoleDirectoryPage
    title="Customers"
    role="customer"
    subtitle="Manage all customer users from a single directory."
    accent={{
      card: 'text-purple-600',
      header: 'from-purple-50 to-indigo-50',
      chip: 'bg-purple-100 text-purple-800',
      button: 'bg-purple-700 hover:bg-purple-800',
    }}
  />
);

export default CustomerManagement;

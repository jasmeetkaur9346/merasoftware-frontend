import React from 'react';
import RoleDirectoryPage from './RoleDirectoryPage';

const PartnerManagement = () => (
  <RoleDirectoryPage
    title="Partners"
    role="partner"
    subtitle="Manage all partner users from a single directory."
    accent={{
      card: 'text-emerald-600',
      header: 'from-emerald-50 to-teal-50',
      chip: 'bg-emerald-100 text-emerald-800',
      button: 'bg-emerald-700 hover:bg-emerald-800',
    }}
  />
);

export default PartnerManagement;

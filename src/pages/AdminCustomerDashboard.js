import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import AdminPaymentVerification from './AdminPaymentVerification';
import PendingRenewals from './PendingRenewals';
import AdminInvoiceManagement from './AdminInvoiceManagement';
import AdminUpdateRequests from './AdminUpdateRequests';
import AdminProjects from './AdminProjects';
import ClosePlanManagement from './ClosePlanManagement';

const TABS = [
  { id: 'payments',        label: 'Payments',         icon: '💳' },
  { id: 'renewals',        label: 'Renewals',         icon: '🔄' },
  { id: 'invoices',        label: 'Invoices',         icon: '🧾' },
  { id: 'update-requests', label: 'Update Requests',  icon: '📝' },
  { id: 'projects',        label: 'Projects',         icon: '🏗️' },
  { id: 'plan-closure',    label: 'Plan Closure',     icon: '🔒' },
];

const AdminCustomerDashboard = () => {
  const [activeTab, setActiveTab] = useState('payments');
  const [stats, setStats] = useState({
    pendingPayments: 0,
    pendingRenewals: 0,
    pendingInvoices: 0,
    pendingUpdateRequests: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const [paymentsRes, renewalsRes, invoicesRes, updateReqRes] = await Promise.allSettled([
          fetch(SummaryApi.wallet.pendingTransactions.url, {
            method: SummaryApi.wallet.pendingTransactions.method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(SummaryApi.getPendingRenewals.url, {
            method: SummaryApi.getPendingRenewals.method,
            credentials: 'include',
          }),
          fetch(SummaryApi.invoices.getAllInvoices.url + '?status=unpaid', {
            method: SummaryApi.invoices.getAllInvoices.method,
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }),
          fetch(SummaryApi.adminUpdateRequests.url, {
            credentials: 'include',
          }),
        ]);

        const parse = async (settled) => {
          if (settled.status === 'fulfilled') {
            const json = await settled.value.json();
            return json.success ? (json.data || []) : [];
          }
          return [];
        };

        const [payments, renewals, invoices, updateReqs] = await Promise.all([
          parse(paymentsRes),
          parse(renewalsRes),
          parse(invoicesRes),
          parse(updateReqRes),
        ]);

        setStats({
          pendingPayments: payments.length,
          pendingRenewals: renewals.length,
          pendingInvoices: invoices.length,
          pendingUpdateRequests: updateReqs.filter(r => r.status === 'pending').length,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Pending Payments',
      value: stats.pendingPayments,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      tab: 'payments',
    },
    {
      label: 'Pending Renewals',
      value: stats.pendingRenewals,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      tab: 'renewals',
    },
    {
      label: 'Unpaid Invoices',
      value: stats.pendingInvoices,
      color: 'bg-red-100 text-red-800 border-red-200',
      tab: 'invoices',
    },
    {
      label: 'Pending Requests',
      value: stats.pendingUpdateRequests,
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      tab: 'update-requests',
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage payments, renewals, invoices, update requests, projects, and plan closures
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statCards.map((card) => (
          <button
            key={card.tab}
            onClick={() => setActiveTab(card.tab)}
            className={`rounded-lg border p-4 text-left transition-shadow hover:shadow-md cursor-pointer ${card.color}`}
          >
            <p className="text-sm font-medium">{card.label}</p>
            <p className="text-2xl font-bold mt-1">
              {statsLoading ? '...' : card.value}
            </p>
            <p className="text-xs mt-1 opacity-70">Click to view</p>
          </button>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6 bg-white rounded-t-lg">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-b-lg shadow-sm">
        {activeTab === 'payments' && <AdminPaymentVerification />}
        {activeTab === 'renewals' && <PendingRenewals />}
        {activeTab === 'invoices' && <AdminInvoiceManagement />}
        {activeTab === 'update-requests' && <AdminUpdateRequests />}
        {activeTab === 'projects' && <AdminProjects />}
        {activeTab === 'plan-closure' && <ClosePlanManagement />}
      </div>
    </div>
  );
};

export default AdminCustomerDashboard;

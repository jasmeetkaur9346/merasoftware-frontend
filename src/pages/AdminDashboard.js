import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import useDashboardUpdate from '../hooks/useDashboardUpdate';
import { MdPeople, MdOutlineBarChart, MdPendingActions } from 'react-icons/md';
import {
  fetchWorkspaceActivityCounts,
  getBadgeClasses,
  getDashboardModuleBadgeState,
  getDashboardModuleCount,
  hasDashboardModuleActivity,
} from '../helpers/adminActivitySignals';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    // Users
    totalUsers: 0,
    totalCustomers: 0,
    totalDevelopers: 0,
    totalPartners: 0,
    totalManagers: 0,
    // Orders & Revenue
    totalOrders: 0,
    totalRevenue: 0,
    activeProjects: 0,
    pendingOrderApprovals: 0,
    totalProducts: 0,
    // Pending Actions
    pendingPayments: 0,
    pendingRenewals: 0,
    unpaidInvoices: 0,
    pendingUpdates: 0,
    openTickets: 0,
    pendingWithdrawals: 0,
  });
  const [activitySummary, setActivitySummary] = useState({ clients: [], clientMap: {}, moduleTotals: {} });

  const getLatestTimestamp = (items = [], fields = ['updatedAt', 'createdAt']) =>
    items.reduce((latest, item) => {
      for (const field of fields) {
        const value = item?.[field];
        const timestamp = value ? new Date(value).getTime() : 0;
        if (timestamp) {
          return Math.max(latest, timestamp);
        }
      }
      return latest;
    }, 0);

  useEffect(() => {
    const fetchAllStats = async () => {
      setLoading(true);
      try {
        const statsRequests = await Promise.allSettled([
          fetch(SummaryApi.allUser.url, { method: SummaryApi.allUser.method, credentials: 'include' }),
          fetch(SummaryApi.allDevelopers.url, { method: SummaryApi.allDevelopers.method, credentials: 'include' }),
          fetch(SummaryApi.allOrder.url, { method: SummaryApi.allOrder.method, credentials: 'include' }),
          fetch(SummaryApi.invoices.getInvoiceStatistics.url, { method: SummaryApi.invoices.getInvoiceStatistics.method, credentials: 'include', headers: { 'Content-Type': 'application/json' } }),
          fetch(SummaryApi.adminProjects.url, { method: SummaryApi.adminProjects.method, credentials: 'include' }),
          fetch(SummaryApi.pendingOrders.url, { method: SummaryApi.pendingOrders.method, credentials: 'include' }),
          fetch(SummaryApi.getAllProducts.url, { method: SummaryApi.getAllProducts.method, credentials: 'include' }),
          fetch(SummaryApi.wallet.pendingTransactions.url, { method: SummaryApi.wallet.pendingTransactions.method, credentials: 'include' }),
          fetch(SummaryApi.getPendingRenewals.url, { method: SummaryApi.getPendingRenewals.method, credentials: 'include' }),
          fetch(SummaryApi.adminUpdateRequests.url, { method: SummaryApi.adminUpdateRequests.method, credentials: 'include' }),
          fetch(SummaryApi.getAllTickets.url, { method: SummaryApi.getAllTickets.method, credentials: 'include' }),
          fetch(SummaryApi.getAllWithdrawalRequests.url, { method: SummaryApi.getAllWithdrawalRequests.method, credentials: 'include' }),
        ]);
        const workspaceActivity = await fetchWorkspaceActivityCounts().catch(() => ({ clients: [], clientMap: {}, moduleTotals: {} }));

        const parse = async (result) => {
          if (result.status === 'fulfilled') {
            try {
              const json = await result.value.json();
              return json.success ? (json.data || json.stats || []) : [];
            } catch { return []; }
          }
          return [];
        };

        const [
          usersData, developersData, ordersData, invoiceStats,
          projectsData, pendingOrdersData, productsData,
          pendingPaymentsData, pendingRenewalsData,
          updatesData, ticketsData, withdrawalsData,
        ] = await Promise.all(statsRequests.map(parse));

        // Users breakdown
        const users = Array.isArray(usersData) ? usersData : [];
        const totalCustomers = users.filter(u => u.roles?.includes('customer')).length;
        const totalPartners = users.filter(u => u.roles?.includes('partner')).length;
        const totalManagers = users.filter(u => u.roles?.includes('manager')).length;

        // Projects
        const projects = Array.isArray(projectsData) ? projectsData : [];
        const activeProjects = projects.filter(p => (p.projectProgress || 0) < 100).length;

        // Invoice stats — object response
        const invoiceStatsObj = Array.isArray(invoiceStats) ? {} : (invoiceStats || {});
        const totalRevenue = invoiceStatsObj.totalRevenue || invoiceStatsObj.paidAmount || 0;
        const unpaidInvoices = invoiceStatsObj.pendingCount || invoiceStatsObj.unpaidCount || 0;

        // Pending updates
        const updates = Array.isArray(updatesData) ? updatesData : [];
        const pendingUpdates = updates.filter(u => u.status === 'pending').length;

        // Open tickets
        const tickets = Array.isArray(ticketsData) ? ticketsData : [];
        const openTickets = tickets.filter(t => t.status !== 'closed').length;

        // Pending withdrawals
        const withdrawals = Array.isArray(withdrawalsData) ? withdrawalsData : [];
        const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

        setActivitySummary(workspaceActivity);

        setStats({
          totalUsers: users.length,
          totalCustomers,
          totalDevelopers: Array.isArray(developersData) ? developersData.length : 0,
          totalPartners,
          totalManagers,
          totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
          totalRevenue,
          activeProjects,
          pendingOrderApprovals: Array.isArray(pendingOrdersData) ? pendingOrdersData.length : 0,
          totalProducts: Array.isArray(productsData) ? productsData.length : 0,
          pendingPayments: Array.isArray(pendingPaymentsData) ? pendingPaymentsData.length : 0,
          pendingRenewals: Array.isArray(pendingRenewalsData) ? pendingRenewalsData.length : 0,
          unpaidInvoices,
          pendingUpdates,
          openTickets,
          pendingWithdrawals,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllStats();
  }, []);

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);

  const val = (v) => loading ? '...' : v;

  // Listen for dashboard updates from other pages
  const handleDashboardUpdate = () => {
    const fetchAllStats = async () => {
      setLoading(true);
      try {
        const statsRequests = await Promise.allSettled([
          fetch(SummaryApi.allUser.url, { method: SummaryApi.allUser.method, credentials: 'include' }),
          fetch(SummaryApi.allDevelopers.url, { method: SummaryApi.allDevelopers.method, credentials: 'include' }),
          fetch(SummaryApi.allOrder.url, { method: SummaryApi.allOrder.method, credentials: 'include' }),
          fetch(SummaryApi.invoices.getInvoiceStatistics.url, { method: SummaryApi.invoices.getInvoiceStatistics.method, credentials: 'include', headers: { 'Content-Type': 'application/json' } }),
          fetch(SummaryApi.adminProjects.url, { method: SummaryApi.adminProjects.method, credentials: 'include' }),
          fetch(SummaryApi.pendingOrders.url, { method: SummaryApi.pendingOrders.method, credentials: 'include' }),
          fetch(SummaryApi.getAllProducts.url, { method: SummaryApi.getAllProducts.method, credentials: 'include' }),
          fetch(SummaryApi.wallet.pendingTransactions.url, { method: SummaryApi.wallet.pendingTransactions.method, credentials: 'include' }),
          fetch(SummaryApi.getPendingRenewals.url, { method: SummaryApi.getPendingRenewals.method, credentials: 'include' }),
          fetch(SummaryApi.adminUpdateRequests.url, { method: SummaryApi.adminUpdateRequests.method, credentials: 'include' }),
          fetch(SummaryApi.getAllTickets.url, { method: SummaryApi.getAllTickets.method, credentials: 'include' }),
          fetch(SummaryApi.getAllWithdrawalRequests.url, { method: SummaryApi.getAllWithdrawalRequests.method, credentials: 'include' }),
        ]);
        const workspaceActivity = await fetchWorkspaceActivityCounts().catch(() => ({ clients: [], clientMap: {}, moduleTotals: {} }));

        const parse = async (result) => {
          if (result.status === 'fulfilled') {
            try {
              const json = await result.value.json();
              return json.success ? (json.data || json.stats || []) : [];
            } catch { return []; }
          }
          return [];
        };

        const [
          usersData, developersData, ordersData, invoiceStats,
          projectsData, pendingOrdersData, productsData,
          pendingPaymentsData, pendingRenewalsData,
          updatesData, ticketsData, withdrawalsData,
        ] = await Promise.all(statsRequests.map(parse));

        const users = Array.isArray(usersData) ? usersData : [];
        const totalCustomers = users.filter(u => u.roles?.includes('customer')).length;
        const totalPartners = users.filter(u => u.roles?.includes('partner')).length;
        const totalManagers = users.filter(u => u.roles?.includes('manager')).length;

        const projects = Array.isArray(projectsData) ? projectsData : [];
        const activeProjects = projects.filter(p => (p.projectProgress || 0) < 100).length;

        const invoiceStatsObj = Array.isArray(invoiceStats) ? {} : (invoiceStats || {});
        const totalRevenue = invoiceStatsObj.totalRevenue || invoiceStatsObj.paidAmount || 0;
        const unpaidInvoices = invoiceStatsObj.pendingCount || invoiceStatsObj.unpaidCount || 0;

        const updates = Array.isArray(updatesData) ? updatesData : [];
        const pendingUpdates = updates.filter(u => u.status === 'pending').length;

        const tickets = Array.isArray(ticketsData) ? ticketsData : [];
        const openTickets = tickets.filter(t => t.status !== 'closed').length;

        const withdrawals = Array.isArray(withdrawalsData) ? withdrawalsData : [];
        const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending').length;

        setActivitySummary(workspaceActivity);

        setStats({
          totalUsers: users.length,
          totalCustomers,
          totalDevelopers: Array.isArray(developersData) ? developersData.length : 0,
          totalPartners,
          totalManagers,
          totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
          totalRevenue,
          activeProjects,
          pendingOrderApprovals: Array.isArray(pendingOrdersData) ? pendingOrdersData.length : 0,
          totalProducts: Array.isArray(productsData) ? productsData.length : 0,
          pendingPayments: Array.isArray(pendingPaymentsData) ? pendingPaymentsData.length : 0,
          pendingRenewals: Array.isArray(pendingRenewalsData) ? pendingRenewalsData.length : 0,
          unpaidInvoices,
          pendingUpdates,
          openTickets,
          pendingWithdrawals,
        });
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllStats();
  };

  useDashboardUpdate(handleDashboardUpdate);

  const openDashboardSection = (to) => {
    if (to) {
      navigate(to);
    }
  };

  const StatCard = ({ label, value, color, textColor, to, activityKey }) => (
    <div
      onClick={() => openDashboardSection(to)}
      className={`${color} rounded-lg p-5 shadow-sm ${to ? 'cursor-pointer hover:opacity-90 hover:shadow-md transition-all' : ''}`}
    >
      <div className="flex items-center gap-2">
        <p className={`text-sm font-medium ${textColor} opacity-80`}>{label}</p>
        {activityKey && hasDashboardModuleActivity(activitySummary, activityKey) && (
          <span className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getBadgeClasses(getDashboardModuleBadgeState(activitySummary, activityKey))}`}>
            {getDashboardModuleCount(activitySummary, activityKey)}
          </span>
        )}
      </div>
      <p className={`text-2xl font-bold ${textColor} mt-2`}>{value}</p>
      {to && <p className={`text-xs ${textColor} opacity-60 mt-2`}>Click to view →</p>}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Website ka complete overview</p>
      </div>

      {/* Section 1: Users & Business */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <MdPeople className="text-xl text-gray-600" />
          <span>Users & Business</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Users"    value={val(stats.totalUsers)}      color="bg-blue-500"   textColor="text-white" to="/admin-panel/all-users" />
          <StatCard label="Customers"      value={val(stats.totalCustomers)}   color="bg-blue-400"   textColor="text-white" to="/admin-panel/clients-services" />
          <StatCard label="Developers"     value={val(stats.totalDevelopers)}  color="bg-indigo-500" textColor="text-white" to="/admin-panel/developers" />
          <StatCard label="Partners"       value={val(stats.totalPartners)}    color="bg-indigo-400" textColor="text-white" to="/admin-panel/partners" />
          <StatCard label="Managers"       value={val(stats.totalManagers)}    color="bg-blue-600"   textColor="text-white" to="/admin-panel/managers" />
        </div>
      </div>

      {/* Section 2: Orders & Revenue */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <MdOutlineBarChart className="text-xl text-gray-600" />
          <span>Orders & Revenue</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard label="Total Orders"      value={val(stats.totalOrders)}                    color="bg-green-500"   textColor="text-white" to="/admin-panel/all-orders" />
          <StatCard label="Total Revenue"     value={val(formatCurrency(stats.totalRevenue))}   color="bg-emerald-600" textColor="text-white" to="/admin-panel/invoice-management" />
          <StatCard label="Active Projects"   value={val(stats.activeProjects)}                 color="bg-teal-500"    textColor="text-white" to="/admin-panel/projects" />
          <StatCard label="Pending Approvals" value={val(stats.pendingOrderApprovals)}          color="bg-green-400"   textColor="text-white" to="/admin-panel/order-approval" />
          <StatCard label="Total Products"    value={val(stats.totalProducts)}                  color="bg-teal-400"    textColor="text-white" to="/admin-panel/all-products" />
        </div>
      </div>

      {/* Section 3: Pending Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <MdPendingActions className="text-xl text-gray-600" />
          <span>Pending Actions</span>
          <span className="text-xs font-normal text-gray-500 ml-1">(Admin attention chahiye)</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatCard label="Pending Payments"    value={val(stats.pendingPayments)}    color={stats.pendingPayments > 0 && !loading ? 'bg-yellow-500' : 'bg-yellow-100'}   textColor={stats.pendingPayments > 0 && !loading ? 'text-white' : 'text-yellow-800'} to="/admin-panel/payment-verification" activityKey="payments" />
          <StatCard label="Pending Renewals"    value={val(stats.pendingRenewals)}    color={stats.pendingRenewals > 0 && !loading ? 'bg-orange-500' : 'bg-orange-100'}   textColor={stats.pendingRenewals > 0 && !loading ? 'text-white' : 'text-orange-800'} to="/admin-panel/pending-renewals" activityKey="renewals" />
          <StatCard label="Unpaid Invoices"     value={val(stats.unpaidInvoices)}     color={stats.unpaidInvoices > 0 && !loading ? 'bg-red-500' : 'bg-red-100'}          textColor={stats.unpaidInvoices > 0 && !loading ? 'text-white' : 'text-red-800'} to="/admin-panel/invoice-management" activityKey="invoices" />
          <StatCard label="Pending Updates"     value={val(stats.pendingUpdates)}     color={stats.pendingUpdates > 0 && !loading ? 'bg-purple-500' : 'bg-purple-100'}    textColor={stats.pendingUpdates > 0 && !loading ? 'text-white' : 'text-purple-800'} to="/admin-panel/update-requests" activityKey="updates" />
          <StatCard label="Open Tickets"        value={val(stats.openTickets)}        color={stats.openTickets > 0 && !loading ? 'bg-pink-500' : 'bg-pink-100'}           textColor={stats.openTickets > 0 && !loading ? 'text-white' : 'text-pink-800'} to="/admin-panel/admin-tickets" activityKey="tickets" />
          <StatCard label="Pending Withdrawals" value={val(stats.pendingWithdrawals)} color={stats.pendingWithdrawals > 0 && !loading ? 'bg-amber-600' : 'bg-amber-100'}  textColor={stats.pendingWithdrawals > 0 && !loading ? 'text-white' : 'text-amber-800'} to="/admin-panel/partner-withdrawal-requests" activityKey="withdrawals" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

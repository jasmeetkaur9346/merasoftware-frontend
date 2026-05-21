import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Shield, UserRound } from 'lucide-react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import AddRoleToUserModal from '../components/AddRoleToUserModal';
import EditDeveloper from '../components/EditDeveloper';
import EditUserBasicModal from '../components/EditUserBasicModal';
import {
  fetchWorkspaceActivityCounts,
  getBadgeClasses,
  getClientActiveCount,
  getClientBadgeState,
  getModuleCount,
  getModuleBadgeState,
  getModuleItems,
  hasClientUnreadActivity,
  hasModuleUnreadActivity,
} from '../helpers/adminActivitySignals';

const roleTheme = {
  customer: 'bg-blue-100 text-blue-800',
  developer: 'bg-indigo-100 text-indigo-800',
  partner: 'bg-emerald-100 text-emerald-800',
  manager: 'bg-pink-100 text-pink-800',
  admin: 'bg-slate-100 text-slate-800',
};

const UserWorkspace = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [developerProfile, setDeveloperProfile] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openEditDeveloper, setOpenEditDeveloper] = useState(false);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [activityCounts, setActivityCounts] = useState(null);
  const [allData, setAllData] = useState({
    orders: [],
    renewals: [],
    transactions: [],
    invoices: [],
    updates: [],
    plans: [],
  });

  const loadWorkspaceActivity = async () => {
    try {
      const response = await fetchWorkspaceActivityCounts();
      setActivityCounts(response.clientMap?.[userId] || null);
    } catch (error) {
      console.error('Error fetching workspace activity counts:', error);
    }
  };

  const loadUserDetails = async () => {
    try {
      setLoadingUser(true);
      const [usersResponse, developerResponse] = await Promise.all([
        fetch(SummaryApi.allUser.url, {
          method: SummaryApi.allUser.method,
          credentials: 'include',
        }),
        fetch(SummaryApi.allDevelopers.url, {
          method: SummaryApi.allDevelopers.method,
          credentials: 'include',
        }),
      ]);

      const usersResult = await usersResponse.json();
      const developerResult = await developerResponse.json();

      if (!usersResult.success) {
        toast.error(usersResult.message || 'Failed to load user');
        return;
      }

      const selectedUser = usersResult.data.find((item) => item._id === userId) || null;
      setUser(selectedUser);

      if (selectedUser && developerResult.success) {
        const matchedDeveloper = (developerResult.data || []).find(
          (profile) => profile.email?.toLowerCase() === selectedUser.email?.toLowerCase()
        );
        setDeveloperProfile(matchedDeveloper || null);
      } else {
        setDeveloperProfile(null);
      }
    } catch (error) {
      console.error('Error fetching workspace user:', error);
      toast.error('Error loading user workspace');
    } finally {
      setLoadingUser(false);
    }
  };

  const loadWorkspaceData = async () => {
    try {
      setLoadingData(true);
      const requests = await Promise.allSettled([
        fetch(SummaryApi.ordersList.url, { method: SummaryApi.ordersList.method, credentials: 'include' }),
        fetch(SummaryApi.getPendingRenewals.url, { method: SummaryApi.getPendingRenewals.method, credentials: 'include' }),
        fetch(SummaryApi.wallet.pendingTransactions.url, { method: SummaryApi.wallet.pendingTransactions.method, credentials: 'include' }),
        fetch(SummaryApi.wallet.adminTransactionHistory.url, { method: SummaryApi.wallet.adminTransactionHistory.method, credentials: 'include' }),
        fetch(SummaryApi.invoices.getAllInvoices.url, { method: SummaryApi.invoices.getAllInvoices.method, credentials: 'include' }),
        fetch(SummaryApi.adminUpdateRequests.url, { method: SummaryApi.adminUpdateRequests.method, credentials: 'include' }),
        fetch(SummaryApi.getUpdatePlans.url, { method: SummaryApi.getUpdatePlans.method, credentials: 'include' }),
      ]);

      const parseResult = async (result) => {
        if (result.status !== 'fulfilled') return [];
        const json = await result.value.json();
        return json.success ? (json.data || []) : [];
      };

      const [
        ordersData,
        renewalsData,
        pendingTransactions,
        transactionHistory,
        invoicesData,
        updatesData,
        plansData,
      ] = await Promise.all(requests.map(parseResult));

      setAllData({
        orders: ordersData.filter((item) => item.userId?._id === userId),
        renewals: renewalsData.filter((item) => item.user?._id === userId || item.userId?._id === userId),
        transactions: [...pendingTransactions, ...transactionHistory].filter((item) => item.userId?._id === userId),
        invoices: invoicesData.filter((item) => item.userId?._id === userId),
        updates: updatesData.filter((item) => item.userId?._id === userId),
        plans: plansData.filter((item) => item.userId?._id === userId),
      });
    } catch (error) {
      console.error('Error fetching workspace data:', error);
      toast.error('Error loading workspace modules');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadUserDetails();
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      loadWorkspaceData();
      loadWorkspaceActivity();
    }
  }, [userId]);

  const tabs = useMemo(() => {
    if (!user) return [];

    const dynamicTabs = [{ id: 'overview', label: 'Overview' }];

    if (user.roles?.includes('customer')) {
      dynamicTabs.push(
        { id: 'orders', label: 'Orders & Projects' },
        { id: 'renewals', label: 'Renewals' },
        { id: 'payments', label: 'Payments & Wallet' },
        { id: 'invoices', label: 'Invoices' },
        { id: 'updates', label: 'Update Requests' },
        { id: 'closure', label: 'Plan Closure' }
      );
    }

    if (user.roles?.includes('developer')) {
      dynamicTabs.push({ id: 'developer', label: 'Developer Profile' });
    }

    if (user.roles?.includes('partner')) {
      dynamicTabs.push({ id: 'partner', label: 'Partner View' });
    }

    if (user.roles?.includes('manager')) {
      dynamicTabs.push({ id: 'manager', label: 'Manager View' });
    }

    if (user.roles?.includes('admin')) {
      dynamicTabs.push({ id: 'admin', label: 'Admin View' });
    }

    return dynamicTabs;
  }, [user]);

  useEffect(() => {
    if (tabs.length && !tabs.some((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [activeTab, tabs]);

  const formatCurrency = (num) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num || 0);

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN');
  };

  const handleBasicProfileUpdate = async (payload) => {
    try {
      setSavingProfile(true);
      const response = await fetch(SummaryApi.updateUser.url, {
        method: SummaryApi.updateUser.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          userId: user._id,
          name: payload.name,
          email: payload.email,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        toast.error(result.message || 'Failed to update profile');
        return;
      }

      setUser((prev) => ({
        ...prev,
        name: payload.name,
        email: payload.email,
      }));
      toast.success('Profile updated successfully');
      setOpenEditProfile(false);
    } catch (error) {
      console.error(error);
      toast.error('Error updating profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const overviewCards = [
    { label: 'Orders', value: allData.orders.length },
    { label: 'Transactions', value: allData.transactions.length },
    { label: 'Update Requests', value: allData.updates.length },
    { label: 'Invoices', value: allData.invoices.length },
  ];

  const renderStatusChip = (value, palette = {}) => {
    const cls = palette[value] || 'bg-slate-100 text-slate-700';
    return (
      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}>
        {value || 'N/A'}
      </span>
    );
  };

  const getItemActivityState = (moduleKey, itemId) => {
    const match = getModuleItems(activityCounts, moduleKey).find((item) => item.id === String(itemId));
    return match?.state || 'clear';
  };

  const renderActivityDot = (moduleKey, itemId) => {
    const state = getItemActivityState(moduleKey, itemId);
    if (state === 'attention') return <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />;
    if (state === 'inProgress') return <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-400" />;
    return null;
  };

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {overviewCards.map((item) => (
          <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Profile Summary</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Email</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{user?.email || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Phone</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{user?.phone || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Joined</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{formatDate(user?.createdAt)}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{user?.status || 'Active'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Role Snapshot</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {(user?.roles || []).map((role) => (
              <span
                key={role}
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleTheme[role] || 'bg-slate-100 text-slate-700'}`}
              >
                {role}
              </span>
            ))}
          </div>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            <p>Customer modules are shown only when the user has the `customer` role.</p>
            <p>The developer profile tab is available only when the user has the `developer` role.</p>
            <p>Access management is currently additive; remove and pause actions are not available yet.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const OrdersTab = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {allData.orders.length === 0 ? (
        <div className="p-6 text-center text-slate-500">No orders found for this user</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Product</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Progress</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allData.orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      {renderActivityDot('orders', order._id)}
                      <span>{order._id?.slice(-8)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.productId?.serviceName || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {renderStatusChip(
                      order.orderVisibility === 'pending-approval'
                        ? 'Processing'
                        : order.orderVisibility === 'payment-rejected'
                          ? 'Rejected'
                          : (order.projectProgress || 0) >= 100
                            ? 'Completed'
                            : 'In Progress',
                      {
                        Processing: 'bg-amber-100 text-amber-800',
                        Rejected: 'bg-rose-100 text-rose-800',
                        Completed: 'bg-emerald-100 text-emerald-800',
                        'In Progress': 'bg-blue-100 text-blue-800',
                      }
                    )}
                  </td>
                  <td className="px-6 py-4">{order.projectProgress || 0}%</td>
                  <td className="px-6 py-4">{formatCurrency(order.totalPrice || order.price || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const RenewalsTab = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {allData.renewals.length === 0 ? (
        <div className="p-6 text-center text-slate-500">No renewals found for this user</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Renewal ID</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Plan</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allData.renewals.map((renewal) => (
                <tr key={renewal._id}>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      {renderActivityDot('renewals', renewal._id)}
                      <span>{renewal._id?.slice(-8)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{renewal.planDetails?.planName || 'N/A'}</td>
                  <td className="px-6 py-4">{formatCurrency(renewal.amount || 0)}</td>
                  <td className="px-6 py-4">
                    {renderStatusChip(renewal.status, {
                      pending: 'bg-amber-100 text-amber-800',
                      approved: 'bg-emerald-100 text-emerald-800',
                      rejected: 'bg-rose-100 text-rose-800',
                    })}
                  </td>
                  <td className="px-6 py-4">{formatDate(renewal.submittedAt || renewal.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const PaymentsTab = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {allData.transactions.length === 0 ? (
        <div className="p-6 text-center text-slate-500">No transactions found for this user</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Type</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Method</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allData.transactions.map((transaction) => {
                const displayStatus = transaction.paymentStatus || transaction.status || 'unknown';
                return (
                  <tr key={transaction._id}>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2">
                        {renderActivityDot('payments', transaction._id)}
                        <span>{formatDate(transaction.date || transaction.createdAt)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">{transaction.type || 'N/A'}</td>
                    <td className="px-6 py-4">{formatCurrency(transaction.amount || 0)}</td>
                    <td className="px-6 py-4">
                      {renderStatusChip(displayStatus, {
                        pending: 'bg-amber-100 text-amber-800',
                        'pending-approval': 'bg-amber-100 text-amber-800',
                        completed: 'bg-emerald-100 text-emerald-800',
                        approved: 'bg-emerald-100 text-emerald-800',
                        rejected: 'bg-rose-100 text-rose-800',
                      })}
                    </td>
                    <td className="px-6 py-4">{transaction.paymentMethod || 'N/A'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const InvoicesTab = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {allData.invoices.length === 0 ? (
        <div className="p-6 text-center text-slate-500">No invoices found for this user</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Invoice #</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Amount</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Due Date</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Issued Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allData.invoices.map((invoice) => (
                <tr key={invoice._id}>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      {renderActivityDot('invoices', invoice._id)}
                      <span>{invoice.invoiceNumber || invoice._id?.slice(-8)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{formatCurrency(invoice.amount || 0)}</td>
                  <td className="px-6 py-4">
                    {renderStatusChip(invoice.status, {
                      paid: 'bg-emerald-100 text-emerald-800',
                      unpaid: 'bg-amber-100 text-amber-800',
                      overdue: 'bg-rose-100 text-rose-800',
                    })}
                  </td>
                  <td className="px-6 py-4">{formatDate(invoice.dueDate)}</td>
                  <td className="px-6 py-4">{formatDate(invoice.invoiceDate || invoice.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const UpdatesTab = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {allData.updates.length === 0 ? (
        <div className="p-6 text-center text-slate-500">No update requests found for this user</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Update ID</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Plan</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Assigned Dev</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allData.updates.map((update) => (
                <tr key={update._id}>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      {renderActivityDot('updates', update._id)}
                      <span>{update._id?.slice(-8)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{update.updatePlanId?.productId?.serviceName || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {renderStatusChip(update.status, {
                      pending: 'bg-amber-100 text-amber-800',
                      in_progress: 'bg-blue-100 text-blue-800',
                      completed: 'bg-emerald-100 text-emerald-800',
                      rejected: 'bg-rose-100 text-rose-800',
                    })}
                  </td>
                  <td className="px-6 py-4">{update.assignedDeveloper?.name || 'Unassigned'}</td>
                  <td className="px-6 py-4">{formatDate(update.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const ClosureTab = () => (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {allData.plans.length === 0 ? (
        <div className="p-6 text-center text-slate-500">No plans found for this user</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Plan ID</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Product</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Updates Used</th>
                <th className="px-6 py-3 text-left font-semibold text-slate-700">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allData.plans.map((plan) => (
                <tr key={plan._id}>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-2">
                      {renderActivityDot('closure', plan._id)}
                      <span>{plan._id?.slice(-8)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4">{plan.productId?.serviceName || 'N/A'}</td>
                  <td className="px-6 py-4">
                    {renderStatusChip(plan.planStatus || 'active', {
                      active: 'bg-emerald-100 text-emerald-800',
                      closed: 'bg-slate-100 text-slate-700',
                    })}
                  </td>
                  <td className="px-6 py-4">{plan.updatesUsed || 0}</td>
                  <td className="px-6 py-4">{formatDate(plan.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const DeveloperTab = () => (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Developer Profile</h3>
          {developerProfile && (
            <button
              type="button"
              onClick={() => setOpenEditDeveloper(true)}
              className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
            >
              Edit Developer Profile
            </button>
          )}
        </div>

        {developerProfile ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Employee ID</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{developerProfile.employeeId || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Status</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{developerProfile.status || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Department</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{developerProfile.department || 'N/A'}</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Designation</p>
              <p className="mt-2 text-sm font-medium text-slate-900">{developerProfile.designation || 'N/A'}</p>
            </div>
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
            This user has the developer role, but no linked developer profile was found yet.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Developer Activity Snapshot</h3>
        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Assigned Update Requests</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {allData.updates.filter((update) => update.assignedDeveloper?.email === user?.email).length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Role Combination</p>
            <p className="mt-2 text-sm font-medium text-slate-900">{(user?.roles || []).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const GenericRolePanel = ({ title, description }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );

  if (loadingUser) {
    return <div className="p-6 text-center text-slate-600">Loading user workspace...</div>;
  }

  if (!user) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          User not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-6">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <UserRound className="text-slate-500" size={32} />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(user.roles || []).map((role) => (
                    <span
                      key={role}
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${roleTheme[role] || 'bg-slate-100 text-slate-700'}`}
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-2"><Mail size={16} /> {user.email}</span>
                  <span className="inline-flex items-center gap-2"><Phone size={16} /> {user.phone || 'N/A'}</span>
                  <span className="inline-flex items-center gap-2"><Shield size={16} /> {user.status || 'Active'}</span>
                  {user.roles?.includes('customer') && hasClientUnreadActivity(activityCounts) && (
                    <span className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getBadgeClasses(getClientBadgeState(activityCounts))}`}>
                      {getClientActiveCount(activityCounts)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setOpenEditProfile(true)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={() => setOpenRoleModal(true)}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Manage Access
              </button>
              {user.roles?.includes('developer') && developerProfile && (
                <button
                  type="button"
                  onClick={() => setOpenEditDeveloper(true)}
                  className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50"
                >
                  Edit Developer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap gap-2 border-b border-slate-200 bg-slate-50 px-4 py-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-100'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900'
              }`}
              >
              <span className="inline-flex items-center gap-2">
                <span>{tab.label}</span>
                {hasModuleUnreadActivity(activityCounts, tab.id) && (
                  <span className={`inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${getBadgeClasses(getModuleBadgeState(activityCounts, tab.id))}`}>
                    {getModuleCount(activityCounts, tab.id)}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {loadingData ? (
            <div className="py-8 text-center text-slate-500">Loading workspace modules...</div>
          ) : (
            <>
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'renewals' && <RenewalsTab />}
              {activeTab === 'payments' && <PaymentsTab />}
              {activeTab === 'invoices' && <InvoicesTab />}
              {activeTab === 'updates' && <UpdatesTab />}
              {activeTab === 'closure' && <ClosureTab />}
              {activeTab === 'developer' && <DeveloperTab />}
              {activeTab === 'partner' && (
                <GenericRolePanel
                  title="Partner Role View"
                  description="This user also holds the partner role. In this phase, the workspace shell surfaces partner-role visibility clearly so the same user does not need to be managed across multiple screens. Existing partner workflows remain unchanged."
                />
              )}
              {activeTab === 'manager' && (
                <GenericRolePanel
                  title="Manager Role View"
                  description="This user is available with the manager role. The unified shell now exposes manager access visibility on the same user page without removing the existing management screens."
                />
              )}
              {activeTab === 'admin' && (
                <GenericRolePanel
                  title="Admin Role View"
                  description="This user is available with the admin role. The current objective of this unified page is to provide role visibility and a common management shell, while the existing admin business screens continue to run in parallel."
                />
              )}
            </>
          )}
        </div>
      </div>

      {openRoleModal && (
        <AddRoleToUserModal
          userId={user._id}
          onClose={() => setOpenRoleModal(false)}
          callFunc={loadUserDetails}
        />
      )}

      {openEditProfile && (
        <EditUserBasicModal
          user={user}
          loading={savingProfile}
          onClose={() => setOpenEditProfile(false)}
          onSubmit={handleBasicProfileUpdate}
        />
      )}

      {openEditDeveloper && developerProfile && (
        <EditDeveloper
          developerData={developerProfile}
          fetchData={loadUserDetails}
          onClose={() => setOpenEditDeveloper(false)}
        />
      )}
    </div>
  );
};

export default UserWorkspace;

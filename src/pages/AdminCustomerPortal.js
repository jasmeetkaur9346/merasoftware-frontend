import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminCustomerPortal = () => {
  const [approvals, setApprovals] = useState([]);
  const [projects, setProjects] = useState([]);
  const [websiteManagement, setWebsiteManagement] = useState([]);
  const [updateRequests, setUpdateRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [renewals, setRenewals] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        approvalsRes,
        projectsRes,
        websiteRes,
        requestsRes,
        paymentsRes,
        renewalsRes
      ] = await Promise.allSettled([
        fetch(SummaryApi.adminOrdersPage?.url || '/api/admin/orders', {
          credentials: 'include',
        }),
        fetch(SummaryApi.adminProjects?.url || '/api/admin/projects', {
          credentials: 'include',
        }),
        fetch(SummaryApi.getUpdatePlans?.url || '/api/admin/update-plans', {
          credentials: 'include',
        }),
        fetch(SummaryApi.adminUpdateRequests?.url || '/api/admin/update-requests', {
          credentials: 'include',
        }),
        fetch(SummaryApi.wallet?.pendingTransactions?.url || '/api/wallet/pending', {
          method: SummaryApi.wallet?.pendingTransactions?.method || 'GET',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(SummaryApi.getPendingRenewals?.url || '/api/renewals/pending', {
          method: SummaryApi.getPendingRenewals?.method || 'GET',
          credentials: 'include',
        }),
      ]);

      const parseRes = async (settled) => {
        if (settled.status === 'fulfilled') {
          const json = await settled.value.json();
          return json.success ? (json.data || []) : [];
        }
        return [];
      };

      const [appData, projData, webData, reqData, payData, renData] = await Promise.all([
        parseRes(approvalsRes),
        parseRes(projectsRes),
        parseRes(websiteRes),
        parseRes(requestsRes),
        parseRes(paymentsRes),
        parseRes(renewalsRes),
      ]);

      setApprovals(appData.slice(0, 5));
      setProjects(projData.slice(0, 5));
      setWebsiteManagement(webData.slice(0, 5));
      setUpdateRequests(reqData.slice(0, 5));
      setPayments(payData.slice(0, 5));
      setRenewals(renData.slice(0, 5));
    } catch (error) {
      console.error('Error fetching portal data:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ icon, title, count, children, viewAllLink }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{icon}</span>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{title}</h2>
              <p className="text-sm text-gray-600">{count} pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {count === 0 ? (
          <p className="text-center text-gray-500 py-8">No {title.toLowerCase()} pending</p>
        ) : (
          <>
            <div className="space-y-3 mb-4">
              {children}
            </div>
            {viewAllLink && (
              <Link
                to={viewAllLink}
                className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium mt-4"
              >
                View All {title} →
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customer Management Portal</h1>
        <p className="text-gray-600 mt-2">
          Unified view of all customer-related operations and requests
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* 1. APPROVALS SECTION */}
          <Section
            icon="✅"
            title="Order Approvals"
            count={approvals.length}
            viewAllLink="/admin-panel/order-approval"
          >
            {approvals.map((order, idx) => (
              <div key={idx} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">Order #{order._id?.slice(-6)}</p>
                    <p className="text-sm text-gray-600">
                      Customer: {order.userId?.name || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Amount: {displayINRCurrency(order.totalAmount || 0)}
                    </p>
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                    Approve
                  </button>
                </div>
              </div>
            ))}
          </Section>

          {/* 2. WEBSITE PROJECTS SECTION */}
          <Section
            icon="🏗️"
            title="Website Projects"
            count={projects.length}
            viewAllLink="/admin-panel/projects"
          >
            {projects.map((project, idx) => (
              <div key={idx} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {project.productId?.serviceName || 'Project'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer: {project.userId?.name || 'N/A'}
                    </p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${
                            project.checkpoints?.filter((c) => c.completed).length > 0
                              ? ((project.checkpoints?.filter((c) => c.completed).length /
                                  project.checkpoints?.length) *
                                  100) |
                                0
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Developer:{' '}
                      {project.assignedDeveloper?.name || 'Not Assigned'}
                    </p>
                  </div>
                  <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded text-sm ml-4">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </Section>

          {/* 3. WEBSITE MANAGEMENT SECTION */}
          <Section
            icon="🌐"
            title="Website Management"
            count={websiteManagement.length}
            viewAllLink="/admin-panel/website-updates"
          >
            {websiteManagement.map((plan, idx) => (
              <div key={idx} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {plan.productId?.serviceName || 'Plan'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer: {plan.userId?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Updates: {plan.updatesUsed || 0}/
                      {plan.productId?.updates || 'Unlimited'} | Plan Status:{' '}
                      <span
                        className={`font-semibold ${
                          plan.planStatus === 'active'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {plan.planStatus}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Section>

          {/* 4. UPDATE REQUESTS SECTION */}
          <Section
            icon="📝"
            title="Update Requests"
            count={updateRequests.length}
            viewAllLink="/admin-panel/update-requests"
          >
            {updateRequests.map((request, idx) => (
              <div key={idx} className="border border-gray-200 rounded p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {request.title || 'Update Request'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Customer: {request.userId?.name || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      Files: {request.files?.length || 0} | Status:{' '}
                      <span className="font-semibold text-orange-600">
                        {request.status || 'Pending'}
                      </span>
                    </p>
                  </div>
                  <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded text-sm ml-4">
                    View
                  </button>
                </div>
              </div>
            ))}
          </Section>

          {/* 5. PAYMENTS & RENEWALS SECTION */}
          <Section
            icon="💳"
            title="Payments & Renewals"
            count={payments.length + renewals.length}
            viewAllLink="/admin-panel/payment-verification"
          >
            {payments.length > 0 && (
              <>
                <p className="text-sm font-semibold text-gray-700 mb-2">Pending Payments:</p>
                {payments.map((payment, idx) => (
                  <div key={`pay-${idx}`} className="border border-yellow-200 rounded p-3 hover:bg-yellow-50 bg-yellow-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {displayINRCurrency(payment.amount || 0)}
                        </p>
                        <p className="text-xs text-gray-600">
                          {payment.transactionType || 'Transaction'}
                        </p>
                      </div>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs">
                        Verify
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {renewals.length > 0 && (
              <>
                <p className="text-sm font-semibold text-gray-700 mb-2 mt-4">Pending Renewals:</p>
                {renewals.map((renewal, idx) => (
                  <div key={`ren-${idx}`} className="border border-blue-200 rounded p-3 hover:bg-blue-50 bg-blue-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {renewal.planName || 'Renewal'}
                        </p>
                        <p className="text-xs text-gray-600">
                          {displayINRCurrency(renewal.amount || 0)}
                        </p>
                      </div>
                      <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs">
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </Section>
        </>
      )}
    </div>
  );
};

export default AdminCustomerPortal;

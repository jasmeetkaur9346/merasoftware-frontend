import React, { useEffect, useState } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import UpdateRequestWorkspaceModal from '../components/admin/UpdateRequestWorkspaceModal';

const AdminUpdateRequests = () => {
  const [updateRequests, setUpdateRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [viewMode, setViewMode] = useState('list');

  const fetchUpdateRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.adminUpdateRequests.url, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setUpdateRequests(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch update requests');
      }
    } catch (error) {
      console.error('Error fetching update requests:', error);
      toast.error('Failed to fetch update requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await fetch(SummaryApi.allDevelopers.url, { credentials: 'include' });
      const data = await response.json();
      if (data.success) {
        setDevelopers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
    }
  };

  useEffect(() => {
    fetchUpdateRequests();
    fetchDevelopers();
  }, []);

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const StatusBadge = ({ status }) => {
    let bgColor; let textColor; let statusText;
    switch (status) {
      case 'pending': bgColor = 'bg-yellow-100'; textColor = 'text-yellow-800'; statusText = 'Pending'; break;
      case 'in_progress': bgColor = 'bg-blue-100'; textColor = 'text-blue-800'; statusText = 'In Progress'; break;
      case 'completed': bgColor = 'bg-green-100'; textColor = 'text-green-800'; statusText = 'Completed'; break;
      case 'rejected': bgColor = 'bg-red-100'; textColor = 'text-red-800'; statusText = 'Rejected'; break;
      default: bgColor = 'bg-gray-100'; textColor = 'text-gray-800'; statusText = status;
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
        {status === 'pending' && <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />}
        <span>{statusText}</span>
      </span>
    );
  };

  const getRequestTimestamp = (request) => {
    const value = request?.updatedAt || request?.createdAt;
    const timestamp = value ? new Date(value).getTime() : 0;
    return Number.isFinite(timestamp) ? timestamp : 0;
  };

  const getStatusPriority = (status) => ({ pending: 1, in_progress: 2, rejected: 3, completed: 4 }[status] || 5);

  const getCardBorderClass = (status) => {
    switch (status) {
      case 'pending': return 'border-red-500';
      case 'in_progress': return 'border-yellow-500';
      case 'completed': return 'border-green-500';
      case 'rejected': return 'border-red-500';
      default: return 'border-blue-500';
    }
  };

  const sortedUpdateRequests = [...updateRequests].sort((left, right) => {
    const priorityDiff = getStatusPriority(left.status) - getStatusPriority(right.status);
    if (priorityDiff !== 0) return priorityDiff;
    return getRequestTimestamp(right) - getRequestTimestamp(left);
  });

  const refreshRequest = async (requestId) => {
    try {
      const response = await fetch(SummaryApi.adminUpdateRequests.url, { credentials: 'include' });
      const data = await response.json();
      if (!data.success) return null;
      const latestRequests = data.data || [];
      setUpdateRequests(latestRequests);
      const matchedRequest = latestRequests.find((item) => item._id === requestId) || null;
      setSelectedRequest(matchedRequest);
      return matchedRequest;
    } catch (error) {
      console.error('Error refreshing update request:', error);
      return null;
    }
  };

  if (loading) {
    return <div className="fixed inset-0 flex items-center justify-center"><TriangleMazeLoader /></div>;
  }

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Website Update Requests</h2>
          <p className="mt-2 text-gray-600">Track client requests and open any item to manage it in one workspace.</p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button type="button" onClick={() => setViewMode('list')} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>List View</button>
          <button type="button" onClick={() => setViewMode('cards')} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${viewMode === 'cards' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>Card View</button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-red-100 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-gray-500">Pending Requests</p><p className="mt-1 text-2xl font-bold text-red-600">{sortedUpdateRequests.filter((request) => request.status === 'pending').length}</p></div>
        <div className="rounded-xl border border-yellow-100 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-gray-500">In Progress</p><p className="mt-1 text-2xl font-bold text-yellow-600">{sortedUpdateRequests.filter((request) => request.status === 'in_progress').length}</p></div>
        <div className="rounded-xl border border-green-100 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-gray-500">Completed</p><p className="mt-1 text-2xl font-bold text-green-600">{sortedUpdateRequests.filter((request) => request.status === 'completed').length}</p></div>
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"><p className="text-sm font-medium text-gray-500">Total Requests</p><p className="mt-1 text-2xl font-bold text-gray-800">{sortedUpdateRequests.length}</p></div>
      </div>

      {viewMode === 'list' ? (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-semibold">Client</th>
                  <th className="px-6 py-4 font-semibold">Plan</th>
                  <th className="px-6 py-4 font-semibold">Files</th>
                  <th className="px-6 py-4 font-semibold">Developer</th>
                  <th className="px-6 py-4 font-semibold">Submitted</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sortedUpdateRequests.map((request) => (
                  <tr key={request._id} onClick={() => setSelectedRequest(request)} className="cursor-pointer transition hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-gray-800">{request.userId?.name || 'Unknown Client'}</td>
                    <td className="px-6 py-4 text-gray-600">{request.updatePlanId?.productId?.serviceName || 'N/A'}</td>
                    <td className="px-6 py-4 text-gray-600">{request.files?.length || 0}</td>
                    <td className="px-6 py-4 text-gray-600">{request.assignedDeveloper?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDate(request.createdAt)}</td>
                    <td className="px-6 py-4"><StatusBadge status={request.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {sortedUpdateRequests.map((request) => (
            <button key={request._id} type="button" onClick={() => setSelectedRequest(request)} className={`rounded-xl border-t-4 ${getCardBorderClass(request.status)} bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md`}>
              <div className="flex items-start justify-between gap-3"><div><h3 className="text-lg font-semibold text-gray-800">{request.userId?.name || 'Unknown Client'}</h3><p className="mt-1 text-sm text-gray-500">{request.updatePlanId?.productId?.serviceName || 'No plan selected'}</p></div><StatusBadge status={request.status} /></div>
              <div className="mt-5 space-y-3 text-sm text-gray-600"><div className="flex items-center justify-between"><span>Files</span><span className="font-medium text-gray-800">{request.files?.length || 0}</span></div><div className="flex items-center justify-between"><span>Developer</span><span className="font-medium text-gray-800">{request.assignedDeveloper?.name || 'Unassigned'}</span></div><div className="flex items-center justify-between"><span>Submitted</span><span className="font-medium text-gray-800">{formatDate(request.createdAt)}</span></div></div>
            </button>
          ))}
        </div>
      )}

      {selectedRequest && (
        <UpdateRequestWorkspaceModal
          request={selectedRequest}
          developers={developers}
          onClose={() => setSelectedRequest(null)}
          onRequestUpdated={refreshRequest}
        />
      )}
    </div>
  );
};

export default AdminUpdateRequests;

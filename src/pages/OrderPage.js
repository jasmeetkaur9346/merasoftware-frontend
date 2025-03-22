import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import DashboardLayout from '../components/DashboardLayout';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    // Get user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.ordersList.url, {
        method: SummaryApi.ordersList.method,
        credentials: 'include'
      });
      
      const data = await response.json();
      if (data.success) {
        // Sort by creation date (newest first)
        const allOrders = data.data || [];
        allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(allOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
  };

  const getOrderStatus = (order) => {
    if (!order) return {};
    
    // Check for rejected status first
    if (order.orderVisibility === 'payment-rejected') {
      return { text: 'Rejected', className: 'bg-red-500 text-white' };
    }
    
    // Check for pending approval (Processing)
    if (order.orderVisibility === 'pending-approval') {
      return { text: 'Processing', className: 'bg-gray-500 text-white' };
    }
    
    // Check for completed
    if (order.projectProgress >= 100 || order.currentPhase === 'completed') {
      return { text: 'Completed', className: 'bg-green-500 text-white' };
    }
    
    // If not rejected, pending approval, or completed, then it's in progress
    if (order.orderVisibility === 'approved') {
      return { text: 'In Progress', className: 'bg-blue-500 text-white' };
    }
    
    // Fallback (shouldn't reach here often)
    return { text: 'Processing', className: 'bg-gray-500 text-white' };
  };

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <TriangleMazeLoader />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <div className="bg-blue-600 text-white p-6 mb-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">You don't have any orders yet.</p>
              <button
                onClick={() => navigate('/start-new-project')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Browse Services
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => {
                const status = getOrderStatus(order);
                
                return (
                  <div 
                    key={order._id}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => navigate(`/order-detail/${order._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{order.productId?.serviceName || "Service"}</h3>
                        <p className="text-sm text-gray-500">{order.productId?.category?.split('_').join(' ')}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-4">{formatDate(order.createdAt)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                          {status.text}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;
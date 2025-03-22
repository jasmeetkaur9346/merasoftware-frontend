import React, { useState, useEffect } from 'react';
import SummaryApi from '../common';
import { toast } from 'react-toastify';
import OrderDetailsModal from '../components/OrderDetailsModal';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(SummaryApi.pendingOrders.url, {
        method: SummaryApi.pendingOrders.method,
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
      } else {
        toast.error(data.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.approveOrder.url}/${orderId}`, {
        method: SummaryApi.approveOrder.method,
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Order approved successfully');
        setShowModal(false);
        fetchPendingOrders();
      } else {
        toast.error(data.message || 'Failed to approve order');
      }
    } catch (error) {
      console.error('Error approving order:', error);
      toast.error('Failed to approve order');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectOrder = async (orderId, reason) => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.rejectOrder.url}/${orderId}`, {
        method: SummaryApi.rejectOrder.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Order rejected');
        setShowModal(false);
        fetchPendingOrders();
      } else {
        toast.error(data.message || 'Failed to reject order');
      }
    } catch (error) {
      console.error('Error rejecting order:', error);
      toast.error('Failed to reject order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Orders Pending Approval</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <TriangleMazeLoader />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-gray-600">No pending orders to approve</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map(order => (
            <div 
              key={order._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
              onClick={() => {
                setSelectedOrder(order);
                setShowModal(true);
              }}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold text-lg">
                    {order.productId?.serviceName || 'Product'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Customer: {order.userId?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Order Date: {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">
                    ₹{order.price?.toLocaleString()}
                  </p>
                  <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    {order.paymentMethod === 'wallet' ? 'Wallet Payment' : 
                     order.paymentMethod === 'upi' ? 'UPI Payment' : 
                     'Combined Payment'}
                  </span>
                </div>
              </div>
              
              {/* Show order items summary */}
              {order.orderItems && order.orderItems.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  <p>{order.orderItems.length} items in order</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          isOpen={showModal}
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onApprove={handleApproveOrder}
          onReject={handleRejectOrder}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;
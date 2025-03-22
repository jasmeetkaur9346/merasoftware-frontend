import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import SummaryApi from '../common';
import DashboardLayout from '../components/DashboardLayout';
import TriangleMazeLoader from '../components/TriangleMazeLoader';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
    // Get user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${SummaryApi.orderDetails.url}/${orderId}`, {
        credentials: 'include',
      });
      
      const data = await response.json();
      if (data.success) {
        setOrder(data.data);
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
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

  const handleDownloadInvoice = async () => {
    try {
      // Download invoice API call
      const response = await fetch(`${SummaryApi.downloadInvoice.url}/${orderId}`, {
        method: SummaryApi.downloadInvoice.method,
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `invoice-${orderId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error downloading invoice:", error);
    }
  };

  const handleTrackProject = () => {
    navigate(`/project-details/${orderId}`);
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

  if (!order) {
    return (
      <DashboardLayout user={user}>
        <div className="p-6">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <h2 className="text-xl font-bold text-red-600 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-4">The order you're looking for doesn't exist or you don't have access to it.</p>
            <button
              onClick={() => navigate('/order')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const status = getOrderStatus(order);
  const orderNumber = `ORD-${order._id.substr(-4)}`;
  
  // Calculate totals
  const subtotal = order.orderItems ? 
    order.orderItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0) : 0;
  
  const discount = order.discountAmount || 0;
  const total = order.price || 0;

  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <div className="bg-blue-600 text-white p-6 mb-6 rounded-t-lg">
          <h1 className="text-2xl font-bold">Order Details</h1>
        </div>
        
        <button 
          onClick={() => navigate('/order')}
          className="flex items-center text-blue-600 mb-4 hover:underline"
        >
          <ChevronLeft size={16} className="mr-1" />
          Back to Orders
        </button>
        
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="flex justify-between items-start mb-4 pb-4 border-b">
            <div>
              <h2 className="text-xl font-bold">Order #{orderNumber}</h2>
              <p className="text-sm text-gray-500">Ordered on {formatDate(order.createdAt)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
              {status.text}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-4">
                {/* Main product */}
                {order.orderItems && order.orderItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-start py-3 border-b">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {order.productId?.category?.split('_').join(' ')}
                      </div>
                      <div className="text-sm">Quantity: {item.quantity}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{item.originalPrice?.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
                
                {/* Order totals */}
                <div className="pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount {order.couponApplied ? `(${order.couponApplied})` : ''}:</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-span-1">
              <div className="space-y-6">
                {/* Action buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Download Invoice
                  </button>
                  
                  {order.orderVisibility !== 'payment-rejected' && (
                    <button
                      onClick={handleTrackProject}
                      className="w-full py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                    >
                      Track Project
                    </button>
                  )}
                  
                  {order.orderVisibility === 'payment-rejected' && (
                    <button
                      onClick={() => navigate(`/direct-payment`, {
                        state: { 
                          retryPaymentId: order._id,
                          productId: order.productId?._id,
                          paymentData: {
                            product: order.productId,
                            selectedFeatures: order.orderItems?.filter(item => item.type === 'feature').map(item => ({
                              id: item.id,
                              name: item.name,
                              quantity: item.quantity || 1,
                              sellingPrice: item.originalPrice || 0,
                              totalPrice: item.finalPrice || 0
                            })) || [],
                            totalPrice: order.price,
                            originalTotalPrice: order.originalPrice || order.price
                          }
                        }
                      })}
                      className="w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    >
                      Retry Payment
                    </button>
                  )}
                </div>
                
                {/* Payment information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <p>{order.paymentMethod === 'wallet' ? 'Wallet Payment' : 
                      order.paymentMethod === 'upi' ? 'UPI Payment' : 
                      order.paymentMethod === 'combined' ? 'Wallet + UPI' : 'Online Payment'}</p>
                </div>
                
                {/* Order status progress */}
                <div className="bg-gray-50 p-4 rounded-lg">
  <h4 className="font-medium mb-4">Order Progress</h4>
  <div className="relative flex justify-between mb-2">
    <div className="w-full absolute top-1/2 h-0.5 bg-gray-200 -translate-y-1/2"></div>
    
    {['Processing', 'Approved', 'In Progress', 'Completed'].map((step, i) => {
      let active = false;
      
      if (status.text === 'Processing' && i === 0) active = true;
      else if (status.text === 'Rejected' && i === 0) active = true;
      else if (status.text === 'Approved' && i <= 1) active = true;
      else if (status.text === 'In Progress' && i <= 2) active = true;
      else if (status.text === 'Completed' && i <= 3) active = true;
      
      // Special handling for rejected orders
      const isRejected = status.text === 'Rejected';
      
      return (
        <div key={i} className="relative z-10 flex flex-col items-center">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
            active 
              ? (isRejected && i === 0 ? 'bg-red-500' : i === 3 ? 'bg-green-500' : 'bg-blue-500') 
              : 'bg-gray-200'
          }`}>
            {active && (
              <div className="w-2 h-2 rounded-full bg-white"></div>
            )}
          </div>
          <span className={`text-xs mt-1 ${active ? 'font-medium' : 'text-gray-500'}`}>
            {isRejected && i === 0 ? 'Rejected' : step}
          </span>
        </div>
      );
    })}
  </div>
</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrderDetailPage;
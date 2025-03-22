import React, { useState } from 'react';

// Main App Component with Order Management System
const OrderManagement = () => {
  const [currentPage, setCurrentPage] = useState('list'); // 'list' or 'detail'
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Sample Orders Data
  const orders = [
    {
      id: '1001',
      orderNumber: 'ORD-1001',
      productName: 'Premium Headphones',
      type: 'Electronics',
      status: 'Delivered',
      orderDate: '2023-11-15T08:30:00',
      items: [
        {
          id: '1',
          productName: 'Premium Headphones',
          type: 'Electronics',
          price: 129.99,
          quantity: 1,
          imageUrl: '/api/placeholder/100/100'
        }
      ],
      subtotal: 129.99,
      shipping: 4.99,
      tax: 13.50,
      total: 148.48,
      shippingAddress: {
        name: 'John Doe',
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '90210',
        country: 'USA'
      },
      paymentMethod: 'Credit Card (****1234)',
      trackingUrl: '#'
    },
    {
      id: '1002',
      orderNumber: 'ORD-1002',
      productName: 'Wireless Keyboard',
      type: 'Computer Accessories',
      status: 'Shipped',
      orderDate: '2023-12-05T14:45:00',
      items: [
        {
          id: '1',
          productName: 'Wireless Keyboard',
          type: 'Computer Accessories',
          price: 59.99,
          quantity: 1,
          imageUrl: '/api/placeholder/100/100'
        },
        {
          id: '2',
          productName: 'Wireless Mouse',
          type: 'Computer Accessories',
          price: 29.99,
          quantity: 1,
          imageUrl: '/api/placeholder/100/100'
        }
      ],
      subtotal: 89.98,
      shipping: 5.99,
      tax: 9.60,
      total: 105.57,
      shippingAddress: {
        name: 'Jane Smith',
        street: '456 Oak Ave',
        city: 'Somewhere',
        state: 'NY',
        zip: '10001',
        country: 'USA'
      },
      paymentMethod: 'PayPal',
      trackingUrl: '#'
    },
    {
      id: '1003',
      orderNumber: 'ORD-1003',
      productName: 'Smart Watch',
      type: 'Wearable Tech',
      status: 'Processing',
      orderDate: '2023-12-15T09:20:00',
      items: [
        {
          id: '1',
          productName: 'Smart Watch',
          type: 'Wearable Tech',
          price: 199.99,
          quantity: 1,
          imageUrl: '/api/placeholder/100/100'
        }
      ],
      subtotal: 199.99,
      shipping: 0.00,
      tax: 20.00,
      total: 219.99,
      shippingAddress: {
        name: 'Robert Johnson',
        street: '789 Pine Blvd',
        city: 'Elsewhere',
        state: 'TX',
        zip: '75001',
        country: 'USA'
      },
      paymentMethod: 'Credit Card (****5678)',
      trackingUrl: '#'
    }
  ];

  // Find selected order
  const selectedOrder = orders.find(order => order.id === selectedOrderId);

  // Handle order click
  const handleOrderClick = (orderId) => {
    setSelectedOrderId(orderId);
    setCurrentPage('detail');
  };

  // Handle back button click
  const handleBackClick = () => {
    setCurrentPage('list');
    setSelectedOrderId(null);
  };

  // Order Progress Component
  const OrderProgress = ({ status }) => {
    const steps = ['Processing', 'Confirmed', 'Shipped', 'Delivered'];
    const currentStep = steps.indexOf(status) !== -1 ? steps.indexOf(status) : 0;
    
    return (
      <div className="my-6 relative">
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => (
            <div key={step} className="flex flex-col items-center w-24">
              <div className={`w-6 h-6 rounded-full mb-1 flex items-center justify-center border-2 ${
                index <= currentStep 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-300 bg-white'
              }`}>
                {index < currentStep && <div className="w-2 h-2 bg-white rounded-full"></div>}
              </div>
              <div className="text-xs text-center font-medium text-gray-600">
                {step}
              </div>
            </div>
          ))}
        </div>
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-0"></div>
      </div>
    );
  };

  // Render based on current page
  if (currentPage === 'list') {
    return (
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">My Orders</h1>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold px-4 pt-8 pb-4">Recent Orders</h2>
          
          <div className="flex flex-col gap-4 px-4 pb-8">
            {orders.map(order => (
              <div 
                key={order.id} 
                className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOrderClick(order.id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{order.productName}</h3>
                    <p className="text-gray-600 text-sm">{order.type}</p>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-gray-500 text-sm">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-500 text-white' :
                      order.status === 'Shipped' ? 'bg-blue-500 text-white' :
                      order.status === 'Processing' ? 'bg-gray-500 text-white' :
                      'bg-yellow-500 text-white'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    // Order Detail Page
    return (
      <div className="bg-gray-100 min-h-screen pb-8">
        <header className="bg-blue-600 text-white p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold">Order Details</h1>
          </div>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6 mt-4 mx-4">
            <button 
              className="text-blue-500 mb-6 font-medium flex items-center" 
              onClick={handleBackClick}
            >
              ← Back to Orders
            </button>
            
            <div className="border-b pb-4 mb-6">
              <h2 className="text-2xl font-bold mb-2">Order #{selectedOrder.orderNumber}</h2>
              <p className="text-gray-500 mb-2">
                Ordered on {new Date(selectedOrder.orderDate).toLocaleDateString()}
              </p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                selectedOrder.status === 'Delivered' ? 'bg-green-500 text-white' :
                selectedOrder.status === 'Shipped' ? 'bg-blue-500 text-white' :
                selectedOrder.status === 'Processing' ? 'bg-gray-500 text-white' :
                'bg-yellow-500 text-white'
              }`}>
                {selectedOrder.status}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column - Order Summary */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                  
                  <div className="space-y-4 mb-6">
                    {selectedOrder.items.map(item => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-200">
                        <div className="flex-shrink-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName} 
                            className="w-16 h-16 object-cover rounded"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.productName}</h4>
                          <p className="text-gray-500 text-sm">{item.type}</p>
                          <p className="text-gray-800">${item.price.toFixed(2)}</p>
                          <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${selectedOrder.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>${selectedOrder.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>${selectedOrder.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-300 mt-2">
                      <span>Total:</span>
                      <span>${selectedOrder.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <p className="text-gray-700">{selectedOrder.shippingAddress.name}</p>
                    <p className="text-gray-700">{selectedOrder.shippingAddress.street}</p>
                    <p className="text-gray-700">
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zip}
                    </p>
                    <p className="text-gray-700">{selectedOrder.shippingAddress.country}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Payment Method</h4>
                    <p className="text-gray-700">{selectedOrder.paymentMethod}</p>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Order Progress */}
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Order Progress</h3>
                  
                  <OrderProgress status={selectedOrder.status} />
                  
                  <div className="mt-8 space-y-4">
                    <button className="w-full py-2 px-4 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition-colors">
                      Download Invoice
                    </button>
                    
                    {selectedOrder.status === 'Shipped' && (
                      <a 
                        href={selectedOrder.trackingUrl}
                        className="block w-full py-2 px-4 bg-green-500 text-white font-medium rounded text-center hover:bg-green-600 transition-colors"
                      >
                        Track Package
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Our Policies</h3>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="text-blue-500 hover:underline">Return Policy</a>
                <a href="#" className="text-blue-500 hover:underline">Shipping Policy</a>
                <a href="#" className="text-blue-500 hover:underline">Refund Policy</a>
                <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
                <a href="#" className="text-blue-500 hover:underline">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default OrderManagement;
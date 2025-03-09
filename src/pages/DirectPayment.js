import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Context from '../context';
import SummaryApi from '../common';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import displayINRCurrency from '../helpers/displayCurrency';
import { toast } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';

const DirectPayment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiLink, setUpiLink] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');

  useEffect(() => {
    // Get payment data from location state
    if (location.state?.paymentData) {
      setPaymentData(location.state.paymentData);
      
      // Calculate if wallet balance is sufficient
      const totalAmount = location.state.paymentData.totalPrice;
      if (context.walletBalance < totalAmount) {
        setRemainingAmount(totalAmount - context.walletBalance);
      }
    } else {
      // No payment data, redirect to home
      toast.error('Payment information not found');
      navigate('/');
    }
  }, [location, navigate, context.walletBalance]);

  // Generate transaction ID
  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  };

  // Add this helper function at the top of your component
const calculateFeatureDiscount = (feature, totalDiscount, originalTotal) => {
    if (!paymentData.couponData || originalTotal === 0) return 0;
    
    const featureTotal = feature.sellingPrice * (feature.quantity || 1);
    // Calculate discount proportionally based on feature price relative to total
    const proportion = featureTotal / originalTotal;
    return Math.round(totalDiscount * proportion);
  };

  // Proceed with wallet payment
  const handleWalletPayment = async () => {
    if (!paymentData) return;
    
    try {
      setLoading(true);
      
      // If wallet has sufficient balance
      if (remainingAmount <= 0) {
        // Process full payment from wallet
        const response = await fetch(SummaryApi.wallet.deduct.url, {
          method: SummaryApi.wallet.deduct.method,
          credentials: 'include',
          headers: {
            "content-type": 'application/json'
          },
          body: JSON.stringify({
            amount: paymentData.totalPrice
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Create orders
          await createOrder();
          
          // Update wallet balance
          context.fetchWalletBalance();
          
          // Redirect to success
          navigate('/success');
        } else {
          toast.error(data.message || 'Payment failed');
        }
      } else {
        // Partial payment from wallet (if wallet has some balance)
        if (context.walletBalance > 0) {
          const response = await fetch(SummaryApi.wallet.deduct.url, {
            method: SummaryApi.wallet.deduct.method,
            credentials: 'include',
            headers: {
              "content-type": 'application/json'
            },
            body: JSON.stringify({
              amount: context.walletBalance
            })
          });
          
          const data = await response.json();
          
          if (!data.success) {
            toast.error(data.message || 'Wallet payment failed');
            setLoading(false);
            return;
          }
          
          // Update wallet balance
          context.fetchWalletBalance();
        }
        
        // Generate QR for remaining amount
        const txnId = generateTransactionId();
        setTransactionId(txnId);
        
        // Create UPI payment link 
        const upiId = 'vacomputers.com@okhdfcbank'; // Replace with your UPI ID
        const payeeName = 'VA Computer';
        const upi = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${remainingAmount}&cu=INR&tn=${encodeURIComponent(`Order Payment - ${txnId}`)}&tr=${txnId}`;
        
        setUpiLink(upi);
        setShowQR(true);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };
  
  // Create order in the system
  const createOrder = async () => {
    try {
      // Calculate original total
      const originalTotal = paymentData.originalTotalPrice || (
        paymentData.product.sellingPrice + 
        paymentData.selectedFeatures.reduce((sum, feature) => 
          sum + (feature.sellingPrice * (feature.quantity || 1)), 0)
      );
      
      // Calculate discount for main product
      const mainProductDiscount = paymentData.couponData ? 
        calculateItemDiscount(
          paymentData.product.sellingPrice,
          originalTotal,
          paymentData.couponData.data.discountAmount
        ) : 0;
      
      // Create main product order with correct discount
      const orderResponse = await fetch(SummaryApi.createOrder.url, {
        method: SummaryApi.createOrder.method,
        credentials: 'include',
        headers: {
          "content-type": 'application/json'
        },
        body: JSON.stringify({
          productId: paymentData.product._id,
          quantity: 1,
          price: paymentData.product.sellingPrice - mainProductDiscount,
          originalPrice: paymentData.product.sellingPrice,
          couponApplied: paymentData.couponData?.data?.couponCode || null,
          discountAmount: mainProductDiscount
        })
      });
      
      const orderData = await orderResponse.json();
      
      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }
      
      // Create orders for features with correct discounts
      if (paymentData.selectedFeatures && paymentData.selectedFeatures.length > 0) {
        for (const feature of paymentData.selectedFeatures) {
          const featureTotal = feature.sellingPrice * (feature.quantity || 1);
          const featureDiscount = paymentData.couponData ? 
            calculateItemDiscount(
              featureTotal,
              originalTotal,
              paymentData.couponData.data.discountAmount
            ) : 0;
          
          const discountedTotal = featureTotal - featureDiscount;
          const pricePerUnit = discountedTotal / (feature.quantity || 1);
          
          const featureOrderResponse = await fetch(SummaryApi.createOrder.url, {
            method: SummaryApi.createOrder.method,
            credentials: 'include',
            headers: {
              "content-type": 'application/json'
            },
            body: JSON.stringify({
              productId: feature._id,
              quantity: feature.quantity || 1,
              price: pricePerUnit,
              originalPrice: feature.sellingPrice,
              couponApplied: featureDiscount > 0 ? paymentData.couponData?.data?.couponCode : null,
              discountAmount: featureDiscount
            })
          });
          
          const featureOrderData = await featureOrderResponse.json();
          
          if (!featureOrderData.success) {
            throw new Error(featureOrderData.message || 'Failed to create feature order');
          }
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };
  
  // Verify QR code payment
  const verifyPayment = async () => {
    if (!transactionId || !upiTransactionId.trim()) {
      setVerificationStatus('Please enter your UPI transaction ID');
      return;
    }
    
    try {
      setLoading(true);
      setVerificationStatus('Submitting verification request...');
      
      // Send request to verify payment
      const response = await fetch(SummaryApi.wallet.verifyPayment.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          transactionId: transactionId,
          amount: remainingAmount,
          upiTransactionId: upiTransactionId // Add this
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVerificationStatus('Your payment verification has been submitted. Your order will be processed after admin verification.');
        
        // Create orders
        await createOrder();
        
        // Don't immediately redirect to success
        // Instead, show a pending state
        setPaymentProcessed(true);
        
        // Redirect to success after a brief delay
        setTimeout(() => {
          navigate('/success');
        }, 3000);
      } else {
        setVerificationStatus(data.message || 'Verification submission failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setVerificationStatus('Error submitting verification. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const calculateItemDiscount = (itemPrice, totalPrice, totalDiscount) => {
    if (!totalDiscount || totalPrice === 0) return 0;
    const proportion = itemPrice / totalPrice;
    return Math.round(totalDiscount * proportion);
  };

  if (!paymentData) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center min-h-screen">
        <TriangleMazeLoader />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <TriangleMazeLoader />
        </div>
      )}
      
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">Payment Summary</h1>
        </div>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">{paymentData.product.serviceName}</h2>
          
          {/* Order Summary */}
          <div className="border-b pb-4 mb-4">
            <h3 className="text-lg font-medium mb-2">Order Summary</h3>
            
            {/* Main Product with discount */}
  <div className="flex justify-between items-center mb-2">
    <span className="text-gray-600">{paymentData.product.serviceName}</span>
    {paymentData.couponData ? (
      <div className="text-right">
        <span className="line-through text-gray-400 mr-2">
          ₹{paymentData.product.sellingPrice.toLocaleString()}
        </span>
        <span>
          ₹{(paymentData.product.sellingPrice - 
            calculateItemDiscount(
              paymentData.product.sellingPrice,
              paymentData.originalTotalPrice,
              paymentData.couponData.data.discountAmount
            )).toLocaleString()}
        </span>
      </div>
    ) : (
      <span>₹{paymentData.product.sellingPrice.toLocaleString()}</span>
    )}
  </div>
  
  {/* Selected Features with proper discounts */}
  {paymentData.selectedFeatures && paymentData.selectedFeatures.length > 0 && (
    <>
      <h4 className="text-md font-medium mt-3 mb-2">Selected Features</h4>
      {paymentData.selectedFeatures.map((feature, index) => {
        const originalPrice = feature.sellingPrice * (feature.quantity || 1);
        const itemDiscount = paymentData.couponData ? 
          calculateItemDiscount(
            originalPrice,
            paymentData.originalTotalPrice,
            paymentData.couponData.data.discountAmount
          ) : 0;
        const discountedPrice = originalPrice - itemDiscount;
        
        return (
          <div key={index} className="flex justify-between items-center mb-2">
            <div>
              <span className="text-gray-600">{feature.serviceName}</span>
              {feature.quantity > 1 && (
                <span className="text-gray-500 text-sm ml-2">× {feature.quantity}</span>
              )}
            </div>
            {itemDiscount > 0 ? (
              <div className="text-right">
                <span className="line-through text-gray-400 mr-2">
                  ₹{originalPrice.toLocaleString()}
                </span>
                <span>₹{discountedPrice.toLocaleString()}</span>
              </div>
            ) : (
              <span>₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
        );
      })}
    </>
  )}

  {/* Original Total Price (before coupon) */}
<div className="flex justify-between items-center mb-2 mt-4 pt-3 border-t border-gray-200">
  <span className="font-medium">Subtotal</span>
  <span className="line-through text-gray-500">₹{(paymentData.originalTotalPrice || 0).toLocaleString()}</span>
</div>
            
            {/* Coupon Discount - optional to show here since we're showing per-item */}
  {paymentData.couponData && (
    <div className="flex justify-between items-center mb-2 text-green-600">
      <span>Coupon Discount ({paymentData.couponData.data.couponCode})</span>
      <span>-₹{paymentData.couponData.data.discountAmount.toLocaleString()}</span>
    </div>
  )}
  
  {/* Total */}
  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
    <span className="text-lg font-semibold">Total Amount</span>
    <span className="text-xl font-bold text-blue-600">
      ₹{paymentData.totalPrice.toLocaleString()}
    </span>
  </div>
</div>
          
          {/* Payment Section */}
          <div>
            <h3 className="text-lg font-medium mb-3">Payment Method</h3>
            
            {/* Wallet Balance */}
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-4">
              <div>
                <span className="font-medium">Wallet Balance</span>
                <p className="text-sm text-gray-600">Available balance in your account</p>
              </div>
              <span className="font-semibold">
                {displayINRCurrency(context.walletBalance)}
              </span>
            </div>
            
            {!showQR ? (
              <>
                {/* Payment Breakdown */}
                {remainingAmount > 0 && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="text-md font-medium mb-2">Payment Breakdown</h4>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">From Wallet</span>
                      <span>{displayINRCurrency(context.walletBalance)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Remaining Amount (via QR)</span>
                      <span>{displayINRCurrency(remainingAmount)}</span>
                    </div>
                  </div>
                )}
                
                {/* Payment Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-100 text-gray-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  
                  <button
                    onClick={handleWalletPayment}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    {remainingAmount > 0 
                      ? 'Pay with Wallet & Continue' 
                      : 'Complete Payment'}
                  </button>
                </div>
              </>
            ) : (
              /* QR Code Payment */
              <div className="flex flex-col items-center mt-4">
              <h3 className="text-center text-lg font-medium mb-3">
                Scan QR Code to Pay Remaining Amount
              </h3>
              
              <div className="bg-white p-4 rounded-lg shadow-inner mb-4 inline-block">
                <QRCodeSVG value={upiLink} size={200} />
              </div>
              
              {/* <p className="text-center mb-2">Scan with any UPI app to pay {displayINRCurrency(remainingAmount)}</p> */}
              <p className="text-xs text-gray-500 mb-4 text-center">Transaction ID: {transactionId}</p>
              
              <div className="w-full mb-4">
                <label htmlFor="upiTransactionId" className="block text-sm font-medium mb-2">
                  UPI Transaction ID:
                </label>
                <input
                  type="text"
                  id="upiTransactionId"
                  value={upiTransactionId}
                  onChange={(e) => setUpiTransactionId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter the transaction ID from your UPI app"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is required for payment verification. You'll find it in your UPI app payment history.
                </p>
              </div>
              
              <button
                onClick={verifyPayment}
                disabled={loading || !upiTransactionId.trim()}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors w-full disabled:bg-gray-400"
              >
                {loading ? 'Verifying...' : 'Submit for Verification'}
              </button>
              
              {verificationStatus && (
                <p className="mt-3 text-center">
                  {verificationStatus}
                </p>
              )}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default DirectPayment;
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
  // Add these additional states to DirectPayment component
  const [isPartialPayment, setIsPartialPayment] = useState(false);
  const [installmentNumber, setInstallmentNumber] = useState(1);
  const [remainingPayments, setRemainingPayments] = useState([]);

  useEffect(() => {
    // Get payment data from location state
    if (location.state?.paymentData) {
      const paymentData = location.state.paymentData;
      setPaymentData(paymentData);
      
      // Check if this is a partial payment
      if (paymentData.paymentOption === 'partial') {
        setIsPartialPayment(true);
        setInstallmentNumber(1); // First installment
        setRemainingPayments(paymentData.remainingPayments || []);
      }
      
      // Calculate if wallet balance is sufficient
      const paymentAmount = paymentData.currentPaymentAmount || paymentData.totalPrice;
      if (context.walletBalance < paymentAmount) {
        setRemainingAmount(paymentAmount - context.walletBalance);
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
      
      // Get the correct amount to charge
      const amountToCharge = paymentData.currentPaymentAmount || paymentData.totalPrice;
      
      // If wallet has sufficient balance for this installment
      if (context.walletBalance >= amountToCharge) {
        // Process payment for current installment amount only
        const response = await fetch(SummaryApi.wallet.deduct.url, {
          method: SummaryApi.wallet.deduct.method,
          credentials: 'include',
          headers: {
            "content-type": 'application/json'
          },
          body: JSON.stringify({
            amount: amountToCharge, // Use current installment amount
            isInstallmentPayment: isPartialPayment // Add this flag for proper tracking
          })
        });
        
        const data = await response.json();
        
        if (data.success) {
          // Create order with partial payment info and explicitly mark as wallet payment
          await createOrder('wallet');
          
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
              amount: context.walletBalance,
              isInstallmentPayment: isPartialPayment // Add this flag
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
 // Create order in the system - FIXED VERSION
const createOrder = async (paymentMethod = 'upi') => {
  try {
    // Get payment option info
    const isPartialPayment = paymentData.paymentOption === 'partial';
    const currentPaymentAmount = paymentData.currentPaymentAmount || paymentData.totalPrice;
    
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
    
    // Calculate the ACTUAL price to charge for this installment
    let priceToCharge;
    if (isPartialPayment) {
      // For partial payment, use only the first installment amount (30%)
      priceToCharge = currentPaymentAmount;
    } else {
      // For full payment, use the full discounted price
      priceToCharge = paymentData.product.sellingPrice - mainProductDiscount;
    }
    
    // Create payment data object to send to backend
    const paymentRequestData = {
      productId: paymentData.product._id,
      quantity: 1,
      price: priceToCharge,
      originalPrice: paymentData.product.sellingPrice,
      couponApplied: paymentData.couponData?.data?.couponCode || null,
      discountAmount: mainProductDiscount,
      // CRITICAL: Add payment method information
      paymentMethod: paymentMethod
    };
    
    // Add partial payment fields ONLY if this is a partial payment
    if (isPartialPayment) {
      paymentRequestData.isPartialPayment = true;
      paymentRequestData.installmentNumber = 1;
      paymentRequestData.installmentAmount = currentPaymentAmount;
      paymentRequestData.totalAmount = paymentData.totalPrice;
      paymentRequestData.remainingAmount = paymentData.totalPrice - currentPaymentAmount;
      paymentRequestData.remainingPayments = paymentData.remainingPayments || [];
      
      // If using UPI payment, set payment status to pending
      if (paymentMethod === 'upi') {
        paymentRequestData.upiPaymentStatus = 'pending-approval';
      }
    }
    
    console.log("Sending payment data:", paymentRequestData);
    
    // Create main product order with correct pricing
    const orderResponse = await fetch(SummaryApi.createOrder.url, {
      method: SummaryApi.createOrder.method,
      credentials: 'include',
      headers: {
        "content-type": 'application/json'
      },
      body: JSON.stringify(paymentRequestData)
    });
    
    const orderData = await orderResponse.json();
    
    if (!orderData.success) {
      throw new Error(orderData.message || 'Failed to create order');
    }

    // NEW: Store the actual order ID to return it
    const actualOrderId = orderData.data?._id || orderData.data?.orderId;
      
    // For features, apply the same logic - partial payment or full payment
    if (paymentData.selectedFeatures && paymentData.selectedFeatures.length > 0) {
      await Promise.all(paymentData.selectedFeatures.map(async (feature) => {
        const featureTotal = feature.sellingPrice * (feature.quantity || 1);
        const featureDiscount = paymentData.couponData ?
          calculateItemDiscount(
            featureTotal,
            originalTotal,
            paymentData.couponData.data.discountAmount
          ) : 0;
        
        const discountedTotal = featureTotal - featureDiscount;
        
        // Calculate feature price for this installment
        let featurePriceForThisPayment;
        if (isPartialPayment) {
          // For partial payment, charge 30% of the feature price
          featurePriceForThisPayment = discountedTotal * 0.3;
        } else {
          // For full payment, charge the full discounted price
          featurePriceForThisPayment = discountedTotal;
        }
        
        const pricePerUnit = featurePriceForThisPayment / (feature.quantity || 1);
        
        // Create feature installments if needed
        let featureInstallments = [];
        if (isPartialPayment) {
          // First installment for feature
          featureInstallments.push({
            installmentNumber: 1,
            percentage: 30,
            amount: featurePriceForThisPayment,
            // CRITICAL: only mark as paid for wallet payments
            paid: paymentMethod === 'wallet',
            paymentStatus: paymentMethod === 'wallet' ? 'none' : 'pending-approval',
            // Only set paid date if wallet payment
            paidDate: paymentMethod === 'wallet' ? new Date() : null
          });
          
          // Second installment (30%)
          featureInstallments.push({
            installmentNumber: 2,
            percentage: 30,
            amount: discountedTotal * 0.3,
            paid: false,
            paymentStatus: 'none',
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          });
          
          // Third installment (40%)
          featureInstallments.push({
            installmentNumber: 3,
            percentage: 40,
            amount: discountedTotal * 0.4,
            paid: false,
            paymentStatus: 'none',
            dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
          });
        }
        
        // Create feature order
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
            discountAmount: featureDiscount,
            // Add payment method
            paymentMethod: paymentMethod,
            // Add these fields for partial payment tracking for features
            isPartialPayment: isPartialPayment,
            currentInstallment: 1, // Start with installment 1
            totalAmount: isPartialPayment ? discountedTotal : null,
            // Only mark as paid for wallet payments
            paidAmount: isPartialPayment && paymentMethod === 'wallet' ? featurePriceForThisPayment : 0,
            remainingAmount: isPartialPayment ? 
              (paymentMethod === 'wallet' ? discountedTotal - featurePriceForThisPayment : discountedTotal) : 0,
            installments: featureInstallments
          })
        });
        
        const featureOrderData = await featureOrderResponse.json();
        
        if (!featureOrderData.success) {
          throw new Error(featureOrderData.message || 'Failed to create feature order');
        }
      }));
    }
    
    // Return success with actual order ID
    return {
      success: true,
      orderId: actualOrderId
    };
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

      // First create order to get the real order ID
    let orderId = null;
    if (isPartialPayment) {
      try {
        // Create the order first so we have the actual order ID
        const createdOrder = await createOrder();
        if (createdOrder && createdOrder.orderId) {
          orderId = createdOrder.orderId;
          console.log('Created order with ID:', orderId);
        }
      } catch (error) {
        console.error('Error creating order:', error);
        setVerificationStatus('Error creating order. Please try again or contact support.');
        setLoading(false);
        return;
      }
    }

    // Log what we're sending for verification
    console.log('Sending verification request with:', {
      transactionId,
      amount: remainingAmount,
      upiTransactionId,
      isInstallmentPayment: isPartialPayment,
      orderId: orderId,
      installmentNumber
    });
      
      // Send request to verify payment
      const response = await fetch(SummaryApi.wallet.verifyPayment.url, {
        method: SummaryApi.wallet.verifyPayment.method,
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          transactionId: transactionId,
          amount: remainingAmount,
          upiTransactionId: upiTransactionId,
          // CRITICAL: Mark this explicitly as an installment payment
        isInstallmentPayment: isPartialPayment, // Use isPartialPayment flag
        type: isPartialPayment ? 'payment' : 'deposit', // Explicitly set the type
        // Add order info for partial payments
        orderId: orderId,
        installmentNumber: isPartialPayment ? installmentNumber : null,
        description: isPartialPayment 
          ? `Installment #${installmentNumber} payment for ${paymentData.product.serviceName}`
          : 'Payment via UPI'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // If this is a partial payment, update the installment status to pending approval
        if (isPartialPayment && orderId) {
          try {
            // Update the installment status to pending approval
            const updateResponse = await fetch(SummaryApi.payInstallment.url, {
              method: SummaryApi.payInstallment.method,
              credentials: 'include',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                orderId: orderId,
                installmentNumber: installmentNumber,
                amount: paymentData.currentPaymentAmount,
                isInstallmentPayment: true,
                transactionId: transactionId,
                upiTransactionId: upiTransactionId,
                paymentStatus: 'pending-approval' // CRITICAL: Mark as pending approval
              })
            });
            
            const updateData = await updateResponse.json();
            
            if (!updateData.success) {
              console.error('Error updating installment status:', updateData);
            } else {
              console.log('Successfully updated installment status to pending-approval');
            }
          } catch (error) {
            console.error('Error updating installment status:', error);
          }
        }
        
        // Show a success message with more detailed information
        if (isPartialPayment) {
          setVerificationStatus('Your payment verification has been submitted. Your project will proceed after admin approval (1-4 hours).');
          toast.success('Payment submitted successfully! We\'ll notify you once it\'s approved.');
          
          // Redirect to project details page after a brief delay
          setTimeout(() => {
            navigate(`/project-details/${orderId}`);
          }, 3000);
        } else {
          setVerificationStatus('Your payment verification has been submitted. Your order will be processed after admin approval (1-4 hours).');
          toast.success('Payment submitted successfully! We\'ll notify you once it\'s approved.');
          
          // Redirect to success page after a brief delay
          setTimeout(() => {
            navigate('/success');
          }, 3000);
        }
        
        // Set payment processed flag
        setPaymentProcessed(true);
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

  const renderInstallmentInfo = () => {
    if (!isPartialPayment) return null;
    
    return (
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-medium mb-2">Installment Information</h3>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">Current Installment:</span>
            <span className="font-semibold">#{installmentNumber} (30%)</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Amount Due Now:</span>
            <span className="text-lg font-bold text-blue-600">
              ₹{paymentData.currentPaymentAmount.toLocaleString()}
            </span>
          </div>
        </div>
        
        <h4 className="text-md font-medium mb-2">Remaining Installments</h4>
        {remainingPayments.map((payment, index) => (
          <div key={index} className="flex justify-between items-center mb-2 text-gray-600">
            <span>Installment #{payment.installmentNumber} ({payment.percentage}%)</span>
            <span>₹{payment.amount.toLocaleString()}</span>
          </div>
        ))}
        
        <p className="text-sm text-gray-500 mt-3">
          You will be notified when the next installment is due. Your project will progress as payments are made.
        </p>
      </div>
    );
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

{renderInstallmentInfo()}

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
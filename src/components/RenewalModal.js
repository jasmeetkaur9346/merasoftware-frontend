import React, { useState, useContext } from 'react';
import { X, Wallet, CreditCard, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';

const RenewalModal = ({ plan, onClose, onRenewalSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const context = useContext(Context);

  const handleRenewal = async () => {
    try {
      setIsProcessing(true);
      setError('');
      setSuccess('');

      const response = await fetch(SummaryApi.renewMonthlyPlan?.url || '/api/order/renew-monthly-plan', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan._id,
          paymentMethod: paymentMethod
        })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Plan renewed successfully! Your plan is now active for another month.');

        // Update context wallet balance if wallet payment
        if (paymentMethod === 'wallet' && data.data.walletBalance !== undefined) {
          context.setWalletBalance(data.data.walletBalance);
        }

        // Call success callback
        if (onRenewalSuccess) {
          setTimeout(() => {
            onRenewalSuccess(data.data);
            onClose();
          }, 2000);
        }
      } else {
        setError(data.message || 'Failed to renew plan. Please try again.');
      }
    } catch (error) {
      console.error('Error renewing plan:', error);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renewalCost = plan.productId?.monthlyRenewalCost || plan.renewalStatus?.monthlyRenewalCost || 8000;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Renew Monthly Plan</h2>
            <p className="text-sm text-gray-600 mt-1">{plan.productId?.serviceName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isProcessing}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Plan Status */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-3">
              <Clock className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-800">Plan Status</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Status:</span>
                <span className={`font-medium ${
                  plan.renewalStatus?.needsRenewal ? 'text-red-600' : 'text-green-600'
                }`}>
                  {plan.renewalStatus?.needsRenewal ? 'Expired' : 'Active'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Days Until Expiry:</span>
                <span className="font-medium text-gray-800">
                  {plan.renewalStatus?.daysUntilExpiry || 0} days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Yearly Days Remaining:</span>
                <span className="font-medium text-gray-800">
                  {plan.renewalStatus?.totalYearlyDaysRemaining || 0} days
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">This Month Updates Used:</span>
                <span className="font-medium text-gray-800">
                  {plan.renewalStatus?.currentMonthUpdatesUsed || 0} (Unlimited)
                </span>
              </div>
            </div>
          </div>

          {/* Renewal Cost */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-green-800">Renewal Cost</h3>
                <p className="text-sm text-green-600">For 30 days unlimited updates</p>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {displayINRCurrency(renewalCost)}
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Payment Method</h3>

            <div className="space-y-3">
              {/* Wallet Payment */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'wallet'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('wallet')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                    className="mr-3"
                  />
                  <Wallet className="w-5 h-5 text-blue-600 mr-2" />
                  <div>
                    <span className="font-medium">Wallet Balance</span>
                    <p className="text-sm text-gray-600">
                      Available: {displayINRCurrency(context.walletBalance || 0)}
                    </p>
                  </div>
                </div>

                {paymentMethod === 'wallet' && context.walletBalance < renewalCost && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    Insufficient balance. Please add money to your wallet.
                  </div>
                )}
              </div>

              {/* QR Code Payment */}
              <div
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  paymentMethod === 'qr'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setPaymentMethod('qr')}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="qr"
                    checked={paymentMethod === 'qr'}
                    onChange={() => setPaymentMethod('qr')}
                    className="mr-3"
                  />
                  <CreditCard className="w-5 h-5 text-green-600 mr-2" />
                  <div>
                    <span className="font-medium">QR Code / UPI</span>
                    <p className="text-sm text-gray-600">
                      Pay via UPI, PhonePe, GPay, etc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center text-red-700">
                <AlertCircle size={16} className="mr-2" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center text-green-700">
                <CheckCircle size={16} className="mr-2" />
                <span className="text-sm">{success}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 py-3 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleRenewal}
              disabled={
                isProcessing ||
                (paymentMethod === 'wallet' && context.walletBalance < renewalCost)
              }
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : null}
              {isProcessing ? 'Processing...' : `Renew for ${displayINRCurrency(renewalCost)}`}
            </button>
          </div>

          {/* Info */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>Your plan will be renewed for 30 days with unlimited updates.</p>
            <p>Yearly plan days will be reduced accordingly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenewalModal;
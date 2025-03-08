import React, { useState, useContext } from 'react';
import Context from '../context';
import SummaryApi from '../common';
import TriangleMazeLoader from '../components/TriangleMazeLoader';
import { QRCodeSVG } from 'qrcode.react'; // Updated import for newer versions of qrcode.react

const WalletRecharge = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [upiLink, setUpiLink] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [transactionVerified, setTransactionVerified] = useState(false);
  const context = useContext(Context);

  // Generate transaction ID
  const generateTransactionId = () => {
    return 'TXN' + Date.now() + Math.floor(Math.random() * 1000);
  };

  // Handle amount submission
  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    // Generate a transaction ID
    const txnId = generateTransactionId();
    setTransactionId(txnId);

    // Create UPI payment link
    // Replace with your UPI ID
    const upiId = 'vacomputers.com@okhdfcbank';
    const payeeName = 'VA Computer';
    const upi = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`Wallet Recharge - ${txnId}`)}&tr=${txnId}`;
    
    setUpiLink(upi);
    setShowQR(true);
  };

  // Verify transaction (to be called when user submits UPI reference)
  const verifyTransaction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVerificationStatus('Verifying your payment...');

    try {
      // Send request to your backend API
      const response = await fetch(SummaryApi.wallet.verifyPayment.url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          "Content-Type": 'application/json'
        },
        body: JSON.stringify({
          transactionId: transactionId,
          amount: Number(amount)
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setVerificationStatus('Payment verified successfully!');
        setTransactionVerified(true);
        // Update wallet balance
        if (context?.fetchWalletBalance) {
          context.fetchWalletBalance();
        }
      } else {
        setVerificationStatus('Verification failed. Please contact support.');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setVerificationStatus('Error verifying payment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Recharge Your Wallet</h2>
      
      {!showQR ? (
        <form onSubmit={handleProceedToPayment}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              min="1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Proceed to Payment
          </button>
        </form>
      ) : !transactionVerified ? (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <p className="text-center mb-2">Scan QR code to pay ₹{amount}</p>
            <p className="text-xs text-gray-500 mb-4 text-center">Transaction ID: {transactionId}</p>
            
            <div className="bg-white p-4 rounded-lg shadow-inner mb-4 inline-block">
              <QRCodeSVG value={upiLink} size={200} />
            </div>
            
            <p className="text-sm text-center mb-4">
              Scan with any UPI app (Google Pay, PhonePe, Paytm, etc.) to make payment
            </p>
          </div>
          
          <form onSubmit={verifyTransaction} className="w-full">
            <p className="text-sm text-center mb-2">After payment, click on verify:</p>
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 disabled:bg-gray-400"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Payment'}
            </button>
            
            {verificationStatus && (
              <p className="mt-2 text-center text-sm">
                {verificationStatus}
              </p>
            )}
          </form>
          
          <button
            onClick={() => setShowQR(false)}
            className="mt-4 text-blue-600 hover:text-blue-800 text-sm"
          >
            Cancel and go back
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h3 className="text-xl font-medium mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">
            ₹{amount} has been added to your wallet.
          </p>
          <button
            onClick={() => {
              setShowQR(false);
              setTransactionVerified(false);
              setAmount('');
              setTransactionId('');
              setUpiLink('');
              setVerificationStatus('');
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Make Another Recharge
          </button>
        </div>
      )}
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="rounded-lg p-8">
            <TriangleMazeLoader />
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletRecharge;
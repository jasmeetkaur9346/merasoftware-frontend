import React from 'react';
import displayINRCurrency from '../helpers/displayCurrency';

const TransactionModal = ({ 
  transaction, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject, 
  type, 
  isProcessing 
}) => {
  if (!isOpen || !transaction) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          disabled={isProcessing}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="text-center mb-4">
          {type === 'approve' ? (
            <div className="text-green-500 text-4xl mb-2">✓</div>
          ) : (
            <div className="text-red-500 text-4xl mb-2">✗</div>
          )}
          <h3 className="text-xl font-medium">
            {type === 'approve' ? 'Approve Transaction' : 'Reject Transaction'}
          </h3>
        </div>
        
        <div className="border-t border-b border-gray-200 py-4 my-4">
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="text-sm text-gray-600">Transaction ID:</div>
            <div className="text-sm font-mono truncate">{transaction.transactionId}</div>
          </div>
          
          {transaction.upiTransactionId && (
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div className="text-sm text-gray-600">UPI Transaction ID:</div>
              <div className="text-sm font-mono truncate">{transaction.upiTransactionId}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="text-sm text-gray-600">User:</div>
            <div className="text-sm">
              {transaction.userId.name || transaction.userId}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-2">
            <div className="text-sm text-gray-600">Amount:</div>
            <div className="text-sm font-medium">
              {displayINRCurrency(transaction.amount)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="text-sm text-gray-600">Date:</div>
            <div className="text-sm">
              {new Date(transaction.date).toLocaleString()}
            </div>
          </div>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          {type === 'approve' 
            ? `Are you sure you want to approve this transaction? This will add ${displayINRCurrency(transaction.amount)} to the user's wallet.` 
            : 'Are you sure you want to reject this transaction? This action cannot be undone.'}
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={isProcessing}
          >
            Cancel
          </button>
          
          {type === 'approve' ? (
            <button
              onClick={() => onApprove(transaction)}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Approve'}
            </button>
          ) : (
            <button
              onClick={() => onReject(transaction)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-red-300"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Reject'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
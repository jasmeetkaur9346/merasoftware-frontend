import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SummaryApi from '../common';
import imageTobase64 from '../helpers/imageTobase64';
import { toast } from 'react-toastify';

const CompleteProfile = () => {
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();

  // State for form steps
  const [currentStep, setCurrentStep] = useState(1);

  // State for form data
  const [basicDetails, setBasicDetails] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    age: ''
  });

  const [bankAccounts, setBankAccounts] = useState([]);

  const [documents, setDocuments] = useState({
    aadharFrontPhoto: null,
    aadharBackPhoto: null,
    panCard: null,
    selfiePhoto: null
  });

  const [address, setAddress] = useState({
    streetAddress: '',
    city: '',
    state: '',
    pinCode: '',
    landmark: ''
  });

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedBasicDetails = localStorage.getItem('completeProfile_basicDetails');
    const savedBankAccounts = localStorage.getItem('completeProfile_bankAccounts');
    const savedDocuments = localStorage.getItem('completeProfile_documents');
    const savedAddress = localStorage.getItem('completeProfile_address');

    if (savedBasicDetails) setBasicDetails(JSON.parse(savedBasicDetails));
    else if (user) {
      setBasicDetails(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }

    if (savedBankAccounts) setBankAccounts(JSON.parse(savedBankAccounts));
    if (savedDocuments) setDocuments(JSON.parse(savedDocuments));
    if (savedAddress) setAddress(JSON.parse(savedAddress));
  }, [user]);

  // Handle DOB change and auto-calculate age
  const handleDobChange = (e) => {
    const dobValue = e.target.value;
    setBasicDetails(prev => ({ ...prev, dob: dobValue }));

    if (dobValue) {
      const birthDate = new Date(dobValue);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setBasicDetails(prev => ({ ...prev, age: calculatedAge.toString() }));
    } else {
      setBasicDetails(prev => ({ ...prev, age: '' }));
    }
  };

  // Save current step data to localStorage
  const saveStepData = () => {
    if (currentStep === 1) {
      localStorage.setItem('completeProfile_basicDetails', JSON.stringify(basicDetails));
    } else if (currentStep === 2) {
      localStorage.setItem('completeProfile_bankAccounts', JSON.stringify(bankAccounts));
    } else if (currentStep === 3) {
      localStorage.setItem('completeProfile_documents', JSON.stringify(documents));
    } else if (currentStep === 4) {
      localStorage.setItem('completeProfile_address', JSON.stringify(address));
    }
  };

  // Handle Next button click
  const handleNext = () => {
    // Validation for Aadhaar front and back photos on step 3
    if (currentStep === 3) {
      if (!documents.aadharFrontPhoto || !documents.aadharBackPhoto) {
        toast.error('Please upload both Aadhaar front and back photos (jpg/jpeg only).');
        return;
      }
    }
    saveStepData();
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  // Handle Previous button click
  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // Handle bank account add (max 2)
  const addBankAccount = () => {
    if (bankAccounts.length < 2) {
      setBankAccounts([...bankAccounts, {
        id: Date.now(),
        bankName: '',
        bankAccountNumber: '',
        bankIFSCCode: '',
        accountHolderName: '',
        upiId: '',
        qrCode: null,
        isPrimary: false
      }]);
    } else {
      toast.error('You can add up to 2 bank accounts only.');
    }
  };

  // Handle bank account remove
  const removeBankAccount = (id) => {
    setBankAccounts(bankAccounts.filter(acc => acc.id !== id));
  };

  // Handle bank account field update
  const updateBankAccount = (id, field, value) => {
    setBankAccounts(bankAccounts.map(acc =>
      acc.id === id ? { ...acc, [field]: value } : acc
    ));
  };

  // Validate image file type (jpg/jpeg)
  const isValidImageType = (file) => {
    return file && (file.type === 'image/jpeg' || file.type === 'image/jpg');
  };

  // Handle document image upload with validation and base64 conversion
  const handleDocumentUpload = async (field, file) => {
    if (!isValidImageType(file)) {
      toast.error('Only JPG/JPEG images are allowed.');
      return;
    }
    const base64Image = await imageTobase64(file);
    setDocuments(prev => ({ ...prev, [field]: base64Image }));
  };

  // Handle bank account QR code upload with validation and base64 conversion
  const handleBankQrUpload = async (id, file) => {
    if (!isValidImageType(file)) {
      toast.error('Only JPG/JPEG images are allowed.');
      return;
    }
    const base64Image = await imageTobase64(file);
    setBankAccounts(bankAccounts.map(acc =>
      acc.id === id ? { ...acc, qrCode: base64Image } : acc
    ));
  };

  // Handle address field update
  const updateAddressField = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  // Handle Finish button click - submit data to backend
  const handleFinish = async () => {
    saveStepData();

    // Prepare payload
    const payload = {
      phone: basicDetails.phone,
      age: parseInt(basicDetails.age, 10),
      dob: basicDetails.dob,
      bankAccounts: bankAccounts.map(({ id, ...rest }) => rest),
      kycDocuments: {
        aadharFrontPhoto: documents.aadharFrontPhoto,
        aadharBackPhoto: documents.aadharBackPhoto,
        panCard: documents.panCard,
        selfiePhoto: documents.selfiePhoto
      },
      address: {
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        pinCode: address.pinCode,
        landmark: address.landmark
      }
    };

    try {
      const response = await fetch(SummaryApi.completeProfile.url, {
        method: SummaryApi.completeProfile.method,
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Profile completed successfully!');
        // Clear localStorage for form data
        localStorage.removeItem('completeProfile_basicDetails');
        localStorage.removeItem('completeProfile_bankAccounts');
        localStorage.removeItem('completeProfile_documents');
        localStorage.removeItem('completeProfile_address');

        // Force refresh user data to get updated isDetailsCompleted status
        try {
          const refreshResponse = await fetch(SummaryApi.current_user.url, {
            method: SummaryApi.current_user.method,
            credentials: 'include'
          });
          const refreshData = await refreshResponse.json();
          
          if (refreshData.success) {
            // Update Redux store with fresh user data
            const { setUserDetails } = await import('../store/userSlice');
            const { default: StorageService } = await import('../utils/storageService');
            
            StorageService.setUserDetails(refreshData.data);
            // Dispatch action to update Redux store (if available)
            if (window.store) {
              window.store.dispatch(setUserDetails(refreshData.data));
            }
          }
        } catch (refreshError) {
          console.error('Error refreshing user data:', refreshError);
        }

        // Redirect to role-based dashboard
        const role = user.role;
        let redirectPath = '/';
        switch (role) {
          case 'admin':
            redirectPath = '/admin-panel/all-products';
            break;
          case 'manager':
            redirectPath = '/manager-panel/dashboard';
            break;
          case 'partner':
            redirectPath = '/partner-panel/dashboard';
            break;
          case 'developer':
            redirectPath = '/developer-panel';
            break;
          case 'customer':
            redirectPath = '/home';
            break;
          default:
            redirectPath = '/';
        }
        navigate(redirectPath);
      } else {
        toast.error(data.message || 'Failed to complete profile.');
      }
    } catch (error) {
      console.error('Error completing profile:', error);
      toast.error('An error occurred while completing profile.');
    }
  };

  // Render steps UI
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2>Basic Details</h2>
            <label>Name:</label>
            <input type="text" value={basicDetails.name} disabled />
            <label>Email:</label>
            <input type="email" value={basicDetails.email} disabled />
            <label>Phone:</label>
            <input
              type="tel"
              value={basicDetails.phone}
              onChange={e => setBasicDetails(prev => ({ ...prev, phone: e.target.value }))}
              required
            />
            <label>Date of Birth:</label>
            <input
              type="date"
              value={basicDetails.dob}
              onChange={handleDobChange}
              required
            />
            <label>Age:</label>
            <input type="number" value={basicDetails.age} readOnly />
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Bank Accounts</h2>
            <button type="button" onClick={addBankAccount} disabled={bankAccounts.length >= 2}>
              Add Bank Account ({bankAccounts.length}/2)
            </button>
            {bankAccounts.length === 0 && <p>No bank accounts added yet.</p>}
            {bankAccounts.map((acc, idx) => (
              <div key={acc.id}>
                <h3>Bank Account {idx + 1}</h3>
                <label>Bank Name:</label>
                <input
                  type="text"
                  value={acc.bankName}
                  onChange={e => updateBankAccount(acc.id, 'bankName', e.target.value)}
                  required
                />
                <label>Account Number:</label>
                <input
                  type="text"
                  value={acc.bankAccountNumber}
                  onChange={e => updateBankAccount(acc.id, 'bankAccountNumber', e.target.value)}
                  required
                />
                <label>IFSC Code:</label>
                <input
                  type="text"
                  value={acc.bankIFSCCode}
                  onChange={e => updateBankAccount(acc.id, 'bankIFSCCode', e.target.value)}
                  required
                />
                <label>Account Holder Name:</label>
                <input
                  type="text"
                  value={acc.accountHolderName}
                  onChange={e => updateBankAccount(acc.id, 'accountHolderName', e.target.value)}
                  required
                />
                <label>UPI ID:</label>
                <input
                  type="text"
                  value={acc.upiId}
                  onChange={e => updateBankAccount(acc.id, 'upiId', e.target.value)}
                />
                <label>QR Code (JPG/JPEG only):</label>
                <input
                  type="file"
                  accept=".jpg,.jpeg"
                  onChange={async e => {
                    if (e.target.files.length > 0) {
                      await handleBankQrUpload(acc.id, e.target.files[0]);
                    }
                  }}
                />
                <button type="button" onClick={() => removeBankAccount(acc.id)}>Remove</button>
              </div>
            ))}
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Documents</h2>
            <label>Aadhaar Front Photo (JPG/JPEG only):</label>
            <input
              type="file"
              accept=".jpg,.jpeg"
              onChange={async e => {
                if (e.target.files.length > 0) {
                  await handleDocumentUpload('aadharFrontPhoto', e.target.files[0]);
                }
              }}
              required
            />
            {documents.aadharFrontPhoto && <img src={documents.aadharFrontPhoto} alt="Aadhaar Front" width={100} />}
            <label>Aadhaar Back Photo (JPG/JPEG only):</label>
            <input
              type="file"
              accept=".jpg,.jpeg"
              onChange={async e => {
                if (e.target.files.length > 0) {
                  await handleDocumentUpload('aadharBackPhoto', e.target.files[0]);
                }
              }}
              required
            />
            {documents.aadharBackPhoto && <img src={documents.aadharBackPhoto} alt="Aadhaar Back" width={100} />}
            <label>PAN Card Photo (JPG/JPEG only):</label>
            <input
              type="file"
              accept=".jpg,.jpeg"
              onChange={async e => {
                if (e.target.files.length > 0) {
                  await handleDocumentUpload('panCard', e.target.files[0]);
                }
              }}
            />
            {documents.panCard && <img src={documents.panCard} alt="PAN Card" width={100} />}
            <label>Selfie Photo (JPG/JPEG only):</label>
            <input
              type="file"
              accept=".jpg,.jpeg"
              onChange={async e => {
                if (e.target.files.length > 0) {
                  await handleDocumentUpload('selfiePhoto', e.target.files[0]);
                }
              }}
            />
            {documents.selfiePhoto && <img src={documents.selfiePhoto} alt="Selfie" width={100} />}
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Address</h2>
            <label>Street Address:</label>
            <input
              type="text"
              value={address.streetAddress}
              onChange={e => updateAddressField('streetAddress', e.target.value)}
              required
            />
            <label>City:</label>
            <input
              type="text"
              value={address.city}
              onChange={e => updateAddressField('city', e.target.value)}
              required
            />
            <label>State:</label>
            <input
              type="text"
              value={address.state}
              onChange={e => updateAddressField('state', e.target.value)}
              required
            />
            <label>PIN Code:</label>
            <input
              type="text"
              value={address.pinCode}
              onChange={e => updateAddressField('pinCode', e.target.value)}
              required
            />
            <label>Landmark:</label>
            <input
              type="text"
              value={address.landmark}
              onChange={e => updateAddressField('landmark', e.target.value)}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
      <div className="bg-white p-6 rounded shadow">
        {renderStep()}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button onClick={handlePrevious} className="px-4 py-2 bg-gray-300 rounded">
              Previous
            </button>
          )}
          {currentStep < 4 && (
            <button onClick={handleNext} className="px-4 py-2 bg-blue-600 text-white rounded">
              Next
            </button>
          )}
          {currentStep === 4 && (
            <button onClick={handleFinish} className="px-4 py-2 bg-green-600 text-white rounded">
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteProfile;

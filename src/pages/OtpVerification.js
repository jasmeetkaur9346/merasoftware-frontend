import React, { useState, useEffect, useContext } from 'react';
import { toast } from "react-toastify";
import SummaryApi from "../common";
import CookieManager from '../utils/cookieManager';
import { useNavigate } from 'react-router-dom';
import loginIcons from "../assest/signin.gif";
import { useDispatch, useSelector  } from 'react-redux';
import { setUserDetails, updateWalletBalance } from '../store/userSlice';
import Context from '../context';

const OtpVerification = ({ userData, onBackToLogin}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 10 minutes in seconds
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Redux dispatch को प्राप्त करें
  const storeUser = useSelector(state => state.user.user);
  const context = useContext(Context); 

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleInputChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move focus to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data only contains numbers
    if (!/^\d*$/.test(pastedData)) return;
    
    const digits = pastedData.slice(0, 6).split('');
    const newOtp = [...otp];
    
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    for (let i = digits.length; i < 6; i++) {
      const nextInput = document.getElementById(`otp-input-${i}`);
      if (nextInput) {
        nextInput.focus();
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch(SummaryApi.verifyOtp.url, {
        method: SummaryApi.verifyOtp.method,
        credentials: "include",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          userId: userData.userId,
          otp: otpValue
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // 1. कुकी में यूज़र डेटा सेट करें
        CookieManager.setUserDetails({
          _id: data.data.user._id,
          name: data.data.user.name,
          email: data.data.user.email,
          role: data.data.user.role
        });
        
        // 2. Redux स्टोर में यूज़र डेटा अपडेट करें (dispatch को props से पास करें)
        dispatch(setUserDetails(data.data.user));
      if (data.data.walletBalance) {
        dispatch(updateWalletBalance(data.data.walletBalance));
      }
        
        // 3. कॉन्टेक्स्ट अपडेट करें (fetchUserDetails को context से पास करें)
        try {
          if (context.fetchUserDetails) {
            await context.fetchUserDetails();
          }
          
          if (context.fetchUserAddToCart) {
            await context.fetchUserAddToCart();
          }
        } catch (fetchError) {
          console.error("Data fetching error:", fetchError);
        }
        
        toast.success(data.message);
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    
    try {
      const response = await fetch(SummaryApi.resendOtp.url, {
        method: SummaryApi.resendOtp.method,
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          userId: userData.userId
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTimeLeft(60); // Reset timer
        toast.success("New OTP sent to your email");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="otp-verification">
      <div className="max-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="Verification icon" />
          </div>
          
          <h2 className="text-xl font-bold text-center mt-4">Email Verification</h2>
          <p className="text-center text-gray-600 mt-2">
            We've sent a verification code to
            <br />
            <span className="font-medium">{userData.email}</span>
          </p>
          
          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-10 h-12 text-center text-xl font-bold border rounded-md bg-slate-200 outline-none"
                />
              ))}
            </div>
            
            <div className="text-center text-gray-600 mb-4">
              Time remaining: {formatTime(timeLeft)}
            </div>
            
            <button 
              type="submit" 
              disabled={loading || timeLeft === 0}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[200px] rounded-full hover:scale-110 transition-all mx-auto block disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            {timeLeft === 0 ? (
              <button 
                onClick={handleResendOtp}
                disabled={loading}
                className="text-red-600 hover:text-red-700 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Resend OTP
              </button>
            ) : (
              <p className="text-gray-500 text-sm">
                Didn't receive the code? You can resend when the timer expires.
              </p>
            )}
          </div>
          
          <div className="mt-4 text-center">
            <button 
              onClick={onBackToLogin}
              className="text-gray-600 hover:text-gray-800 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtpVerification;
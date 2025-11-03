import React, { useState, useEffect, useRef } from 'react';
import AuthImage from '../../assets/images/Auth.png';
import axiosInstance from '../../Constants/axiosInstance';
import { Auth } from '../../Constants';
import { useNavigate } from 'react-router-dom';

const Login = ({ isOpen, onClose, onSignUpClick, onAdminSignInClick }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Rate limiting state
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState(0);
  const timerRef = useRef(null);

  const MAX_ATTEMPTS = 5;
  const TIME_WINDOW = 60000; // 1 minute in milliseconds
  const STORAGE_KEY = 'loginAttempts';

  // Get login attempts from localStorage
  const getLoginAttempts = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const attempts = JSON.parse(stored);
        const now = Date.now();
        // Filter out old attempts
        const recentAttempts = attempts.filter(timestamp => now - timestamp < TIME_WINDOW);
        // Update storage with filtered attempts
        if (recentAttempts.length !== attempts.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(recentAttempts));
        }
        return recentAttempts;
      }
    } catch (error) {
      console.error('Error reading login attempts:', error);
    }
    return [];
  };

  // Save login attempts to localStorage
  const saveLoginAttempts = (attempts) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.error('Error saving login attempts:', error);
    }
  };

  // Clear login attempts
  const clearLoginAttempts = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing login attempts:', error);
    }
  };

  // Check rate limiting
  const checkRateLimit = () => {
    const now = Date.now();
    const recentAttempts = getLoginAttempts();
    
    if (recentAttempts.length >= MAX_ATTEMPTS) {
      const oldestAttempt = Math.min(...recentAttempts);
      const resetTime = oldestAttempt + TIME_WINDOW;
      const timeLeft = Math.ceil((resetTime - now) / 1000);
      
      if (timeLeft > 0) {
        setIsRateLimited(true);
        setTimeUntilReset(timeLeft);
        return false;
      } else {
        // Time window has passed, clear old attempts
        clearLoginAttempts();
        setIsRateLimited(false);
        return true;
      }
    }
    
    return true;
  };

  // Check rate limit on component mount and when modal opens
  useEffect(() => {
    if (isOpen) {
      checkRateLimit();
    }
  }, [isOpen]);

  // Update countdown timer
  useEffect(() => {
    if (isRateLimited && timeUntilReset > 0) {
      timerRef.current = setInterval(() => {
        setTimeUntilReset(prev => {
          if (prev <= 1) {
            setIsRateLimited(false);
            clearLoginAttempts();
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRateLimited, timeUntilReset]);

  // Clean up old attempts periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const attempts = getLoginAttempts();
      if (attempts.length > 0) {
        saveLoginAttempts(attempts);
      }
    }, 10000); // Clean up every 10 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    
    // Check rate limit before proceeding
    if (!checkRateLimit()) {
      setErrors({ 
        general: `Too many login attempts. Please try again in ${timeUntilReset} seconds.` 
      });
      return;
    }

    setLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const response = await axiosInstance.post('http://localhost:5228/api/signin', {
        email,
        password,
      });

      console.log('Signin Successful:', response.data);

      // Store the user's email, token, and role in localStorage
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userRole', response.data.role);

      setSuccess(true);
      // Clear login attempts on successful login
      clearLoginAttempts();
      clearForm();

      // Redirect based on the user's role
      if (response.data.role === 'Customer') {
        setTimeout(() => {
          onClose();
          navigate('/customer-dashboard');
        }, 2000);
      } else if (response.data.role === 'ServiceProvider') {
        setTimeout(() => {
          onClose();
          navigate('/serviceprovider-dashbooard');
        }, 2000);
      } else {
        setErrors({ general: 'Unknown user role. Please contact support.' });
      }
    } catch (err) {
      // Record failed login attempt
      const attempts = getLoginAttempts();
      attempts.push(Date.now());
      saveLoginAttempts(attempts);
      
      // Check if this failure triggers rate limiting
      checkRateLimit();
      
      if (err.response?.data) {
        setErrors({ general: err.response.data });
      } else {
        setErrors({ general: 'Sign in Failed' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSignUp = () => {
    onClose();
    clearForm();
    if (onSignUpClick) {
      onSignUpClick();
    }
  };

  const handleAdminSignin = () => {
    onClose();
    clearForm();
    if (onAdminSignInClick) {
      onAdminSignInClick();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  if (!isOpen) return null;

  const recentAttempts = getLoginAttempts();
  const remainingAttempts = Math.max(0, MAX_ATTEMPTS - recentAttempts.length);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50"></div>

      {/* Modal content */}
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white items-center flex md:flex-row flex-col justify-center relative z-10 max-h-[90vh] overflow-y-auto overflow-x-hidden">
          {/* Close button */}
          <button
            onClick={() => {
              clearForm();
              onClose();
            }}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>

          <div className="flex items-center justify-center pt-16">
            <img src={AuthImage} className="lg:w-1/2 w-2/8 lg:pt-0 pt-42 mx-5" alt="" />
          </div>

          <div className="bg-white rounded shadow-md flex flex-col px-12 py-6">
            <div className="text-center">
              <h1 className="md:text-2xl text-xl">Welcome Back</h1>
              <p className="text-sm">Please enter your details to sign in</p>
              
              {/* Rate limit warning */}
              {isRateLimited && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-sm mt-2">
                  <strong>Account temporarily locked</strong>
                  <p className="mt-1">Too many login attempts. Try again in {formatTime(timeUntilReset)}</p>
                </div>
              )}
              
              {/* Show remaining attempts if getting close to limit */}
              {!isRateLimited && remainingAttempts <= 2 && remainingAttempts > 0 && (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-sm mt-2">
                  Warning: {remainingAttempts} login attempt{remainingAttempts !== 1 ? 's' : ''} remaining
                </div>
              )}
              
              {errors.general && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.general}
                </div>
              )}
              {success && (
                <div className="text-green-500 text-sm mt-2">
                  Sign in successful! Redirecting...
                </div>
              )}
            </div>

            <div className="pt-8">
              <form onSubmit={handleSignin} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="Email">Email</label>
                  <input
                    type="email"
                    id="Email"
                    placeholder="johndoe@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-neutral-400 px-2 py-1 rounded-md"
                    disabled={isRateLimited}
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="Password">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="Password"
                      placeholder="***********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border border-neutral-400 px-2 py-1 rounded-md w-full pr-10"
                      disabled={isRateLimited}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      disabled={isRateLimited}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="remember" disabled={isRateLimited} />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <button 
                    type="button" 
                    className="text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                    disabled={isRateLimited}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="bg-Button rounded-md px-8 py-2 text-Headings w-3/4 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || isRateLimited}
                  >
                    {isRateLimited 
                      ? `Locked (${formatTime(timeUntilReset)})` 
                      : loading 
                      ? 'Signing in...' 
                      : 'Sign in'}
                  </button>
                </div>
              </form>
            </div>

            <div className="pt-4 text-neutral-400 flex items-center justify-center gap-3">
              <hr className="w-1/7" />{' '}
              <span>
                or Sign in as{' '}
                <a
                  href=""
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isRateLimited) {
                      handleAdminSignin();
                    }
                  }}
                  className={`font-semibold ${isRateLimited ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  Adminstrator
                </a>
              </span>{' '}
              <hr className="w-1/4" />
            </div>

            <div className="flex justify-center items-center mt-4 gap-3">
              {Auth.map((auth, index) => (
                <div 
                  key={index} 
                  className={`flex border border-black rounded px-4 py-1 ${isRateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {auth.icon} {auth.text}
                </div>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <h1>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleOpenSignUp}
                  className="text-Sub-headings hover:text-blue-800 disabled:text-gray-400"
                  disabled={isRateLimited}
                >
                  Sign up
                </button>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
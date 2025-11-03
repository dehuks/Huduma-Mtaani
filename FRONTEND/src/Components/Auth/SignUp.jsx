import React, { useState, useEffect } from 'react';
import AuthImage from '../../assets/images/Auth.png';
import axiosInstance from '../../Constants/axiosInstance';
import { Auth } from '../../Constants';

const SignUp = ({ isOpen, onClose, onLoginClick }) => {
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Password validation rules
  const validatePassword = (pwd) => {
    const validations = {
      minLength: pwd.length >= 8,
      hasUpperCase: /[A-Z]/.test(pwd),
      hasLowerCase: /[a-z]/.test(pwd),
      hasNumber: /\d/.test(pwd),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };
    return validations;
  };

  const passwordValidations = validatePassword(password);
  const isPasswordValid = Object.values(passwordValidations).every(Boolean);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const clearForm = () => {
    setfullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
    setRole('customer');
    setErrors({});
    setPasswordFocused(false);
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(fullName)) {
      newErrors.fullName = 'Full name can only contain letters and spaces';
    }

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Kenyan format)
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+254|0)[17]\d{8}$/.test(phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Kenyan phone number (e.g., +254701234567 or 0701234567)';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isPasswordValid) {
      newErrors.password = 'Password does not meet all requirements';
    }

    // Confirm Password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSuccess(false);

    // Client-side validation
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post('http://localhost:5228/api/signup', {
        fullName,
        email,
        phone,
        password,
        role,
      });

      console.log('Signup Successful:', response.data);
      setSuccess(true);
      clearForm();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      if (err.response?.data) {
        setErrors({ general: err.response.data });
      } else {
        setErrors({ general: 'Signup Failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSignIn = () => {
    clearForm();
    onClose();
    if (onLoginClick) {
      onLoginClick();
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50'>
      {/* Full-screen backdrop blur overlay */}
      <div className='fixed inset-0 backdrop-blur-sm bg-opacity-50'></div>

      {/* Modal content */}
      <div className='fixed inset-0 flex items-center justify-center'>
        <div className='bg-white items-center flex md:flex-row flex-col justify-center relative z-10 max-h-[90vh] overflow-y-auto overflow-x-hidden'>
          {/* Close button (X) */}
          <button
            onClick={() => {
              clearForm();
              onClose();
            }}
            className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl'
          >
            &times;
          </button>

          <div className='flex items-center justify-center pt-16'>
            <img src={AuthImage} className="lg:w-1/2 w-2/8 lg:pt-0 pt-42 mx-5" alt="" />
          </div>
          <div className='bg-white rounded shadow-md flex flex-col px-12 py-6'>
            <div className='text-center'>
              <h1 className='md:text-2xl text-xl'>Create Account</h1>
              <p className='text-sm'>Hey, Enter your details to create an account</p>
              {errors.general && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.general}
                </div>
              )}
              {success && (
                <div className="text-green-500 text-sm mt-2">
                  Signup successful! Redirecting...
                </div>
              )}
            </div>

            <div className='pt-8'>
              <form onSubmit={handleSignup} className='flex flex-col gap-4'>
                {/* Full Name */}
                <div className='flex flex-col gap-1'>
                  <label htmlFor="FirstName">Full Name</label>
                  <input
                    type='text'
                    placeholder='John Doe'
                    value={fullName}
                    onChange={(e) => {
                      setfullName(e.target.value);
                      if (errors.fullName) {
                        setErrors({ ...errors, fullName: null });
                      }
                    }}
                    className={`border ${errors.fullName ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md`}
                    required
                  />
                  {errors.fullName && (
                    <div className="text-red-500 text-sm">
                      {errors.fullName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div className='flex flex-col gap-1'>
                  <label htmlFor="Email">Email</label>
                  <input
                    type="email"
                    placeholder='JohnDoe@gmail.com'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: null });
                      }
                    }}
                    className={`border ${errors.email ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md`}
                    required
                  />
                  {errors.email && (
                    <div className="text-red-500 text-sm">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className='flex flex-col gap-1'>
                  <label htmlFor="Phone">Phone</label>
                  <input
                    type="text"
                    placeholder='+254701234567'
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      if (errors.phone) {
                        setErrors({ ...errors, phone: null });
                      }
                    }}
                    className={`border ${errors.phone ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md`}
                    required
                  />
                  {errors.phone && (
                    <div className="text-red-500 text-sm">
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* Password */}
                <div className='flex flex-col gap-1'>
                  <label htmlFor="Password">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='***********'
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errors.password) {
                          setErrors({ ...errors, password: null });
                        }
                      }}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      className={`border ${errors.password ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md w-full pr-10`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  {errors.password && (
                    <div className="text-red-500 text-sm">
                      {errors.password}
                    </div>
                  )}

                  {/* Password strength indicator */}
                  {(passwordFocused || password) && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-xs space-y-1">
                      <p className="font-semibold mb-1">Password must contain:</p>
                      <div className={`flex items-center gap-1 ${passwordValidations.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidations.minLength ? '✓' : '○'} At least 8 characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidations.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidations.hasUpperCase ? '✓' : '○'} One uppercase letter (A-Z)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidations.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidations.hasLowerCase ? '✓' : '○'} One lowercase letter (a-z)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidations.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidations.hasNumber ? '✓' : '○'} One number (0-9)
                      </div>
                      <div className={`flex items-center gap-1 ${passwordValidations.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        {passwordValidations.hasSpecialChar ? '✓' : '○'} One special character (!@#$%^&*)
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className='flex flex-col gap-1'>
                  <label htmlFor="ConfirmPassword">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='***********'
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (errors.confirmPassword) {
                          setErrors({ ...errors, confirmPassword: null });
                        }
                      }}
                      className={`border ${errors.confirmPassword ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md w-full pr-10`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <div className="text-red-500 text-sm">
                      {errors.confirmPassword}
                    </div>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <div className="text-green-600 text-xs flex items-center gap-1 mt-1">
                      ✓ Passwords match
                    </div>
                  )}
                </div>

                <div className='flex justify-center mt-4'>
                  <button
                    type='submit'
                    className='bg-Button rounded-md px-8 py-2 text-Headings w-3/4 disabled:opacity-50 disabled:cursor-not-allowed'
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
            <div className='pt-4 text-neutral-400 flex items-center justify-center gap-3'>
              <hr className='w-1/4' /> <span>or Sign up with</span> <hr className='w-1/4' />
            </div>
            <div className='flex justify-center items-center mt-4 gap-3'>
              {Auth.map((auth, index) => (
                <div key={index} className='flex border border-black rounded px-4 py-1'>
                  {auth.icon} {auth.text}
                </div>
              ))}
            </div>
            <div className='flex justify-center pt-4'>
              <h1>Already have an account?{' '}
                <span>
                  <button
                    type="button"
                    onClick={handleOpenSignIn}
                    className="text-Sub-headings hover:text-blue-800"
                  >
                    Sign In
                  </button>
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
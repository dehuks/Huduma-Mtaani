import React, { useState, useEffect } from 'react';
import AuthImage from '../../assets/images/Auth.png';
import axiosInstance from '../../Constants/axiosInstance';
import { Auth } from '../../Constants';

const SignUp = ({ isOpen, onClose, onLoginClick }) => {
  if (!isOpen) return null; // Hide modal when not open

  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // 
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false); // State to track successful signup

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Disable scrolling
    } else {
      document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    // Cleanup function to re-enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Clear previous errors
    setSuccess(false); // Reset success state

    try {
      const response = await axiosInstance.post('http://localhost:5228/api/signup', {
        fullName,
        email,
        phone,
        password,
        role,
      });

      console.log('Signup Successful:', response.data);
      setSuccess(true); // Set success state to true
      setTimeout(() => {
        onClose(); // Close modal after a short delay
      }, 2000); // Close modal after 2 seconds
    } catch (err) {
      if (err.response?.data) {
        // If the API returns field-specific errors, set them in the errors object
        setErrors({general: err.response.data});
      } else {
        setErrors({general: 'Signup Failed. Please try again.'})
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSignIn = () => {
    onClose(); // Close SignIn modal first
    if (onLoginClick) {
        onLoginClick(); // Then open SignUp modal
    }
  };

  return (
    <div className='fixed inset-0 z-50'>
      {/* Full-screen backdrop blur overlay */}
      <div className='fixed inset-0 backdrop-blur-sm bg-opacity-50'></div>

      {/* Modal content */}
      <div className='fixed inset-0 flex items-center justify-center'>
        <div className='bg-white items-center flex md:flex-row flex-col justify-center relative z-10 max-h-[90vh] overflow-y-auto overflow-x-hidden'>
          {/* Close button (X) */}
          <button
            onClick={onClose}
            className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl'
          >
            &times;
          </button>

          <div></div>
          <div className='flex items-center justify-center pt-16'>
            <img src={AuthImage} className="lg:w-1/2 w-2/8 lg:pt-0 pt-42 mx-5" alt="" />
          </div>
          <div className='bg-white rounded shadow-md flex flex-col px-12 py-6'>
            <div className='text-center'>
              <h1 className='md:text-2xl text-xl'>Create Account</h1>
              <p className='text-sm'>Hey, Enter your details to create an account</p>
              {/* Display general errors */}
              {errors.general && (
                <div className="text-red-500 text-sm mt-2">
                  {errors.general}
                </div>
              )}
              {/* Display success message */}
              {success && (
                <div className="text-green-500 text-sm mt-2">
                  Signup successful! Redirecting...
                </div>
              )}
            </div>

            <div className='pt-8'>
              <form onSubmit={handleSignup} className='flex flex-col gap-4'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="FirstName">Full Name</label>
                  <input
                    type='text'
                    placeholder='John'
                    value={fullName}
                    onChange={(e) => setfullName(e.target.value)}
                    className={`border ${errors.fullName ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md`}
                    required
                  />
                  {/* Display Full name errors */}
                  {errors.fullName && (
                    <div className="text-red-500 text-sm">
                      {errors.fullName[0]} {/* Display the first error message */}
                    </div>
                  )}
                </div>
               
                  <div className='flex flex-col gap-1'>
                  <label htmlFor="Email">Email</label>
                  <input
                    type="email"
                    placeholder='JohnDoe@gmail.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`border ${errors.email ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md`}
                    required
                  />
                  {/* Display email errors */}
                  {errors.email && (
                    <div className="text-red-500 text-sm">
                      {errors.email[0]}
                    </div>
                  )}
                </div>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="Phone">Phone</label>
                  <input
                    type="text"
                    placeholder='+254701203456'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`border ${errors.phone ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md`}
                    required
                  />
                  {/* Display email errors */}
                  {errors.phone && (
                    <div className="text-red-500 text-sm">
                      {errors.phone[0]}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-1'>
                  <label htmlFor="Password">Password</label>
                  <input
                    type="password"
                    placeholder='***********'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`border ${errors.password ? 'border-red-500' : 'border-neutral-400'} px-2 py-1 rounded-md`}
                    required
                  />
                  {/* Display password errors */}
                  {errors.password && (
                    <div className="text-red-500 text-sm">
                      {errors.password[0]}
                    </div>
                  )}
                </div>
                <div className='flex justify-center mt-4'>
                  <button
                    type='submit'
                    className='bg-Button rounded-md px-8 py-2 text-Headings w-3/4 '
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create Account '}
                  </button>
                </div>
              </form>
            </div>
            <div className='pt-4 text-neutral-400 flex items-center justify-center gap-3'>
              <hr className='w-1/4'/> <span>or Sign up with</span> <hr className='w-1/4'/>
            </div>
            <div className='flex justify-center items-center mt-4 gap-3'>
              {Auth.map((Auth,index)=>(
              <div key={index}className='flex border border-black rounded px-4 py-1'>
                {Auth.icon} {Auth.text}

              </div>

              ))}
      
            </div>
            <div className='flex justify-center pt-4'>
              <h1>Already have an account? {' '}
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
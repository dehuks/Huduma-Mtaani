import React, { useState, useEffect } from 'react';
import axiosInstance from "../../Constants/axiosInstance";
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

const AddServiceProvider = () => {
  // Initial form state
  const initialFormState = {
    fullName: '',
    email: '',
    phone: '',
    serviceId: '',
    password: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState({
    loading: false,
    error: '',
    success: false
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setStatus(prev => ({ ...prev, error: 'Authentication token not found. Please log in again.' }));
        return;
      }

      const response = await axiosInstance.get('/api/services', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setServices(response.data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      setStatus(prev => ({ 
        ...prev, 
        error: 'Failed to load services. Please refresh the page and try again.' 
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error/success messages when user starts typing again
    if (status.error || status.success) {
      setStatus(prev => ({ ...prev, error: '', success: false }));
    }
  };

  const validateForm = () => {
    // Basic validation
    if (!formData.fullName.trim()) return 'Full name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email address';
    if (!formData.phone.trim()) return 'Phone number is required';
    if (!formData.serviceId) return 'Please select a service';
    if (!formData.password || formData.password.length < 6) return 'Password must be at least 6 characters';
    
    return null; // No validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validateForm();
    if (validationError) {
      setStatus(prev => ({ ...prev, error: validationError }));
      return;
    }
    
    // Start submission process
    setStatus({ loading: true, error: '', success: false });
    
    // Get token
    const token = localStorage.getItem('authToken');
    if (!token) {
      setStatus({ loading: false, error: 'Authentication token not found. Please log in again.', success: false });
      return;
    }

    try {
      // Prepare data for API
      const serviceProviderData = {
        serviceId: parseInt(formData.serviceId, 10),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        ratingId: 1, // Default rating
        // Consider using a more secure method than just base64, or handle password securely on server side
        password: formData.password // Let the server handle password hashing
      };

      // Submit data
      const response = await axiosInstance.post(
        '/api/service-providers/create', // Changed endpoint based on REST conventions
        serviceProviderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Handle successful response
      if (response.status >= 200 && response.status < 300) {
        setStatus({ loading: false, error: '', success: true });
        setFormData(initialFormState); // Reset form
      } else {
        throw new Error('Unexpected response from server');
      }
    } catch (error) {
      console.error('Error creating service provider:', error);
      
      // Detailed error handling
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          error.message || 
                          'Failed to add service provider. Please try again.';
                          
      setStatus({ loading: false, error: errorMessage, success: false });
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Service Provider</h2>
      
      {status.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center gap-2">
          <AlertCircle size={18} />
          <span>{status.error}</span>
        </div>
      )}
      
      {status.success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center gap-2">
          <CheckCircle size={18} />
          <span>Service provider added successfully!</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">
            Full Name
          </label>
          <input
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="email">
            Email
          </label>
          <input
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter phone number with country code (e.g., +254...)"
            required
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="serviceId">
            Service
          </label>
          <select
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="serviceId"
            name="serviceId"
            value={formData.serviceId}
            onChange={handleChange}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.serviceName}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1" htmlFor="password">
            Password
          </label>
          <input
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter password (minimum 6 characters)"
            required
            minLength={6}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            className={`px-4 py-2 bg-blue-500 text-white rounded-md flex items-center gap-2 ${
              status.loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            type="submit"
            disabled={status.loading}
          >
            {status.loading && <Loader className="animate-spin" size={16} />}
            {status.loading ? 'Adding...' : 'Add Service Provider'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceProvider;
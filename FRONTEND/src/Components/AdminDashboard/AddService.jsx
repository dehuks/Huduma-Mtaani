import React, { useState } from 'react';
import axiosInstance from "../../Constants/axiosInstance"

const AddService = () => {
  const [formData, setFormData] = useState({
    serviceName: '',
    serviceDescription: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError('No authentication token found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      // Include the token in the request headers
      const response = await axiosInstance.post(
        'http://localhost:5228/api/services/create',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setSuccess(true);
        setFormData({
          serviceName: '',
          serviceDescription: ''
        });
      }
    } catch (err) {
      console.error('Error creating service:', err);
      setError(err.response?.data || 'Failed to create service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Service</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          Service created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="serviceName" className="text-sm font-medium text-gray-700 mb-1">
            Service Name
          </label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            value={formData.serviceName}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="serviceDescription" className="text-sm font-medium text-gray-700 mb-1">
            Service Description
          </label>
          <textarea
            id="serviceDescription"
            name="serviceDescription"
            value={formData.serviceDescription}
            onChange={handleChange}
            rows="4"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 bg-Button text-white rounded-md ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Creating...' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddService;
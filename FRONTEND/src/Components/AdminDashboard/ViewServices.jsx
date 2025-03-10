import React, { useState, useEffect } from 'react';
import axiosInstance from '../../Constants/axiosInstance';

const ViewServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    serviceName: '',
    serviceDescription: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // Retrieve the token from localStorage
      const token = localStorage.getItem('authToken');

      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Fetch services from the API
      const response = await axiosInstance.get('http://localhost:5228/api/services', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setServices(response.data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError(err.message || 'Failed to fetch services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setIsDeleting(true);
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }
        
        await axiosInstance.delete(`http://localhost:5228/api/services/${serviceId}/delete`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // Refresh services list after deletion
        fetchServices();
      } catch (err) {
        console.error('Error deleting service:', err);
        setError(err.message || 'Failed to delete service. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleEditClick = (service) => {
    setSelectedService(service);
    setEditFormData({
      serviceName: service.serviceName,
      serviceDescription: service.serviceDescription
    });
    setIsEditModalOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }
      
      await axiosInstance.put(`http://localhost:5228/api/services/${selectedService.serviceId}/update`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      // Refresh services list after update
      fetchServices();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating service:', err);
      setError(err.message || 'Failed to update service. Please try again.');
    }
  };

  // Filter services based on search term
  const filteredServices = services.filter(
    service => 
      service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.serviceDescription.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            className="mt-2 text-blue-600 hover:text-blue-800 underline"
            onClick={() => {
              setError(null);
              fetchServices();
            }}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Services</h1>
        <p className="text-gray-600">Browse available services for your business needs</p>
      </div>
      
      {/* Search and controls */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search services..."
            className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm">
          Add New Service
        </button>
      </div>

      {filteredServices.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.map((service) => (
                  <tr key={service.serviceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{service.serviceName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{service.serviceDescription}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        onClick={() => handleEditClick(service)}
                      >
                        Edit
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900"
                        onClick={() => handleDeleteService(service.serviceId)}
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 13.5V15m-6 4h12a2 2 0 002-2v-12a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No services found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? `No services matching "${searchTerm}"` : "There are no services available at the moment."}
          </p>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create New Service
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="relative bg-white rounded-lg shadow-lg p-6 m-4 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Edit Service</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleUpdateService}>
              <div className="mb-4">
                <label htmlFor="serviceName" className="block text-gray-700 text-sm font-bold mb-2">
                  Service Name
                </label>
                <input
                  type="text"
                  id="serviceName"
                  name="serviceName"
                  value={editFormData.serviceName}
                  onChange={handleEditInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="serviceDescription" className="block text-gray-700 text-sm font-bold mb-2">
                  Description
                </label>
                <textarea
                  id="serviceDescription"
                  name="serviceDescription"
                  value={editFormData.serviceDescription}
                  onChange={handleEditInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewServices;
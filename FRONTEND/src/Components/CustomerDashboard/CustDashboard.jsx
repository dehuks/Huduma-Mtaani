import React, { useState, useEffect } from 'react';
import { Menu, FolderKanban, FolderClock, Bell, Settings, LogOut } from 'lucide-react';
import { DashHistory } from '../../Constants';
import ProfileImage from '../../assets/images/profile-pictures/User3.png';
import { useNavigate } from 'react-router-dom';
import ServiceProvider from '../../Constants/ServiceProvider';
import { Link } from 'react-router-dom';
import axiosInstance from '../../Constants/axiosInstance';

const CustDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  // Fetch services from the API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          console.warn('No authentication token found. Some features may be limited.');
        }
        
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axiosInstance.get('http://localhost:5228/api/services', { headers });
        
        if (response.status === 200) {
          setServices(response.data);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    navigate('/');
  };

  // Function to handle service selection
  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
  };

  return (
    <div className='relative bg-neutral-100 flex'>
      {/* Sidebar */}
      <div className={`bg-white h-screen border-r border-neutral-200 transition-all duration-300 ${isSidebarOpen ? 'w-[250px]' : 'w-0 overflow-hidden'}`}>
        {isSidebarOpen && (
          <div className='pt-3 px-2'>
            <h1 className='lg:text-2xl md:text-xl text-lg'>Huduma Mtaani</h1>
          </div>
        )}

        {/* Sidebar Items */}
        {isSidebarOpen && (
          <div className='mt-8'>
            <div className='flex gap-3 py-1 px-2 border-l-[5px] border-Button-text bg-Placeholder w-full'>
              <p><FolderKanban /></p>
              <p className='font-bold'>Services</p>
            </div>
            
            {/* Services List */}
            <div className='mt-4 px-2'>
              {loading ? (
                <div className="py-4 px-2 text-gray-500">Loading services...</div>
              ) : error ? (
                <div className="py-2 px-2 text-red-500">{error}</div>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <div key={service.serviceId} className='py-2'>
                    <li 
                      className={`flex gap-3 hover:bg-Cards hover:py-1 hover:px-1 hover:rounded-md cursor-pointer ${selectedService === service.serviceName ? 'bg-Cards py-1 px-1 rounded-md font-medium' : ''}`}
                      onClick={() => handleServiceClick(service.serviceName)}
                    >
                      <p className='text-Icon-bg'>
                        {/* Default icon for all services */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </p> 
                      {service.serviceName}
                    </li>
                  </div>
                ))
              ) : (
                <div className="py-2 px-2 text-gray-500">No services available</div>
              )}
            </div>

            <div className='mt-8'>
              <div className='flex gap-3 py-1 px-2 border-l-[5px] border-Button-text bg-Placeholder w-full'>
                <p><FolderClock /></p>
                <p className='font-bold'>History</p>
              </div>
              <div className='px-2'>
                {DashHistory.map((history, index) => (
                  <div key={index} className='py-2'>
                    <li className='flex gap-3 hover:bg-Cards hover:py-1 hover:px-1 hover:rounded-md'>
                      <p className='text-Icon-bg'>{history.icon}</p> {history.text}
                    </li>
                  </div>
                ))}
              </div>
              <div className='mt-8 px-2 flex gap-3 cursor-pointer'>
                <p className='text-Icon-bg'><LogOut /></p>
                <p onClick={handleLogout}>Logout</p>
              </div>
              
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-[calc(100%-250px)]' : 'w-full'}`}>
        {/* Top Bar */}
        <div className='bg-white h-[50px]'>
          <div className='flex justify-between px-4 pt-3'>
            <div className='flex gap-3'>
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                <Menu />
              </button>
              <h2>Dashboard</h2>
            </div>
            <div>
              <ul className={`${isSidebarOpen ? 'hidden md:flex sm:flex gap-4 ' : 'flex gap-4'}`}>
                <li><Bell /></li>
                <li><Settings /></li>
                <li className="relative group">
                  <img 
                    src={ProfileImage} 
                    className='w-8 h-8 rounded-full cursor-pointer' 
                    alt='User Profile' 
                  />
                  {/* Tooltip */}
                  <div className="absolute right-0 mt-2 w-max opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-gray-800 text-white text-sm rounded py-1 px-2 z-10">
                    {userEmail}
                    {/* Tooltip arrow */}
                    <div className="absolute right-3 -top-1 w-2 h-2 bg-gray-800 transform rotate-45"></div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {selectedService ? (
            <ServiceProvider selectedService={selectedService} />
          ) : (
            <div className="p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold mb-4">Welcome to Huduma Mtaani</h2>
              <p className="text-gray-600 mb-6">Select a service from the sidebar to view available service providers.</p>
              
              {/* Quick access service cards */}
              {!loading && services.length > 0 && (
                <div className="w-full max-w-4xl">
                  <h3 className="text-lg font-semibold mb-4">Available Services</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <div 
                        key={service.serviceId}
                        className="bg-white p-4 rounded-lg shadow cursor-pointer hover:shadow-md transition-all hover:bg-blue-50"
                        onClick={() => handleServiceClick(service.serviceName)}
                      >
                        <h3 className="font-semibold text-lg mb-2">{service.serviceName}</h3>
                        <p className="text-sm text-gray-500">{service.serviceDescription}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustDashboard;
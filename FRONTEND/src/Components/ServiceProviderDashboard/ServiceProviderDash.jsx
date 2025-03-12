import React, { useState, useEffect } from 'react';
import { Menu, FolderKanban, FolderClock, Bell, Settings, LogOut, Calendar } from 'lucide-react';
import { DashHistory, DashServices, ServiceProviderDashServices } from '../../Constants';
import ProfileImage from '../../assets/images/profile-pictures/User3.png';
import { useNavigate } from 'react-router-dom';
import ServiceProvider from '../../Constants/ServiceProvider';
import { Link } from 'react-router-dom';
import ViewAllOrders from './VIewAllOrders';
import PendingOrders from './PendingOrders';
import CompletedOrders from './CompletedOrders';

const ServiceProviderDash = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [insights, setInsights] = useState([
    { Quantity: "0", Text: "Total Orders", Icon: <Calendar /> },
    { Quantity: "0", Text: "Pending Orders", Icon: <Calendar /> },
    { Quantity: "Ksh 0", Text: "Total Revenue", Icon: <Calendar /> }
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  // Fetch data for insights
  useEffect(() => {
    const fetchInsightsData = async () => {
      try {
        const response = await fetch('http://localhost:5228/api/orders');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const orders = await response.json();
        
        // Calculate insights
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status.toLowerCase() === 'pending').length;
        const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
        
        // Update insights state
        setInsights([
          { Quantity: totalOrders.toString(), Text: "Total Orders", Icon: <Calendar /> },
          { Quantity: pendingOrders.toString(), Text: "Pending Orders", Icon: <Calendar /> },
          { Quantity: `Ksh ${totalRevenue.toLocaleString()}`, Text: "Total Revenue", Icon: <Calendar /> }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching insights data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchInsightsData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Function to handle service selection
  const handleServiceClick = (serviceName) => {
    setSelectedService(serviceName);
  };

  // Function to reset to default view
  const handleDashboardClick = () => {
    setSelectedService(null);
  };

  // Function to render the appropriate component based on selected service
  const renderSelectedComponent = () => {
    switch(selectedService) {
      case 'All Orders':
        return <ViewAllOrders />;
      case 'Pending Orders':
        return <PendingOrders />;
      case 'Completed Orders':
        return <CompletedOrders />;
      default:
        // Default view - show insights
        return (
          <div className="p-6 grid md:grid-cols-3 grid-cols-1 gap-6 place-items-center">
            {loading ? (
              <div className="col-span-3 flex justify-center items-center">
                <p className="text-lg">Loading insights...</p>
              </div>
            ) : error ? (
              <div className="col-span-3 p-4 bg-red-100 text-red-700 rounded-md">
                <p>Error loading insights: {error}</p>
                <button 
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>
            ) : (
              insights.map((insight, index) => (
                <div key={index} className='flex gap-12 justify-between border border-Input-Outline rounded-md px-5 py-2 bg-white md:w-full w-2/3'>
                  <div>
                    <p className='text-3xl'>{insight.Quantity}</p>
                    <p className='text-neutral-500'>{insight.Text}</p>
                  </div>
                  <div className='text-white bg-Icon-bg rounded-full w-12 h-12 flex justify-center items-center'>
                    {insight.Icon}
                  </div>
                </div>
              ))
            )}
          </div>
        );
    }
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
            <div className='mt-4 px-2'>
              {ServiceProviderDashServices.map((service, index) => (
                <div key={index} className='py-2'>
                  <li 
                    className={`flex gap-3 hover:bg-Cards hover:py-1 hover:px-1 hover:rounded-md cursor-pointer ${selectedService === service.text ? 'bg-Cards py-1 px-1 rounded-md font-medium' : ''}`}
                    onClick={() => handleServiceClick(service.text)}
                  >
                    <p className='text-Icon-bg'>{service.icon}</p> {service.text}
                  </li>
                </div>
              ))}
            </div>

            <div className='mt-8 px-2 flex gap-3 cursor-pointer'>
              <p className='text-Icon-bg'><LogOut /></p>
              <p onClick={handleLogout}>Logout</p>
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
              <h2 onClick={handleDashboardClick} className='cursor-pointer'>Dashboard</h2>
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
          {renderSelectedComponent()}
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderDash;
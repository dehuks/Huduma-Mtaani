import React, { useState } from 'react';
import { Menu, FolderKanban, FolderClock, Bell, Settings, LogOut, Wrench, Cable } from 'lucide-react';
import { AdminDashServiceProviders, AdminDashServices, DashHistory } from '../../Constants';
import ProfileImage from '../../assets/images/profile-pictures/User3.png';
import { useNavigate } from 'react-router-dom';
import ServiceProvider from '../../Constants/ServiceProvider';
import { Link } from 'react-router-dom';
import AddService from './AddService'; // Import the AddService component
import ViewServices from './ViewServices';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedService, setSelectedService] = useState(null); // To track selected service
  const [showAddService, setShowAddService] = useState(false); // To track if "Add Service" is selected
  const [showViewServices, setShowViewServices] = useState(false); // To track if "View Services" is selected  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail');

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('token');
    navigate('/');
  };

  // Function to handle service selection
 // Function to handle service selection
 const handleServiceClick = (serviceName) => {
  if (serviceName === "Add Service") {
    setShowAddService(true);
    setShowViewServices(false);
    setSelectedService(null);
  } else if (serviceName === "View Services") {
    setShowViewServices(true);
    setShowAddService(false);
    setSelectedService(null);
  } else {
    setSelectedService(serviceName);
    setShowAddService(false);
    setShowViewServices(false);
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
              {AdminDashServices.map((service, index) => (
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

            <div className='mt-8'>
              <div className='flex gap-3 py-1 px-2 border-l-[5px] border-Button-text bg-Placeholder w-full'>
                <p><FolderKanban /></p>
                <p className='font-bold'>Service Providers</p>
              </div>
              <div className='mt-4 px-2'>
                {AdminDashServiceProviders.map((service, index) => (
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
            </div>

            <div className='mt-8 px-2 flex gap-3 cursor-pointer'>
              <p className='text-Icon-bg'><LogOut /></p>
              <p onClick={handleLogout}>Logout</p>
            </div>
            <div className='mt-5'>
              <Link to="/admin-dashboard">
                Admin Dashboard
              </Link>
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
          {showAddService ? (
            <AddService /> // Display the AddService form
          ) : showViewServices ? (
            <ViewServices /> // Display the ViewServices component
          ) : selectedService ? (
            <ServiceProvider selectedService={selectedService} />
          ) : (
            <div className="p-6 flex flex-col justify-center items-center">
              <h2 className="text-xl font-bold mb-4">Welcome to Huduma Mtaani</h2>
              <p className="text-gray-600 mb-6">Select a service from the sidebar to view available service providers.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
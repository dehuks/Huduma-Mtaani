import React, { useState } from 'react';
import { Menu, FolderKanban, FolderClock, Bell, Settings, LogOut } from 'lucide-react';
import { DashHistory, DashServices } from '../../Constants';
import ProfileImage from '../../assets/images/profile-pictures/User3.png';

const CustDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
              {DashServices.map((service, index) => (
                <div key={index} className='py-2'>
                  <li className='flex gap-3 hover:bg-Cards hover:py-1 hover:px-1 hover:rounded-md'>
                    <p className='text-Icon-bg'>{service.icon}</p> {service.text}
                  </li>
                </div>
              ))}
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
                <p>Logout</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Bar */}
      <div className={`bg-white h-[50px] transition-all duration-300 ${isSidebarOpen ? 'w-[calc(100%-250px)]' : 'w-full'}`}>
        <div className='flex justify-between px-4 pt-3'>
          <div className='flex gap-3'>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
              <Menu />
            </button>
            <h2 className={`${isSidebarOpen ? 'hidden md:block sm:block ' : 'block'}`}>Dashboard</h2>
          </div>
          <div>
            <ul className={`${isSidebarOpen ? 'hidden md:flex sm:flex gap-4 ' : 'flex gap-4'}`}>
              <li><Bell /></li>
              <li><Settings /></li>
              <li>
                <img src={ProfileImage} className='w-8 h-8 rounded-full' alt='User Profile' />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustDashboard;

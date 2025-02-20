import React from 'react'
import { Menu } from 'lucide-react'
import { DashServices } from '../../Constants'
import { FolderKanban } from 'lucide-react'

const CustDashboard = () => {
  return (
    <div className='relative bg-neutral-100 flex '>
      {/* Left Sidebar */}
      <div className='bg-white h-screen w-[250px] border-r-1  border-neutral-200'>
        <div className='pt-3 px-2 '>
          <h1 className='lg:text-2xl md:text-xl text:lg '>Huduma Mtaani</h1>
        </div>
        {/* Side Bar Items */}
        <div className=' mt-8'>
          <div className='flex gap-3 py-1 px-2 border-l-5 border-Button-text bg-Placeholder w-full'>
          <p><FolderKanban/></p>
          <p className='text-bold'>Services</p>

          </div>

          <div className='mt-4 px-2'>
          {DashServices.map((DashService,index)=>(
            <div className='py-2'>
              <li key={index} className='flex gap-3'>
              <p className='text-Icon-bg'>{DashService.icon}</p> {DashService.text}

              </li>



            </div>

          ))}
          </div>

        </div>


      </div>
      {/* Top Bar */}
      <div className='bg-white h-[50px] w-full'>
        <div className='flex gap-3 pt-3'>
        <div>
          <Menu/>

        </div>
      <div>
        <h2>Dashboard</h2>
      </div>
      </div>


      </div>

    </div>
  )
}

export default CustDashboard
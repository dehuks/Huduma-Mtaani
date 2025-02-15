import React from 'react'
import { services } from './index'

const ServicesCard = () => {
  return (
    <div className='grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 mt-3  place-items-center justify-center lg:gap-6 gap-4'>
        {services.map((service, index)=>(
        <div key={index} className='py-5 border bg-Cards rounded-md border-Input-Outline  px-4'>
        <div className='text-black w-fit bg-Icon-bg rounded-full p-2 '>
          {service.icon}
        </div>
        <div className='py-2 '>
            <p className='font-bold'>{service.title}</p>
        </div>
        <div>
            <p>{service.description}</p>
    
        </div>
        
    </div>
            
        ))}


    </div>
  )
}

export default ServicesCard
import React from 'react'
import ServicesCard from '../../Constants/ServicesCard'

const Services = () => {
  return (
    <div className='relative mt-10 mx-5'>
        {/* Services Info Section */}
        <div className='flex flex-col justify-center items-center text-center'>
        <h1 className='lg:text-4xl md:text-3xl text-xl'>We Connect you with Skilled <span>Service Providers</span> </h1>
        <div className='lg:w-1/2 md:w-2/3 w-2/3'>
        <p className='opacity-60 lg:text-xl md:text-md text-sm'>Our listed service providers are certfied and have the required skill set and experience to meet your expectations for whichever job.</p>
        </div>
        </div>

        {/* Services list */}
        <div className='mt-5'>
            <div>
            <p className='opacity-60'>Explore by Category:</p>
            </div>

            <div>
                <ServicesCard/>

            </div>

        </div>

    

    </div>
  )
}

export default Services
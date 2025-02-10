import React from 'react'
import InfoImage from '../../assets/images/Info.png'
import {steps} from '../../Constants/index'

const Info = () => {
  return (
    <div className='relative mt-10 mb-10 h-fit bg-Cards'>
        <div className='flex mx-5 place-items-center lg:gap-90 md:gap-24 '>
            <div>
                <img src={InfoImage} className='rounded hidden lg:block md:block' alt="" />
            </div>
            <div>
            <div className='flex flex-col mt-10 lg:me-20  '>
                <h1 className='lg:text-3xl md:text-2xl sm:text-xl text-lg'>Easy Access To <span>Services</span></h1>
                <p className='text-Headings opacity-80 lg:text-lg md:text-md sm:text-sm text-xs'>Outlined below is our Structured Customer-Service Provider Workflow.</p>
            </div>
            <div className="bg-blue-50 pt-6 rounded-lg max-w-lg">
      <div className="relative">
        {steps.map((step, index) => (
          <div key={index} className="flex items-start space-x-4 relative mb-6 last:mb-0">
            {/* Number Circle */}
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center bg-Icon-bg text-white rounded-full font-bold relative z-10">
                {step.number}
              </div>
              
              {/* Vertical Line (Only if not the last step) */}
              {index !== steps.length - 1 && (
                <div className="absolute left-1/2 top-11 h-full border-l-2 border-blue-400 transform -translate-x-1/2"></div>
              )}
            </div>

            {/* Text Content */}
            <div>
              <h3 className="font-bold">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className='py-6'>
        <button className='bg-Button text-white rounded-md px-4'>Get Started</button>
      </div>
    </div>
    </div>   
    </div>   
    </div>
  )
}

export default Info
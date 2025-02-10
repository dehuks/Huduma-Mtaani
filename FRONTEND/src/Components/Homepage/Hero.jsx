import React from 'react'
import HeroImage from '../../assets/images/Hero.png'

const Hero = () => {
  return (
    <div className='relative  mt-10 mx-5'>
        <div className='flex justify-between items-center'>
        <div className='lg:w-2/5 md:w-2/3 w-1/2'>
        <h1 className='text-Headings lg:text-7xl md:text-5xl text-4xl'>We create <span>convenience</span> for your problems</h1>
        <div className='mt-5'>
            <p className='opacity-60 lg:text-3xl md:text-xl text-md'>We connect you with the best service providers with just a click of a button.</p>
        </div>
        <div className='mt-5'>
            <button className='bg-Button rounded-md text-white font-medium md:px-2 md:py-1 px-1 py-1'>Request Services</button>
        </div>
        </div>
       
        <div>
            <img src={HeroImage} alt="" />
        </div>

        </div>
        
    </div>
  )
}

export default Hero
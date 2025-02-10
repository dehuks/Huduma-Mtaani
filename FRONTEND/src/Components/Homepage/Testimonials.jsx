import React from 'react'
import TestimonialsCard from '../../Constants/TestimonialsCard'

const Testimonials = () => {
  return (
    <div className='relative mt-10'>
        <div className='flex justify-center items-center'>
            <h1 className='lg:text-4xl md:text-3xl text-xl'>What <span>Clients</span> Say!</h1>
        </div>

        {/*Testimonials Card */}
        <div className='mt-5'>
             <TestimonialsCard/>
        </div>
        
    </div>
  )
}

export default Testimonials
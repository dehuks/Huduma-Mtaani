import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from './index';


const RatingStars = ({ rating }) => {
    const totalStars = 5;
    return (
      <div className="flex space-x-1">
        {[...Array(totalStars)].map((_, index) => (
          <Star 
            key={index} 
            size={24} 
            className={index < rating ? "text-CTA-card fill-CTA-card" : "text-black fill-Gray"} 
          />
        ))}
      </div>
    );
};

const TestimonialsCard = () => {
  return (
    <div className='grid lg:grid-cols-3 gap-4 mx-5 place-items-center  '>
     {testimonials.map((testimony, index)=>(
      <div key={index}  className='flex flex-col bg-Placeholder rounded-sm p-4'>
          <div className='flex bg-'>
          <div><img src={testimony.image} alt="" className='w-12 h-12 rounded-full' /></div>
          <div className='flex px-3 flex-col'>
            <p className="font-bold">{testimony.user}</p>
            <p className="text-gray-500">{testimony.location}</p>
          </div>
        </div>
        <p className="mt-2">Using Huduma Mtaani was really a game changer, I totally recommend.</p>
        <div className="py-3">
          <RatingStars rating={testimony.rating} /> {/* Change rating dynamically */}
        </div>  
        </div>
        ))}
        
      
    </div>
  );
};

export default TestimonialsCard;

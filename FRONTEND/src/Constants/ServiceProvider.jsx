import React from 'react';
import { Star, MapPin, Phone, Calendar } from 'lucide-react';
import { serviceProvidersData } from '.'; // Ensure correct import path

const ServiceProvider = ({ selectedService }) => {
  // Get providers for the selected service or return an empty array if not found
  const providers = serviceProvidersData[selectedService] || [];

  if (!selectedService || providers.length === 0) {
    return (
      <div className="text-center p-4">
        {selectedService
          ? `No ${selectedService} providers available`
          : 'Select a service to view providers'}
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">{selectedService} Service Providers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider, index) => (
          <div key={index} className="border rounded-lg p-4 shadow-md flex flex-col justify-center items-center">
            {/* <div className='flex justify-end'>
           <p className="mt-1 tracking-tight text-Sub-Headings">Ksh 650/hr</p>
           </div> */}
           <div>
            <img src={provider.image} className='w-24 h-24 rounded-full' alt="" />
            </div>
            <div className='flex flex-col justify-center items-center pt-4'>
            <h3 className="text-lg font-semibold">{provider.name}</h3>
            <p className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-CTA-card text-CTA-card" />
              {provider.rating} ({provider.reviews} reviews)
            </p>


            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-1 bg-Button text-white rounded-md">Request Services</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProvider;

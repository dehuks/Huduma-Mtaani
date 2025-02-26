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
          <div key={index} className="border rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold">{provider.name}</h3>
            <p className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              {provider.rating} ({provider.reviews} reviews)
            </p>
            <p className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-gray-600" />
              {provider.location}
            </p>
            <p className="flex items-center gap-1">
              <Phone className="w-4 h-4 text-blue-500" />
              {provider.phone}
            </p>
            <p className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-green-500" />
              {provider.availability}
            </p>
            <p className="mt-2 font-semibold">Ksh 650/hr</p>
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg">Book Now</button>
              <button className="px-4 py-2 border border-gray-400 rounded-lg">Contact</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceProvider;

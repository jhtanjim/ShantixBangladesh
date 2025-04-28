import React from 'react';
import { FaApple, FaLinux } from 'react-icons/fa';
import { SiBmw, SiSamsung } from 'react-icons/si'; // 🛑 Added SiSamsung

const Partner = () => {
  const partners = [
    {
      logo: <FaApple className="text-6xl text-gray-700 hover:text-black transition-colors duration-300" />,
      name: "Apple"
    },
    {
      logo: <SiSamsung className="text-6xl text-gray-700 hover:text-blue-500 transition-colors duration-300" />, // 👈 Real Samsung icon!
      name: "Samsung"
    },
    {
      logo: <FaLinux className="text-6xl text-gray-700 hover:text-black transition-colors duration-300" />,
      name: "Linux"
    },
    {
      logo: <SiBmw className="text-6xl text-gray-700 hover:text-black transition-colors duration-300" />,
      name: "BMW"
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-blue-600 mb-16 italic">Our Partners</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 place-items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center space-y-4">
              {partner.logo}
              <span className="text-gray-600 text-lg font-semibold">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partner;

import React from 'react';

type CardProps = {
  imageUrl: string;
  imageAlt: string;
  year: string;
  title: string;
  price: string;
  priceLabel: string;
  engineCC: string;
  transmission: string;
};

const Card: React.FC<CardProps> = ({
  imageUrl,
  imageAlt,
  year,
  title,
  price,
  priceLabel,
  engineCC,
  transmission
}) => {
  return (
    <div className="w-full overflow-hidden rounded-lg shadow-lg bg-white">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={imageAlt} 
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute top-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded text-sm font-medium">
          {year}
        </div>
      </div>

      {/* Main title and price section */}
      <div className="bg-blue-900 text-white text-center py-3">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm font-bold">{priceLabel}: {price}</p>
      </div>

      {/* Specifications footer */}
      <div className="flex justify-between bg-blue-900 text-white py-2 px-4 border-t border-white">
        <div className="flex items-center">
          <div className="w-5 h-5 mr-1 rounded-full bg-red-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-bold">{engineCC}</span>
        </div>

        <div className="flex items-center">
          <div className="w-5 h-5 mr-1 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="text-sm font-bold">{transmission}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
